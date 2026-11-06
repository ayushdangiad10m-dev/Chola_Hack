"use client";

import { useState } from "react";
import { Kanban, ArrowRight, ExternalLink, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEED_USER_OPPORTUNITIES } from "@/constants/seedData";
import { ApplicationStatus } from "@/types";

const STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "saved", label: "Saved" },
  { key: "interested", label: "Interested" },
  { key: "applying", label: "Applying" },
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "Assessment" },
  { key: "interview", label: "Interview" },
];

export default function TrackerPage() {
  const [apps, setApps] = useState(SEED_USER_OPPORTUNITIES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Visual pipeline to track your opportunities from discovery to interview and offer
          </p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = apps.filter((a) => a.status === stage.key);

          return (
            <div
              key={stage.key}
              className="bg-secondary/40 border border-border rounded-lg p-3 flex flex-col min-w-[200px]"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <span className="text-xs font-bold text-foreground">{stage.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background text-muted-foreground font-semibold">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {stageApps.map((app) => (
                  <Card key={app.id} className="p-3 border-border hover:border-primary/40 transition-all shadow-xs">
                    <span className="text-[10px] font-semibold text-muted-foreground block">
                      {app.opportunity.organisation}
                    </span>
                    <h4 className="text-xs font-bold mt-0.5 leading-snug">
                      {app.opportunity.title}
                    </h4>

                    {app.next_action && (
                      <p className="text-[11px] text-muted-foreground mt-2 bg-secondary/80 p-1.5 rounded">
                        Next: {app.next_action}
                      </p>
                    )}

                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{new Date(app.opportunity.deadline).toLocaleDateString()}</span>
                      <a
                        href={app.opportunity.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </Card>
                ))}

                {stageApps.length === 0 && (
                  <div className="h-20 flex items-center justify-center text-[11px] text-muted-foreground/60 border border-dashed rounded border-border/60">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
