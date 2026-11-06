# NUDGE — AI HANDOVER DOCUMENT (SESSION 1)

## A. Project Overview
- **Project Name:** Nudge
- **Product Purpose:** Student opportunity discovery and productivity platform that answers: *"What needs my attention today?"*
- **Core Differentiators:**
  1. **Unified Priority Queue:** Blends deadlines, inbox tasks, applications, and reminders into a single explainable action queue.
  2. **Explainable Deterministic Eligibility Engine:** Transparently validates student criteria (degree, year, CGPA, skills, mode) with clear reasoning and missing criteria warnings.
  3. **Inbox Intelligence:** Scans emails, extracts structured tasks with zero hallucinations, and links tasks back to source emails.
- **Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Next-Themes, Supabase PostgreSQL with RLS.

---

## B. Completed Work (Session 1)
- **Scaffolding & Layout:** Next.js App Router project initialized with full dark/light theme support (`next-themes`).
- **Data Models & Types:** `src/types/index.ts` with comprehensive typing for StudentProfile, Opportunity, EligibilityRules, PriorityItem, EmailEvidence, Task, and UserOpportunity.
- **Explainable Eligibility Engine:** `src/features/eligibility/engine.ts` supporting rule evaluations (`in`, `gte`, `lte`, `eq`), skill overlap percentage, and missing requirement alerts.
- **Unified Priority Engine:** `src/features/priority/engine.ts` with deterministic scoring based on hours to deadline, priority level, and application state.
- **Database Schema & Migrations:** `supabase/migrations/01_initial_schema.sql` defining 11 tables with full PostgreSQL Row Level Security (RLS) policies.
- **Supabase Clients:** `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.
- **Pages Implemented:**
  1. `/dashboard` - Personalized header, 4 summary metrics, top priority actions, and recommended opportunities with match scores.
  2. `/opportunities` - Full opportunity catalog with search, category filters, and eligibility breakdown cards.
  3. `/priority` - The signature Unified Priority Queue with quick-complete actions and deterministic scoring.
  4. `/tasks` - Task management with category badges, status toggles, and relative deadline flags.
  5. `/tracker` - Kanban application pipeline (Saved -> Interested -> Applying -> Applied -> Assessment -> Interview).
  6. `/inbox` - Gmail intelligence interface showing extracted tasks, email evidence snippets, and confidence scores.
  7. `/calendar` - Integrated timeline of closing dates and task milestones.
  8. `/profile` - Student credentials, academic details, and verified skills.
  9. `/settings` - Theme preferences, integration statuses, and backend setup.
- **API Endpoints:**
  - `GET /api/opportunities`
  - `GET /api/priority`

---

## C. Current Progress & Health
- **Build Status:** ✅ Production build passes cleanly with Next.js Turbopack (`npm run build`).
- **TypeScript:** ✅ 0 TypeScript or typecheck errors.
- **Current Development Phase:** Phase 3/4 Complete (Frontend shell, deterministic core engines, seed data, and API routes working).
- **Next Phase:** Phase 5/6 (Real Supabase Auth hookup, AI service adapter for Gemini/OpenAI, and Gmail OAuth sync).

---

## D. Remaining Work Checklist
- [x] Phase 1: Next.js + Tailwind + Theme Setup (COMPLETE)
- [x] Phase 2: Supabase Schema & RLS Migrations (COMPLETE)
- [x] Phase 3: Dashboard, Navigation, and Student Profile (COMPLETE)
- [x] Phase 4: Opportunity Discovery & Eligibility Engine (COMPLETE)
- [x] Phase 5: Unified Priority Queue & Kanban Tracker (COMPLETE)
- [x] Phase 6: Inbox Intelligence & Email Evidence UI (COMPLETE)
- [ ] Phase 7: Connect live Supabase Auth & DB (Ready for user `.env.local` credentials)
- [ ] Phase 8: Unit test suite with Vitest for eligibility & priority scoring

---

## E. Architecture & Key Decisions
- **Deterministic vs AI:** LLMs are reserved for unstructured email parsing and summarization. Eligibility verdicts and Priority Queue ranking are **100% deterministic** to prevent hallucinations.
- **Demo Mode Default:** The app runs out-of-the-box with rich realistic seed data (`src/constants/seedData.ts`) so it can be demonstrated without needing live Google/Supabase credentials immediately.

---

## F. Next Actions for Continuing AI
1. Run `npm test` or install Vitest to add unit test coverage for `src/features/eligibility/engine.ts` and `src/features/priority/engine.ts`.
2. Connect live Supabase authentication forms (`/login`, `/signup`).
3. Add Gemini API Route adapter in `src/lib/ai/` for live email extraction.
