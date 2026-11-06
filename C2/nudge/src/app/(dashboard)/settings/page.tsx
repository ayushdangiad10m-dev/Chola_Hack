"use client";

import { Settings, Shield, Moon, Bell, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure authentication, integrations, themes, and notification preferences
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-5 border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Interface Theme</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch between Light and Dark mode with system preference persistence
            </p>
          </div>
          <ThemeToggle />
        </Card>

        <Card className="p-5 border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Supabase Backend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              PostgreSQL database with Row Level Security (RLS) policies
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Demo / Ready for ENV
          </Badge>
        </Card>

        <Card className="p-5 border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Gmail OAuth Integration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scan newsletter emails & extract actionable deadlines
            </p>
          </div>
          <Badge variant="success" className="text-xs">
            Sandbox Active
          </Badge>
        </Card>
      </div>
    </div>
  );
}
