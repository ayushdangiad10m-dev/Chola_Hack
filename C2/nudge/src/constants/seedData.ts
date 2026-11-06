import { Opportunity, StudentProfile, Task, UserOpportunity, EmailEvidence, CalendarEventItem, NotificationItem } from "@/types";

export const SEED_PROFILE: StudentProfile = {
  id: "student-1",
  full_name: "Shivraj Sharma",
  email: "shivraj@university.edu",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  institution: "National Institute of Technology",
  degree: "B.Tech Computer Science & Engineering",
  branch: "Computer Science",
  current_year: 3,
  graduation_year: 2026,
  cgpa: 8.6,
  country: "India",
  city: "Bangalore",
  skills: ["React", "TypeScript", "Python", "Node.js", "SQL", "Tailwind CSS", "Git", "REST APIs"],
  interests: ["internship", "hackathon", "scholarship", "research"],
  preferred_work_modes: ["remote", "hybrid"],
  preferred_locations: ["Bangalore", "Remote"],
  bio: "Passionate CS pre-final year student building high-impact web apps and exploring developer tooling.",
  profile_completion: 88,
};

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Full-Stack Software Engineering Intern (Summer 2026)",
    slug: "stripe-swe-intern-2026",
    organisation: "Stripe",
    category: "internship",
    description: "Join Stripe's Core Engineering organization to design and build financial infrastructure that powers global internet commerce. Work alongside senior engineers on production systems.",
    requirements: [
      "Pursuing a degree in Computer Science, Software Engineering or related discipline",
      "Expected graduation in 2026 or 2027",
      "Proficiency in modern TypeScript, React, Python, or Ruby",
      "Strong CS fundamentals in data structures and distributed systems"
    ],
    required_skills: ["TypeScript", "React", "Python", "SQL"],
    location: "Bangalore / Remote",
    work_mode: "hybrid",
    stipend_min: 120000,
    stipend_max: 150000,
    currency: "INR/mo",
    application_url: "https://stripe.com/jobs",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-25T00:00:00Z",
    deadline: "2026-11-15T23:59:59Z",
    is_active: true,
    eligibility_rules: [
      { field: "current_year", operator: "in", value: [2, 3], label: "Eligible for 2nd and 3rd year students", mandatory: true },
      { field: "cgpa", operator: "gte", value: 7.5, label: "Minimum CGPA 7.5", mandatory: true },
      { field: "work_mode", operator: "eq", value: "hybrid", label: "Hybrid location model", mandatory: false }
    ]
  },
  {
    id: "opp-2",
    title: "Global AI Agents Hackathon 2026",
    slug: "global-ai-agents-hackathon-2026",
    organisation: "Anthropic & Google Cloud",
    category: "hackathon",
    description: "Build autonomous multi-agent systems and real-world AI assistants. Top teams receive cash grants, cloud credits, and direct interview fast-tracks.",
    requirements: [
      "Open to university and college students worldwide",
      "Teams of 1 to 4 members",
      "Working prototype with open-source repository"
    ],
    required_skills: ["Python", "TypeScript", "REST APIs"],
    location: "Online / Global",
    work_mode: "remote",
    stipend_min: 500000,
    stipend_max: 1000000,
    currency: "INR Prize pool",
    application_url: "https://hackathon.devpost.com",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-28T00:00:00Z",
    deadline: "2026-11-10T18:00:00Z",
    is_active: true,
    eligibility_rules: [
      { field: "current_year", operator: "gte", value: 1, label: "Open to all enrolled undergraduate & graduate students", mandatory: true }
    ]
  },
  {
    id: "opp-3",
    title: "Google Generation Scholarship (Asia Pacific)",
    slug: "google-generation-scholarship-apac",
    organisation: "Google",
    category: "scholarship",
    description: "Established to help aspiring computer scientists excel in technology and become leaders in the field. Awardees receive financial support and networking opportunities.",
    requirements: [
      "Currently enrolled as a full-time student in a Bachelor's program",
      "Major in Computer Science, Computer Engineering or related technical field",
      "Exemplify leadership and demonstrate passion for improving diversity in tech"
    ],
    required_skills: ["Leadership", "Community Engagement"],
    location: "India / APAC",
    work_mode: "remote",
    stipend_min: 250000,
    stipend_max: 250000,
    currency: "INR one-time award",
    application_url: "https://buildyourfuture.withgoogle.com",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-15T00:00:00Z",
    deadline: "2026-11-08T23:59:59Z",
    is_active: true,
    eligibility_rules: [
      { field: "current_year", operator: "in", value: [2, 3], label: "2nd or 3rd year undergraduate", mandatory: true },
      { field: "degree", operator: "in", value: ["Computer Science", "Engineering"], label: "Technical degree required", mandatory: true },
      { field: "cgpa", operator: "gte", value: 8.0, label: "Minimum CGPA 8.0 recommended", mandatory: false }
    ]
  },
  {
    id: "opp-4",
    title: "Research Fellowship in Machine Learning & Systems",
    slug: "microsoft-research-fellow-2026",
    organisation: "Microsoft Research India",
    category: "fellowship",
    description: "Spend 1 to 2 years collaborating with world-class researchers on frontier problems in systems, machine learning, and human-computer interaction.",
    requirements: [
      "Completing Bachelor's or Master's degree in 2026 or 2027",
      "Demonstrated interest in research via publications, strong coursework or projects"
    ],
    required_skills: ["Python", "PyTorch", "Algorithms", "Research"],
    location: "Bangalore, India",
    work_mode: "onsite",
    stipend_min: 95000,
    stipend_max: 110000,
    currency: "INR/mo",
    application_url: "https://www.microsoft.com/en-us/research/careers",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-20T00:00:00Z",
    deadline: "2026-11-20T23:59:59Z",
    is_active: true,
    eligibility_rules: [
      { field: "cgpa", operator: "gte", value: 8.5, label: "Minimum CGPA 8.5 required", mandatory: true },
      { field: "graduation_year", operator: "in", value: [2026, 2027], label: "Graduating class of 2026 or 2027", mandatory: true }
    ]
  },
  {
    id: "opp-5",
    title: "Senior Graduate Quantitative Trading Researcher",
    slug: "tower-research-quant-2026",
    organisation: "Tower Research Capital",
    category: "job",
    description: "Develop algorithmic trading models using advanced statistical techniques and high-frequency market data.",
    requirements: [
      "Master's or Ph.D. degree in Mathematics, Physics, Statistics, or CS",
      "Exceptional competitive programming or math olympiad accolades"
    ],
    required_skills: ["C++", "Python", "Probability", "Algorithms"],
    location: "Gurgaon, India",
    work_mode: "onsite",
    stipend_min: 4500000,
    stipend_max: 6000000,
    currency: "INR/yr CTC",
    application_url: "https://tower-research.com",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-18T00:00:00Z",
    deadline: "2026-11-12T23:59:59Z",
    is_active: true,
    eligibility_rules: [
      { field: "degree", operator: "in", value: ["Master", "Ph.D.", "M.Tech"], label: "Requires Postgraduate degree (M.Tech / Ph.D.)", mandatory: true }
    ]
  },
  {
    id: "opp-6",
    title: "Undergraduate Frontend Engineering Intern",
    slug: "linear-frontend-intern",
    organisation: "Linear",
    category: "internship",
    description: "Work on crafting ultra-fast, keyboard-driven UI workflows with React, WebGL, and modern state architectures.",
    requirements: [
      "Deep passion for interface design, accessibility, and pixel precision",
      "Experience with React, TypeScript, and modern CSS"
    ],
    required_skills: ["React", "TypeScript", "Tailwind CSS"],
    location: "Remote",
    work_mode: "remote",
    stipend_min: 100000,
    stipend_max: 130000,
    currency: "INR/mo equivalent",
    application_url: "https://linear.app/careers",
    source_type: "curated",
    verification_status: "verified",
    published_at: "2026-10-29T00:00:00Z",
    deadline: "2026-11-18T23:59:59Z",
    is_active: true,
    eligibility_rules: [
      { field: "current_year", operator: "gte", value: 2, label: "Undergraduate 2nd year and above", mandatory: true },
      { field: "work_mode", operator: "eq", value: "remote", label: "100% Remote position", mandatory: false }
    ]
  }
];

