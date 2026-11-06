"use client";

import { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Bookmark,
  Calendar,
  Building,
  MapPin,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SEED_PROFILE, SEED_OPPORTUNITIES } from "@/constants/seedData";
import { evaluateEligibility } from "@/features/eligibility/engine";
import { OpportunityCategory, WorkMode } from "@/types";

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["opp-1", "opp-3"]));

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredOpps = SEED_OPPORTUNITIES.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.organisation.toLowerCase().includes(search.toLowerCase()) ||
      opp.required_skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || opp.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunity Discovery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated student roles with real-time explainable eligibility based on your profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1">
            {filteredOpps.length} Opportunities Found
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or skills (e.g. React, Python)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "internship", "hackathon", "scholarship", "fellowship", "job"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize text-xs whitespace-nowrap h-9"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpps.map((opp) => {
          const eligibility = evaluateEligibility(SEED_PROFILE, opp);
          const isSaved = savedIds.has(opp.id);

          return (
            <Card key={opp.id} className="p-5 flex flex-col justify-between hover:border-primary/50 transition-all border-border shadow-xs">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" /> {opp.organisation}
                    </span>
                    <h3 className="text-base font-semibold mt-1 leading-snug">{opp.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleSave(opp.id)}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
                    title={isSaved ? "Saved" : "Save opportunity"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                  <span>•</span>
                  <span className="capitalize">{opp.work_mode}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {opp.currency} {opp.stipend_min?.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {opp.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Explainable Eligibility Verdict Banner */}
                <div className={`p-2.5 rounded-md text-xs border ${
                  eligibility.verdict === "eligible"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                    : eligibility.verdict === "needs_info"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300"
                }`}>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1">
                      {eligibility.verdict === "eligible" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {eligibility.verdict === "eligible" ? "Eligible" : eligibility.verdict === "needs_info" ? "Verify Criteria" : "Not Eligible"}
                    </span>
                    <span className="text-[11px] font-bold">{eligibility.score}% Match</span>
                  </div>

                  <ul className="mt-1.5 space-y-0.5 text-[11px] opacity-90 pl-4 list-disc">
                    {eligibility.reasons.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                    {eligibility.missing_information.slice(0, 1).map((m, i) => (
                      <li key={`m-${i}`} className="text-amber-600 dark:text-amber-400">{m}</li>
                    ))}
                    {eligibility.disqualifying_reasons.slice(0, 1).map((d, i) => (
                      <li key={`d-${i}`} className="text-rose-600 dark:text-rose-400">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={opp.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <Button size="sm" className="h-8 gap-1.5 text-xs">
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
