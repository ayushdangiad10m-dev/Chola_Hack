import { PriorityItem, Task, UserOpportunity, PriorityLevel } from "@/types";

/**
 * Deterministic explainable Priority Scoring:
 * Priority Score = Urgency Weight + Importance Weight + Status Adjustment + Overdue Bonus
 */
export function calculatePriorityQueue(
  tasks: Task[],
  userOpportunities: UserOpportunity[],
  currentDate?: Date
): PriorityItem[] {
  const items: PriorityItem[] = [];
  const now = currentDate || new Date("2026-11-05T00:00:00Z");

  // 1. Process tasks into priority items
  for (const task of tasks) {
    if (task.status === "completed" || task.status === "dismissed") continue;

    const dueDate = new Date(task.due_at);
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isOverdue = diffHours < 0;

    let urgencyScore = 0;
    if (isOverdue) urgencyScore = 50 + Math.min(Math.abs(diffHours) / 2, 30);
    else if (diffHours <= 24) urgencyScore = 40;
    else if (diffHours <= 72) urgencyScore = 25;
    else if (diffHours <= 168) urgencyScore = 15;
    else urgencyScore = 5;

    let importanceScore = 10;
    if (task.priority === "critical") importanceScore = 40;
    else if (task.priority === "high") importanceScore = 30;
    else if (task.priority === "medium") importanceScore = 20;

    const calculated_score = Math.round(urgencyScore + importanceScore);

    let priority: PriorityLevel = "low";
    if (calculated_score >= 65) priority = "critical";
    else if (calculated_score >= 45) priority = "high";
    else if (calculated_score >= 25) priority = "medium";

    items.push({
      id: `task-${task.id}`,
      item_type: "task",
      title: task.title,
      source: task.source_type === "email" ? "Extracted from Email" : "Task List",
      priority,
      calculated_score,
      due_at: task.due_at,
      status: task.status,
      recommended_action: task.opportunity_id
        ? "Work on application deliverable"
        : "Complete task before deadline",
      task_id: task.id,
      opportunity_id: task.opportunity_id,
    });
  }

  // 2. Process active user applications/deadlines
  for (const uo of userOpportunities) {
    if (uo.status === "offered" || uo.status === "rejected" || uo.status === "withdrawn") continue;

    const deadlineDate = new Date(uo.opportunity.deadline);
    const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isOverdue = diffHours < 0;

    // If deadline is still relevant or pending submission
    if (uo.status === "saved" || uo.status === "interested" || uo.status === "applying") {
      let urgencyScore = 0;
      if (isOverdue) urgencyScore = 60;
      else if (diffHours <= 24) urgencyScore = 45;
      else if (diffHours <= 72) urgencyScore = 30;
      else if (diffHours <= 168) urgencyScore = 20;
      else urgencyScore = 10;

      const importanceScore = 35; // Application submissions have high inherent value
      const calculated_score = Math.round(urgencyScore + importanceScore);

      let priority: PriorityLevel = "low";
      if (calculated_score >= 70) priority = "critical";
      else if (calculated_score >= 50) priority = "high";
      else if (calculated_score >= 30) priority = "medium";

      items.push({
        id: `deadline-${uo.id}`,
        item_type: "deadline",
        title: `Submit application for ${uo.opportunity.title}`,
        source: uo.opportunity.organisation,
        priority,
        calculated_score,
        due_at: uo.opportunity.deadline,
        status: uo.status,
        recommended_action: "Complete eligibility checklist and submit",
        opportunity_id: uo.opportunity_id,
        application_id: uo.id,
      });
    }
  }

  // Sort descending by calculated score
  return items.sort((a, b) => b.calculated_score - a.calculated_score);
}
