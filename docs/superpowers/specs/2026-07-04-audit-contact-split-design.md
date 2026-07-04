# Audit / Contact Split — Design

## Problem

`src/pages/contact.astro` is currently the audit-request page: hero ("Audit gratuit
de 30 min"), form titled "Demande d'audit gratuit" with Service + Budget fields, a
"Ce qui se passe ensuite" funnel sidebar, an audit-focused FAQ, and JSON-LD naming
the page "Audit gratuit". There is no page for someone who just wants to send a
general message without requesting the free audit. The site needs two distinct
pages: a dedicated `/audit` landing page (today's content, moved as-is) and a new,
minimal `/contact` page for general inquiries.

## Routing & Backend

- **`src/pages/audit.astro`** (new) — route `/audit`. Contains the entirety of the
  current `contact.astro` content unchanged (hero, full form with Service/Budget,
  "Ce qui se passe ensuite" + "Contact direct" sidebar, full FAQ, closing strip,
  JSON-LD), except the JSON-LD `url` field updates to
  `https://www.talentdigital.net/audit`. Submits to the existing
  `api/contact.js` endpoint, which keeps writing to the existing
  `contact_submissions` Supabase table unchanged.
- **`src/pages/contact.astro`** (rewritten) — minimal general contact page (see
  Content below). Submits to a new endpoint.
- **`api/contact-general.js`** (new) — Vercel serverless function, same
  method-guard / honeypot-short-circuit / try-catch structure as `api/contact.js`.
  Inserts into a new Supabase table `general_inquiries` and sends a Resend
  notification to `info@talentdigital.net` with subject
  `Nouveau message de contact — {prenom}`.
- **`general_inquiries` table** (new): `id`, `created_at`, `prenom`, `email`,
  `telephone` (nullable), `message`. RLS enabled, no policies (service-role key
  bypasses RLS), matching the existing `contact_submissions` table's setup.
- **Validator**: a new exported function (e.g. `validateGeneralContactPayload` in
  `api/_validate.js`, alongside the existing `validateContactPayload`) requiring
  `prenom`, `email`, `message` (all non-empty strings), with `telephone` optional,
  the same honeypot check (`website` field), and the same email regex.

## Content: `/contact` (new, minimal)

- Hero: "Contactez-nous." with lede: "Une question, un projet, une simple prise de
  contact ? Écrivez-nous, on répond sous 24 h." (keeps the real 24h commitment,
  drops all audit/funnel framing).
- Form fields: Prénom, Email, Téléphone (optional), Message. No Nom field, no
  Service dropdown, no Budget radio group.
- Form title: "Envoyer un message". Submit button: "Envoyer le message".
- Generic success message (no "plan d'action" mention).
- One sidebar card only: "Contact direct" (email + WhatsApp links, reused from the
  current page). No "Ce qui se passe ensuite" block, no FAQ section, no closing
  strip (the contact-direct card already covers that need).
- JSON-LD `ContactPage` schema updated to remove "audit" wording, pointing to
  `https://www.talentdigital.net/contact`.

## Content: `/audit`

Verbatim copy of today's `contact.astro` (hero, full audit form, sidebar, FAQ,
closing strip, JSON-LD with `url` updated to `/audit`). No copy changes.

## Site-wide link updates

Rule: any CTA whose label mentions the audit or "démarrer un projet" points to
`/audit` (the funnel's entry point per the existing FAQ copy); plain "Contact"
labeled links stay on `/contact`.

| File | Link label | New target |
|---|---|---|
| `Header.astro` | Nav "Contact" | `/contact` (unchanged) |
| `Header.astro` | CTA "Audit gratuit" (×2: desktop + mobile) | `/audit` |
| `Footer.astro` | "Contact" | `/contact` (unchanged) |
| `Footer.astro` | "Formulaire de contact" | `/contact` (unchanged) |
| `Footer.astro` | "Audit gratuit" | `/audit` |
| `index.astro` | "Réserver mon audit gratuit" | `/audit` |
| `a-propos.astro` | "Démarrer un projet" | `/audit` |
| `a-propos.astro` | "Demander mon audit gratuit" | `/audit` |
| `landing-page.astro`, `tunnel.astro`, `site-web.astro`, `saas.astro` | "Démarrer ce projet" (×2 each) | `/audit` |

`Header.astro`'s `isContact`/`isAudit` active-state logic: `isContact` stays keyed
to `/contact`; a new `isAudit` boolean (`pathname.startsWith('/audit')`) is added
for the nav's own correctness even though the CTA buttons aren't styled with the
active-underline treatment (they're `.btn`, not plain nav links).

## Testing

- `tests/contact.test.js` (existing) stays unchanged — it covers `api/contact.js`
  / `contact_submissions`, now used exclusively by `/audit`.
- New `tests/contact-general.test.js` — mirrors `contact.test.js`'s structure
  (405 non-POST, honeypot short-circuit, missing-required-field 400) against
  `api/contact-general.js`.
- New tests in `tests/validate.test.js` (or a new `validate-general.test.js`) for
  `validateGeneralContactPayload`: honeypot, missing prenom/email/message,
  invalid email, valid payload accepted.

## Root reference `.html` files

Following this project's established convention, the root reference files must
mirror the live site:
- New `audit.html` (copy of current `contact.html`'s content/structure).
- `contact.html` rewritten to mirror the new minimal `/contact` page.
- Nav blocks and CTA links across all 8 reference `.html` files updated to match
  the link-repointing table above.

## Out of scope

- No changes to the existing `contact_submissions` table or `api/contact.js`
  logic beyond what's needed to keep `/audit` working.
- No redirect needed for `/contact` — the URL keeps resolving, just with new
  content, so no `vercel.json` change is required for this page.
