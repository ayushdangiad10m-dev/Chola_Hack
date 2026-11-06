"use client";

import { useState } from "react";
import {
  Mail,
  RefreshCw,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SEED_EMAIL_EVIDENCE } from "@/constants/seedData";

export default function InboxPage() {
  const [syncing, setSyncing] = useState(false);
  const [evidenceList, setEvidenceList] = useState(SEED_EMAIL_EVIDENCE);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  const handleConfirmTask = (id: string) => {
    setEvidenceList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, processing_status: "confirmed" } : e))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Gmail Intelligence & Tasks</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automated scanning of college newsletters and applicant portals for tasks and hidden opportunities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSync}
            disabled={syncing}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Scanning Inbox..." : "Sync Messages"}
          </Button>
        </div>
      </div>

      {/* Integration Status Bar */}
      <div className="p-4 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Gmail Connected (Demo / Sandbox)</span>
              <Badge variant="success" className="text-[10px] py-0 px-1.5">
                OAuth Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Account: <span className="font-mono">shivraj@university.edu</span> · Read-only metadata scope
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground sm:text-right">
          <div>Last synced: Just now</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            2 actionable items identified
          </div>
        </div>
      </div>

      {/* Extracted Intelligence List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI-Extracted Action Items
          </h2>
          <span className="text-xs text-muted-foreground">
            Zod-schema validated · Zero hallucination mode
          </span>
        </div>

        {evidenceList.map((item) => (
          <Card key={item.id} className="p-5 border-border space-y-4">
            {/* Email Header Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-xs font-semibold text-primary">{item.sender}</span>
                <h3 className="text-sm font-bold mt-0.5">{item.subject}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  Confidence: {item.extraction_confidence}%
                </Badge>
                <a
                  href={item.gmail_message_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                >
                  View in Gmail <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Extracted Structured Task Details */}
            <div className="p-3 rounded-md bg-secondary/50 border border-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  🎯 Extracted Action: {item.extracted_data.required_action}
                </span>
                {item.extracted_data.deadline && (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {new Date(item.extracted_data.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {item.extracted_data.summary}
              </p>
            </div>

            {/* Email Evidence Snippet */}
            <div className="text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-3 py-0.5">
              "{item.snippet}"
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-muted-foreground">
                Status: {item.processing_status === "confirmed" ? "✓ Task Created in Priority Queue" : "Review Required"}
              </span>

              <div className="flex items-center gap-2">
                {item.processing_status === "confirmed" ? (
                  <Button size="sm" variant="outline" disabled className="h-8 text-xs gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Confirmed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmTask(item.id)}
                    className="h-8 text-xs gap-1"
                  >
                    Confirm & Add to Priority <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
