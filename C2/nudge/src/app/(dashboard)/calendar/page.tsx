"use client";

import { Calendar as CalendarIcon, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEED_CALENDAR_EVENTS } from "@/constants/seedData";

export default function CalendarPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Schedule & Deadlines</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Synchronized calendar of all application closing dates, hackathon events, and task milestones
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {SEED_CALENDAR_EVENTS.map((event) => (
          <Card key={event.id} className="p-4 border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary shrink-0">
                <span className="text-[10px] font-bold uppercase">
                  {new Date(event.starts_at).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-sm font-black leading-none">
                  {new Date(event.starts_at).getDate()}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{event.title}</h3>
                  <Badge variant={event.event_type === "deadline" ? "critical" : "warning"} className="text-[10px]">
                    {event.event_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="text-xs">
              Google Cal Ready
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
