export type OpportunityCategory =
  | "internship"
  | "hackathon"
  | "scholarship"
  | "competition"
  | "job"
  | "fellowship"
  | "research"
  | "workshop"
  | "other";

export type WorkMode = "remote" | "onsite" | "hybrid";

export type EligibilityVerdict = "eligible" | "not_eligible" | "unsure" | "needs_info";

export type PriorityLevel = "critical" | "high" | "medium" | "low";

export type TaskStatus = "todo" | "in_progress" | "completed" | "dismissed";

export type TaskCategory =
  | "application"
  | "submission"
  | "email_followup"
  | "preparation"
  | "documentation"
  | "event"
  | "personal"
  | "other";

export type ApplicationStatus =
  | "saved"
  | "interested"
  | "applying"
  | "applied"
  | "assessment"
  | "interview"
  | "result_pending"
  | "offered"
  | "rejected"
  | "withdrawn";

export interface StudentProfile {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  institution?: string;
  country?: string;
  city?: string;
  degree?: string;
  branch?: string;
  current_year?: number;
  graduation_year?: number;
  cgpa?: number;
  skills: string[];
  interests: OpportunityCategory[];
  preferred_work_modes?: WorkMode[];
  preferred_locations?: string[];
  bio?: string;
  profile_completion: number;
}

export interface StructuredEligibilityRule {
  field: "degree" | "branch" | "current_year" | "graduation_year" | "cgpa" | "skills" | "work_mode";
  operator: "eq" | "neq" | "gte" | "lte" | "in" | "contains_any" | "contains_all";
  value: any;
  label: string;
  mandatory: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  organisation: string;
  category: OpportunityCategory;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  required_skills: string[];
  location: string;
  work_mode: WorkMode;
  stipend_min?: number;
  stipend_max?: number;
  currency: string;
  application_url: string;
  source_type: "curated" | "verified" | "email" | "user_submitted";
  source_url?: string;
  verification_status: "verified" | "unverified" | "pending";
  published_at: string;
  deadline: string;
  is_active: boolean;
  eligibility_rules: StructuredEligibilityRule[];
}

export interface EligibilityResult {
  opportunity_id: string;
  verdict: EligibilityVerdict;
  score: number; // 0 - 100 match percentage
  reasons: string[];
  missing_information: string[];
  disqualifying_reasons: string[];
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: PriorityLevel;
  due_at: string;
  completed_at?: string;
  opportunity_id?: string;
  opportunity?: Opportunity;
  email_evidence_id?: string;
  source_type: "manual" | "opportunity" | "email" | "system";
  created_at: string;
  updated_at: string;
}

export interface UserOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  opportunity: Opportunity;
  status: ApplicationStatus;
  saved_at: string;
  applied_at?: string;
  personal_notes?: string;
  next_action?: string;
  timeline: {
    stage: ApplicationStatus;
    updated_at: string;
    note?: string;
  }[];
}

export interface PriorityItem {
  id: string;
  item_type: "task" | "deadline" | "email_action" | "application_followup";
  title: string;
  source: string;
  priority: PriorityLevel;
  calculated_score: number;
  due_at: string;
  status: string;
  recommended_action: string;
  opportunity_id?: string;
  task_id?: string;
  application_id?: string;
}

export interface EmailEvidence {
  id: string;
  user_id: string;
  provider_message_id: string;
  subject: string;
  sender: string;
  received_at: string;
  gmail_message_url?: string;
  snippet: string;
  extracted_data: {
    opportunity_title?: string;
    organisation?: string;
    opportunity_category?: OpportunityCategory;
    summary: string;
    deadline?: string;
    event_date?: string;
    required_action?: string;
    required_documents?: string[];
    application_url?: string;
    skills?: string[];
  };
  extraction_confidence: number;
  processing_status: "pending_review" | "confirmed" | "dismissed";
  related_opportunity_id?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  event_type: "deadline" | "task" | "interview" | "event" | "reminder";
  opportunity_id?: string;
  task_id?: string;
  status: "confirmed" | "pending";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: "deadline" | "task" | "email" | "opportunity" | "system";
  related_entity_type?: "opportunity" | "task" | "email" | "application";
  related_entity_id?: string;
  read_at?: string;
  created_at: string;
}
