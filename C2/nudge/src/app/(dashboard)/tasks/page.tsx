"use client";

import { useState } from "react";
import { CheckSquare, Plus, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SEED_TASKS } from "@/constants/seedData";
import { Task, TaskStatus } from "@/types";
import { formatRelativeDeadline } from "@/lib/utils";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("active");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus: TaskStatus = t.status === "completed" ? "todo" : "completed";
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "active") return t.status !== "completed";
    if (activeTab === "completed") return t.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Deadlines, submissions, and deliverables linked to applications and email evidence
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["active", "completed", "all"].map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab as any)}
              className="capitalize text-xs"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredTasks.map((task) => {
          const isDone = task.status === "completed";
          const rel = formatRelativeDeadline(task.due_at);

          return (
            <Card
              key={task.id}
              className={`p-4 border-border transition-all flex items-start justify-between gap-3 ${
                isDone ? "opacity-60 bg-secondary/30" : "hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        task.priority === "critical"
                          ? "critical"
                          : task.priority === "high"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground capitalize">
                      {task.category.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-medium text-muted-foreground block">
                  {rel.text}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(task.due_at).toLocaleDateString()}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