export const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    user_id: "student-1",
    title: "Draft SOP and essay answers for Google Generation Scholarship",
    description: "Write 400-word response focusing on leadership in campus coding club and open-source mentoring.",
    category: "submission",
    status: "in_progress",
    priority: "critical",
    due_at: "2026-11-07T18:00:00Z",
    opportunity_id: "opp-3",
    source_type: "opportunity",
    created_at: "2026-11-01T10:00:00Z",
    updated_at: "2026-11-04T12:00:00Z",
  },
  {
    id: "task-2",
    user_id: "student-1",
    title: "Update resume with latest Next.js and Supabase project deliverables",
    description: "Ensure GitHub links, metrics, and deployed URLs are active and clean.",
    category: "documentation",
    status: "todo",
    priority: "high",
    due_at: "2026-11-08T20:00:00Z",
    opportunity_id: "opp-1",
    source_type: "opportunity",
    created_at: "2026-11-02T14:30:00Z",
    updated_at: "2026-11-02T14:30:00Z",
  },
  {
    id: "task-3",
    user_id: "student-1",
    title: "Confirm Hackathon teammate registrations & sign NDA",
    description: "Follow up with Priya and Aryan to accept devpost team invite before deadline.",
    category: "email_followup",
    status: "todo",
    priority: "high",
    due_at: "2026-11-09T12:00:00Z",
    opportunity_id: "opp-2",
    source_type: "email",
    email_evidence_id: "email-1",
    created_at: "2026-11-03T09:15:00Z",
    updated_at: "2026-11-03T09:15:00Z",
  },
  {
    id: "task-4",
    user_id: "student-1",
    title: "Submit official transcript from student portal to Stripe portal",
    description: "Export verified 5th semester grade sheet PDF.",
    category: "documentation",
    status: "todo",
    priority: "medium",
    due_at: "2026-11-14T23:59:59Z",
    opportunity_id: "opp-1",
    source_type: "manual",
    created_at: "2026-11-03T11:00:00Z",
    updated_at: "2026-11-03T11:00:00Z",
  }
];

