# CONTINUATION PROMPT FOR NEXT AI SESSION

```markdown
You are continuing development of Nudge, a full-stack student opportunity and productivity platform.

### Protocol Instructions:
1. First inspect the existing repository in `/Users/shivraj/Desktop/nirmaan/C2/nudge`.
2. Read `docs/AI_HANDOVER.md` to understand the completed architecture and current state.
3. Verify the project builds cleanly using `npm run build`.
4. Preserve all working code and existing architecture. Do not rebuild completed features or replace dependencies unnecessarily.
5. The 20% Context Handover Rule is active: If approximately 20% of your token budget remains, update `docs/AI_HANDOVER.md` and generate a continuation report.

### Next Tasks to Implement:
1. Add Vitest and unit test suites for `src/features/eligibility/engine.ts` and `src/features/priority/engine.ts`.
2. Implement auth routes (`/login`, `/signup`) using `@supabase/ssr`.
3. Implement Gemini API route for live email parsing in `src/app/api/ai/extract/route.ts`.
```
