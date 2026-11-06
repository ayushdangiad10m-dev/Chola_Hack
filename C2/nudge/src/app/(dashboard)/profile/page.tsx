"use client";

import { User, Award, BookOpen, GraduationCap, MapPin, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEED_PROFILE } from "@/constants/seedData";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <Card className="p-6 border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-xl font-bold text-primary">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{SEED_PROFILE.full_name}</h1>
                <Badge variant="success" className="text-[10px]">Verified Student</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{SEED_PROFILE.email}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <GraduationCap className="w-3.5 h-3.5" /> {SEED_PROFILE.institution}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Profile Completion</span>
            <span className="text-2xl font-bold text-primary">{SEED_PROFILE.profile_completion}%</span>
          </div>
        </div>
      </Card>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-border space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Academic Details
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Degree</span>
              <span className="font-medium">{SEED_PROFILE.degree}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Academic Year</span>
              <span className="font-medium">Year {SEED_PROFILE.current_year} (Grad: {SEED_PROFILE.graduation_year})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Current CGPA</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{SEED_PROFILE.cgpa} / 10.0</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{SEED_PROFILE.city}, {SEED_PROFILE.country}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Verified Skills
          </h3>
          <p className="text-xs text-muted-foreground">
            Used directly by the Explainable Eligibility Engine to match opportunities:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SEED_PROFILE.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs font-medium">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
