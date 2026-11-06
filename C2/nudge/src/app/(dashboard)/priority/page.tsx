"use client";

import { useState } from "react";
import {
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculatePriorityQueue } from "@/features/priority/engine";
import { SEED_TASKS, SEED_USER_OPPORTUNITIES } from "@/constants/seedData";
import { formatRelativeDeadline } from "@/lib/utils";
import { PriorityLevel } from "@/types";

export default function PriorityPage() {
  const [filter, setFilter] = useState<"all" | "today" | "urgent">("all");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const queue = calculatePriorityQueue(SEED_TASKS, SEED_USER_OPPORTUNITIES);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQueue = queue.filter((item) => {
    if (completedIds.has(item.id)) return false;
    if (filter === "urgent") return item.priority === "critical" || item.priority === "high";
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h1 className="text-2xl font-bold tracking-tight">Unified Priority Queue</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Deterministic ranking combining application deadlines, email actions, and daily tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All Items ({queue.length - completedIds.size})
          </Button>
          <Button
            size="sm"
            variant={filter === "urgent" ? "default" : "outline"}
            onClick={() => setFilter("urgent")}
            className="text-xs"
          >
            🔥 High Urgency Only
          </Button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border text-xs flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">Scoring Formula</span>
          <p className="text-muted-foreground">
            Rank Score = Urgency (Hours to Deadline) + Strategic Importance + Application Stage Weight
          </p>
        </div>
        <Badge variant="outline" className="bg-background shrink-0">
          Deterministic Rule Engine
        </Badge>
      </div>

      {/* Priority Action Cards */}
      <div className="space-y-3">
        {filteredQueue.map((item, index) => {
          const rel = formatRelativeDeadline(item.due_at);

          return (
            <Card
              key={item.id}
              className="p-5 border-border hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleComplete(item.id)}
                  className="mt-1 w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-primary flex items-center justify-center transition-colors"
                  title="Mark as done"
                >
                  <span className="sr-only">Complete</span>
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <Badge
                      variant={
                        item.priority === "critical"
                          ? "critical"
                          : item.priority === "high"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {item.priority.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.source}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                      Score: {item.calculated_score}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold leading-snug">{item.title}</h3>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="font-medium text-foreground">Recommended:</span>{" "}
                    {item.recommended_action}
                  </p>
                </div>
              </div>

              {/* Deadline & Quick Action */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                <div className="text-left md:text-right">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                      rel.isOverdue
                        ? "bg-rose-500/15 text-rose-500"
                        : rel.isUrgent
                        ? "bg-amber-500/15 text-amber-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {rel.text}
                  </span>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(item.due_at).toLocaleDateString()}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => toggleComplete(item.id)}
                  className="h-8 text-xs gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredQueue.length === 0 && (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold">Priority Queue Clear!</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You've cleared all urgent deadlines and tasks for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
