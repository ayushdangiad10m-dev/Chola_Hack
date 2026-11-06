"use client";

import Link from "next/link";
import {
  Flame,
  Sparkles,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Building,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SEED_PROFILE,
  SEED_OPPORTUNITIES,
  SEED_TASKS,
  SEED_USER_OPPORTUNITIES,
} from "@/constants/seedData";
import { evaluateEligibility } from "@/features/eligibility/engine";
import { calculatePriorityQueue } from "@/features/priority/engine";
import { formatRelativeDeadline, cn } from "@/lib/utils";

export default function DashboardPage() {
  const priorityItems = calculatePriorityQueue(SEED_TASKS, SEED_USER_OPPORTUNITIES);
  const topPriorities = priorityItems.slice(0, 4);

  // Recommendations calculated with eligibility engine
  const evaluatedOpps = SEED_OPPORTUNITIES.map((opp) => ({
    opportunity: opp,
    eligibility: evaluateEligibility(SEED_PROFILE, opp),
  })).sort((a, b) => b.eligibility.score - a.eligibility.score);

  const topRecommendations = evaluatedOpps.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Good morning, {SEED_PROFILE.full_name}</h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            NIT Bangalore · B.Tech CS (Year 3) · 88% profile complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/opportunities">
            <Button variant="outline" size="sm">Explore 15+ Matches</Button>
          </Link>
          <Link href="/priority">
            <Button size="sm" className="gap-1.5">
              <Flame className="w-4 h-4 text-amber-300" />
              Focus Mode
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Eligible Opportunities</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-2">12</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> 4 new added this week
          </p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Actionable Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{SEED_TASKS.filter(t => t.status !== "completed").length}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            2 due in next 48h
          </p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Applications</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{SEED_USER_OPPORTUNITIES.length}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            1 in review stage
          </p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Inbox Synced</span>
            <Lightbulb className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">2 Detected</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            From college & devpost emails
          </p>
        </Card>
      </div>

      {/* 3. Core Split: Unified Priority Queue vs Match Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Action Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="font-semibold text-base">What Needs Your Attention Today</h2>
            </div>
            <Link href="/priority" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all {priorityItems.length} items <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {topPriorities.map((item) => {
              const rel = formatRelativeDeadline(item.due_at);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          item.priority === "critical"
                            ? "critical"
                            : item.priority === "high"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {item.priority}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{item.source}</span>
                    </div>
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      💡 {item.recommended_action}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded",
                      rel.isOverdue ? "bg-rose-500/10 text-rose-500" : rel.isUrgent ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground"
                    )}>
                      {rel.text}
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recommended Opportunities with Explainable Eligibility (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-base">Top Opportunities For You</h2>
            </div>
            <Link href="/opportunities" className="text-xs text-primary font-medium hover:underline">
              Explore
            </Link>
          </div>

          <div className="space-y-3">
            {topRecommendations.map(({ opportunity: opp, eligibility }) => (
              <Card key={opp.id} className="p-4 border-border hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Building className="w-3 h-3" /> {opp.organisation}
                    </span>
                    <h3 className="text-sm font-semibold mt-1 leading-snug hover:text-primary transition-colors">
                      <Link href={`/opportunities`}>{opp.title}</Link>
                    </h3>
                  </div>
                  <Badge
                    variant={
                      eligibility.verdict === "eligible"
                        ? "success"
                        : eligibility.verdict === "needs_info"
                        ? "warning"
                        : "critical"
                    }
                  >
                    {eligibility.score}% Match
                  </Badge>
                </div>

                <div className="mt-3 p-2 rounded bg-secondary/50 text-[11px] space-y-1">
                  <div className="font-medium text-foreground flex items-center gap-1">
                    {eligibility.verdict === "eligible" ? (
                      <span className="text-emerald-500">✓ Fully eligible</span>
                    ) : (
                      <span className="text-amber-500">ℹ Check criteria</span>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-1">
                    {eligibility.reasons[0] || "All student constraints met"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                  <span>{opp.location}</span>
                  <span className="font-semibold text-foreground">{opp.currency} {opp.stipend_min?.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
