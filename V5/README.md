# Nirmaan — Hackathon Prototype

Nirmaan is a premium labor-finding and trained-pro construction experience. It is designed around a simple promise: **better work should lead to better homes and better livelihoods.**

## Run it

This is a self-contained front-end prototype — no build process or backend is required.

1. Open `index.html` in a browser, or serve this folder with any static-file server.
2. For the best presentation, start at desktop width and resize to show the responsive experience.
3. Choose **English** or **हिन्दी** in the language welcome screen. The language can be changed again from the top navigation.

## Hackathon demo flow (2–3 minutes)

1. Start at the hero: point out the live availability map and the quality-first positioning.
2. Select a profession under **Find your crew**, then open a professional profile to show transparent credentials and rank.
3. Click **Create my crew** to show one-tap group matching.
4. Visit the design showcase to connect architecture with execution quality.
5. Click **Try the site guide** and show the AI construction instruction demo.
6. End with **Post your requirement** and submit the short form to trigger the matching confirmation.
7. Repeat the worker journey in Hindi to demonstrate inclusive onboarding.

## Product architecture

The current prototype has a deliberately modular product shape:

- `index.html`: semantic page structure, accessible dialogs and content.
- `styles.css`: responsive design system and component styling.
- `app.js`: seeded worker data, filtering, profiles, crew matching, demo dialogs and stateful feedback.

For production, the client would be a Next.js/TypeScript app with these services:

- **Identity & trust:** KYC, credential verification, background checks and dispute workflows.
- **Matching:** geospatial availability, skill taxonomy, rates, job fit, reliability and group optimization.
- **Job & payment:** scoped job records, milestone approval, escrow/payouts and invoices.
- **Pro Progress:** assessments, training completion, inspector scoring, rank rules and rewards.
- **Guide platform:** architect-authored task templates, localized media, site photos and human escalation.
- **Realtime:** WebSockets for presence, job status, chat and location with explicit consent.

## Key product principles

- Rankings are evidence-based (skills, quality inspections and reliability), not just star ratings.
- Real-time location is only a matching aid and should be consented, purpose-limited and never exposed more precisely than necessary.
- Architecture is made executable through visual, multilingual job guides — trained professionals remain accountable for their craft.
- Rates and scope are visible before confirmation to protect both customers and pros.

## Future roadmap

1. Add authentication, customer/pro role flows and a real backend.
2. Integrate Maps, availability scheduling and consent-based live tracking.
3. Launch the rank engine with verifiable assessment and quality data.
4. Add job milestones, photo evidence, payouts and support/disputes.
5. Pilot architecture-guided crews in one neighborhood before expanding categories and cities.

## Visual note

The site uses an original visual system. Images are illustrative Unsplash remote imagery; replace them with licensed production assets and get consent for any real professional profile photos.