export const SEED_USER_OPPORTUNITIES: UserOpportunity[] = [
  {
    id: "uo-1",
    user_id: "student-1",
    opportunity_id: "opp-3",
    opportunity: SEED_OPPORTUNITIES[2],
    status: "applying",
    saved_at: "2026-10-26T12:00:00Z",
    next_action: "Complete recommendation letter request and submit essay",
    timeline: [
      { stage: "saved", updated_at: "2026-10-26T12:00:00Z", note: "Saved from curated listings" },
      { stage: "applying", updated_at: "2026-11-01T08:00:00Z", note: "Started drafting application" }
    ]
  },
  {
    id: "uo-2",
    user_id: "student-1",
    opportunity_id: "opp-1",
    opportunity: SEED_OPPORTUNITIES[0],
    status: "interested",
    saved_at: "2026-10-27T15:20:00Z",
    next_action: "Refine resume with relevant project keywords",
    timeline: [
      { stage: "saved", updated_at: "2026-10-27T15:20:00Z" },
      { stage: "interested", updated_at: "2026-10-29T10:00:00Z" }
    ]
  },
  {
    id: "uo-3",
    user_id: "student-1",
    opportunity_id: "opp-2",
    opportunity: SEED_OPPORTUNITIES[1],
    status: "applied",
    saved_at: "2026-10-30T09:00:00Z",
    applied_at: "2026-11-02T18:00:00Z",
    next_action: "Team project submission pending",
    timeline: [
      { stage: "saved", updated_at: "2026-10-30T09:00:00Z" },
      { stage: "applied", updated_at: "2026-11-02T18:00:00Z", note: "Initial track registration submitted" }
    ]
  }
];

