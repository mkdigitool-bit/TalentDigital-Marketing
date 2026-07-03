# Contact Page (Supabase + Resend) — Design

**Status:** Approved
**Date:** 2026-07-03

## Goal

Build the `/contact` page for the TalentDigital Astro site, replacing the legacy Systeme.io-derived `contact-sio.html`. The form must work without any dependency on Systeme.io — submissions are stored in Supabase and trigger a notification email via Resend.

## Context

The site previously ran on Systeme.io, whose form/automation widget was unreliable — this was the original motivation for the whole Astro migration. `contact-sio.html` (root-level legacy file) still contains a mock form: on submit, it fakes success with a `setTimeout` and never actually sends data anywhere. There is no live Astro `/contact` page yet. The user explicitly ruled out any Systeme.io involvement ("SANS SYSTEME IO") and chose Supabase (storage) + Resend (email) as the replacement stack.

## Architecture

**Backend: a standalone Vercel serverless function, not an Astro server route.**

The Astro site is currently fully static (`astro.config.mjs` has no adapter, default `output: 'static'`). Switching the whole site to server output (or adding the Vercel adapter in hybrid mode) would change how every existing page is built and deployed — unnecessary risk for one dynamic endpoint. Instead, `api/contact.js` lives at the project root. Vercel's zero-config convention automatically deploys any file under `/api` as an independent Node.js serverless function, regardless of the frontend framework or its build output. The static Astro site and the one dynamic endpoint ship side by side with no coupling.

The `/contact` page (client-side JS, no framework hydration needed) calls `POST /api/contact` with `fetch` and a JSON body, matching the shape of the existing mock handler's field set.

### Data flow

1. User submits the form on `/contact`.
2. Client-side JS validates required fields (existing behavior, kept), plus a hidden honeypot field.
3. `fetch('/api/contact', { method: 'POST', body: JSON.stringify(fields) })`.
4. `api/contact.js`:
   - Rejects if the honeypot field is non-empty — responds `200 { ok: true }` without inserting or emailing (bots get a fake success, no error to learn from).
   - Validates required fields server-side (prenom, nom, email, service, message) — `400` with an error message if missing/malformed.
   - Inserts a row into Supabase table `contact_submissions` using the `service_role` key (server-only secret, never sent to the browser).
   - Sends a notification email via Resend to `info@talentdigital.net`, `reply-to` set to the submitter's email, subject includes the submitter's name and chosen service.
   - Returns `200 { ok: true }` on success, `500 { ok: false, error }` if Supabase or Resend fails.
5. Client shows the existing success state on `200`, or a new inline error message on failure (currently absent — the mock never fails).

## Supabase Schema

Table `contact_submissions`:

```sql
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  service text not null,
  budget text,
  message text not null
);
```

No RLS policies needed for reads/writes from the client — all access goes through the serverless function using the `service_role` key, which bypasses RLS. (If the user later wants a dashboard UI reading this table from the browser, RLS policies would need to be added then — out of scope here.)

## Email via Resend

- `RESEND_API_KEY` — server-only env var.
- From address: `RESEND_FROM_EMAIL` env var, defaulting to `onboarding@resend.dev` (Resend's sandbox sender, works immediately without domain verification) until the user verifies `talentdigital.net` in Resend and switches it to `contact@talentdigital.net`.
- To address: `info@talentdigital.net`, via `CONTACT_TO_EMAIL` env var (not hardcoded, so it can be changed without a redeploy-requiring code change).
- `reply-to`: the submitter's email — replying to the notification goes straight to the prospect.
- Body: plain text/simple HTML listing all submitted fields.

## Anti-spam

A hidden honeypot input (e.g. `name="website"`, visually hidden via CSS, `tabindex="-1"`, `autocomplete="off"`) — real users never fill it, bots that auto-fill every field do. No reCAPTCHA or other third-party dependency.

## Frontend (`src/pages/contact.astro`)

- Uses the site's existing `BaseLayout`, `Header`, `Footer` components (already have the correct "Créations" nav and optimized logo) instead of `contact-sio.html`'s self-contained nav/footer markup.
- Content ported from `contact-sio.html`: hero (headline + 3 meta badges), form (prénom/nom/email/tel/service/budget/message + consent checkbox), sidebar ("ce qui se passe ensuite" steps, trust stats, direct contact links), FAQ accordion (6 questions), final CTA strip.
- WhatsApp number updated to `+212663206266` (from the `0663206266` the user provided, converted to international format) in the sidebar direct-link and the final strip.
- Submit handler replaced: real `fetch('/api/contact')` call instead of `setTimeout`; on failure, show an inline error message near the submit button (new — the mock had no failure path) and re-enable the submit button so the user can retry.
- Same visual design/CSS as `contact-sio.html` (dark theme, existing token set) — no redesign, just componentization and wiring the real submit.

## Root reference file

- Delete `contact-sio.html`.
- Create `contact.html` at the project root, following the same pattern already established for `home-page.html`, `services.html`, `service-saas.html`: a standalone reference HTML document with the current page's visual content and the `<title>Contact — TalentDigital.net</title>` convention, but **no working backend** — the form is visual only, matching the other root reference files (none of them wire up real submission logic).

## Testing / Verification

- Build (`npm run build`) and static UI/validation behavior (client-side required-field checks, honeypot present but invisible, layout/responsive) can be verified immediately via the browser preview tools.
- The actual Supabase insert and Resend email send can only be exercised once the user supplies real credentials (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`). These go into a local `.env` file (already covered by `.gitignore` — to be confirmed/added) for local testing; the same values get added as Vercel environment variables before production deploy.
- No automated test framework exists in this project (static marketing site) — consistent with prior work, verification is manual build + browser checks.

## Out of Scope

- Any Systeme.io integration, migration, or reference — explicitly excluded per user instruction.
- RLS policies / admin dashboard for viewing submissions in Supabase (future work if requested).
- Actually creating the Resend/Supabase accounts — the user is setting these up separately; this spec only covers the code that consumes them via env vars.
