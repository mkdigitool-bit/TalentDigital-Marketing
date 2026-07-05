# Mentions légales / Politique de confidentialité — Design

## Problem

The contact and audit forms both contain a dead link
(`<a href="#">Politique de confidentialité</a>`) and the site has no legal
page at all. TalentDigital has no registered legal entity yet, so any legal
page must state real facts only — no fabricated SIRET/RC/ICE numbers, no
invented registered address, no overstated compliance claims.

## Page & Route

A single combined page: `src/pages/mentions-legales.astro`, route
`/mentions-legales`, styled consistently with the existing `a-propos.astro`
page (hero + prose sections, same design tokens). Two anchored sections:

- `#mentions` — Mentions légales
- `#confidentialite` — Politique de confidentialité

## Content: Mentions légales (`#mentions`)

States only verifiable facts:
- Commercial name: "TalentDigital"
- No registered legal entity exists yet — the site states the activity is
  run independently, without naming a legal form (SARL, auto-entrepreneur,
  etc.) or a registration number, since none exists. No invented registered
  address.
- Contact: `info@talentdigital.net`, WhatsApp `+212663206266`
- Site: `talentdigital.net`
- Hosting: Vercel Inc. (real, verifiable — the site's actual host)

## Content: Politique de confidentialité (`#confidentialite`)

Describes only what the codebase actually does today:
- **Responsable du traitement:** TalentDigital, contactable at
  `info@talentdigital.net`.
- **Données collectées:** via the two site forms —
  - Audit form (`/audit`): prénom, nom, email, téléphone (optionnel),
    service, budget, message — stored in the Supabase table
    `contact_submissions`.
  - Contact form (`/contact`): prénom, email, téléphone (optionnel),
    message — stored in the Supabase table `general_inquiries`.
- **Finalité:** répondre à la demande de l'utilisateur; chaque soumission
  déclenche aussi un email de notification interne via Resend.
- **Destinataires:** TalentDigital uniquement — aucune donnée n'est vendue
  ou partagée à des tiers.
- **Droits:** accès, rectification, suppression — sur simple demande par
  email à `info@talentdigital.net`.
- **Mesure d'audience:** mentions that Google Analytics (`gtag.js`) is used
  to measure traffic, honestly, without claiming a cookie-consent mechanism
  that doesn't exist. No overstated GDPR-compliance claim.

**Known gap (not in scope for this page):** the site has no cookie-consent
banner, so EU visitors are not currently offered a choice before Google
Analytics loads. Per explicit user decision, this is deferred to a future
task and is NOT addressed by this page. The privacy policy text must not
claim a consent mechanism exists.

## Link updates

| File | Change |
|---|---|
| `src/components/Footer.astro` | Add a "Mentions légales" link → `/mentions-legales` in the existing "Contact" column |
| `src/pages/contact.astro` | `<a href="#">Politique de confidentialité</a>` → `<a href="/mentions-legales#confidentialite">Politique de confidentialité</a>` |
| `src/pages/audit.astro` | Same dead-link fix as `contact.astro` |
| 8 root reference `.html` files | New `mentions-legales.html` mirroring the live page; Footer/form link updates mirrored across all 8, per this project's established reference-file convention |

## Out of scope

- No CGV/CGU (terms of sale/use) — not requested.
- No cookie-consent banner — explicitly deferred by the user.
- No fabricated business registration details of any kind.