export const SEED_EMAIL_EVIDENCE: EmailEvidence[] = [
  {
    id: "email-1",
    user_id: "student-1",
    provider_message_id: "msg_98234723984",
    subject: "Action Required: Complete your team registration for Global AI Hackathon",
    sender: "no-reply@devpost.com",
    received_at: "2026-11-03T08:30:00Z",
    gmail_message_url: "https://mail.google.com/mail/u/0/#inbox/msg_98234723984",
    snippet: "Hello Shivraj, your team 'Nudge Builders' has 2 unconfirmed members. All members must confirm their GitHub handles and accept terms by Nov 10, 2026.",
    extracted_data: {
      opportunity_title: "Global AI Agents Hackathon 2026",
      organisation: "Devpost / Anthropic",
      opportunity_category: "hackathon",
      summary: "Teammates must verify GitHub handles and sign participant agreement prior to project submission.",
      deadline: "2026-11-10T18:00:00Z",
      required_action: "Follow up with teammates to confirm registration",
      required_documents: ["GitHub Handle Verification", "Team NDA"],
      application_url: "https://devpost.com/teams/nudge-builders"
    },
    extraction_confidence: 96,
    processing_status: "confirmed",
    related_opportunity_id: "opp-2"
  },
  {
    id: "email-2",
    user_id: "student-1",
    provider_message_id: "msg_12893712893",
    subject: "Invitation to apply: Microsoft Research Undergraduate Summer School 2026",
    sender: "admissions@microsoft-research.in",
    received_at: "2026-11-04T16:45:00Z",
    gmail_message_url: "https://mail.google.com/mail/u/0/#inbox/msg_12893712893",
    snippet: "Dear CS Department Students, MSR India invites applications for its 2-week intensive summer fellowship. Stipend and travel covered. Application closes Nov 25.",
    extracted_data: {
      opportunity_title: "MSR India Undergraduate Summer Research Fellowship",
      organisation: "Microsoft Research India",
      opportunity_category: "research",
      summary: "Two-week funded intensive summer research school in Bangalore for pre-final year students with high CGPA.",
      deadline: "2026-11-25T23:59:59Z",
      required_action: "Submit statement of purpose and university marks card",
      application_url: "https://www.microsoft.com/en-us/research/academic-programs/"
    },
    extraction_confidence: 92,
    processing_status: "pending_review"
  }
];

export const SEED_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: "cal-1",
    title: "Google Generation Scholarship Deadline",
    starts_at: "2026-11-08T23:59:59Z",
    ends_at: "2026-11-09T00:30:00Z",
    event_type: "deadline",
    opportunity_id: "opp-3",
    status: "confirmed"
  },
  {
    id: "cal-2",
    title: "Hackathon Teammate Confirmation Cutoff",
    starts_at: "2026-11-10T18:00:00Z",
    ends_at: "2026-11-10T19:00:00Z",
    event_type: "task",
    opportunity_id: "opp-2",
    status: "confirmed"
  },
  {
    id: "cal-3",
    title: "Stripe Software Engineering Intern Deadline",
    starts_at: "2026-11-15T23:59:59Z",
    ends_at: "2026-11-16T00:00:00Z",
    event_type: "deadline",
    opportunity_id: "opp-1",
    status: "confirmed"
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "High Urgency: Scholarship deadline in 3 days",
    message: "Google Generation Scholarship application closes on Nov 8. Your draft SOP is in progress.",
    notification_type: "deadline",
    related_entity_type: "opportunity",
    related_entity_id: "opp-3",
    created_at: "2026-11-05T01:00:00Z"
  },
  {
    id: "notif-2",
    title: "New Opportunity Discovered in Inbox",
    message: "AI detected 'MSR India Undergraduate Summer Research Fellowship' from Microsoft Research India email.",
    notification_type: "email",
    related_entity_type: "email",
    related_entity_id: "email-2",
    created_at: "2026-11-04T17:00:00Z"
  }
];
