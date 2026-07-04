# Honest Content Cleanup + À Propos Page — Design

**Status:** Approved
**Date:** 2026-07-04

## Goal

Remove all fabricated statistics, fake client testimonials, and fake team members across the live site, and build the new `/a-propos` page from scratch following the same honesty rule. Nav already links to `/a-propos`, which currently 404s.

## Context

During the Contact-page work, the user confirmed the business has no real, provable project counts, ratings, or country-reach numbers to publish yet, and that the "team" and "client testimonials" content scattered across the site is fictional marketing copy, not real people or real clients. This mirrors a rule already applied earlier in the project to `src/pages/creations/saas.astro` (no fabricated named-client testimonials there). This spec extends that rule to the rest of the site and to the new About page.

## Governing principle

Two categories of claims appear throughout the site, and they get different treatment:

- **Forward commitments (keep):** things the business controls and can promise regardless of track record — delivery timelines (7 jours, 3-5 jours, 10-14 jours), quote turnaround (devis sous 48h), guarantees (garantie post-livraison 30j, PageSpeed 90+ garanti à la livraison), free-audit terms, "100% du code source livré." These are policies, not claimed historical results.
- **Claimed track record (remove):** anything asserting a specific past outcome, average result, rating, or count that implies an established client history — project/tunnel/page/site counts ("120+", "98+", "75+"), average conversion/revenue lifts ("×3", "+180%", "42%", "+28%"), star ratings ("4.8★"), country-reach counts ("12+ pays"), and named-client testimonials with fabricated quotes and results.

## Per-file changes

**`src/pages/index.astro`**
- Hero "résultats.live" console panel: remove the `taux_ouverture_email 42%` and `projets_livrés 120+` rows (fabricated), and the panel's "résultats.live" framing (implies live analytics data, which would now be misleading with only commitments left). Rename the panel label to "engagements" and replace the two removed rows so it still shows 3 rows: `audit_gratuit` / `oui`, `réponse_sous` / `24h`, `délai_livraison` / `7j` (this last one is the sole row kept from the original panel).
- Section "04 — résultats clients" (three fabricated named testimonials: Sofia M., Karim B., Émilie D., plus the false claim "chaque témoignage correspond à un projet réel, des chiffres vérifiés, un client joignable"): remove the entire section. Renumber the following sections (05 → 04 processus, 06 → 05 faq) so the visible step numbers stay sequential.
- Final CTA proof line "120+ entrepreneurs accompagnés dans le monde": replace with a non-numeric statement (e.g. focus on the audit/delivery commitments already listed alongside it).

**`src/pages/contact.astro`**
- Sidebar "Résultats clients" trust-stats grid (`120+ Projets livrés`, `4.8★ Note clients`, `12+ Pays`, plus `7j Délai moyen`): remove the whole card (heading + grid), since three of its four cells are fabricated and the remaining real commitment (7j délai moyen) is already stated in the hero's meta-badges above, making the card redundant once emptied. The sidebar keeps its other two cards ("Ce qui se passe ensuite" and "Contact direct") unchanged.

**`src/pages/creations/index.astro`**
- Hero stats (`120+ Projets livrés`, `×3 Panier moyen`): remove `120+` and `×3`; the third stat (`7j Délai moyen`) is a real commitment. Keep the 3-column grid by replacing the two removed slots with two other real commitments: `Audit gratuit` and `Sans engagement`.
- Per-card `svc-card__result` lines: remove `Résultat moyen : ×3 sur le panier` and `Résultat moyen : +180% de conversion` (fabricated averages). Keep `Score PageSpeed 90+ garanti` and `Code source livré à 100%` (real, controllable guarantees).
- Final CTA proof line `120+ projets livrés dans 12+ pays`: remove/replace, same as homepage.

**`src/pages/creations/tunnel.astro`**
- `stat-row` panel: remove `résultat_panier_moyen ×3 moy` and `tunnels_livrés 120+`; keep `délai_livraison 7j`.
- `result-box` (fabricated testimonial "Karim B." with invented ×4/28% figures, plus the `×3` delta): remove the fake name and quote entirely; replace with an honest description of the order-bump/upsell mechanism (no invented multiplier), following the same pattern already used on `saas.astro`'s "notre engagement" box (company-voice statement, not a fake client).
- Final CTA `120+ tunnels livrés dans 12+ pays`: remove/replace.

**`src/pages/creations/landing-page.astro`**
- `stat-row` panel: remove `gain_conversion_moyen +180%` and `pages_livrées 98+`; keep `délai_livraison 3-5j`.
- `result-box` (fabricated testimonial "Nadia M." with invented 2.7×/11% figures, plus the `+180%` delta): remove the fake name and quote; replace with an honest description of the AIDA-structure/A-B-testing methodology, no invented numbers.

**`src/pages/creations/site-web.astro`**
- `stat-row` panel: remove `sites_livrés 75+`; keep `score_pagespeed_mobile 90+` (real, testable guarantee) and `délai_livraison 10-14j`.
- `result-box` (fabricated testimonial "Rachid O." with an invented usage story): remove the fake name and quote; the `90+` PageSpeed delta is a legitimate guarantee and can stay, reframed as a company commitment rather than a client's claimed result.

## New page: `src/pages/a-propos.astro`

Ported from the legacy `a-propos.html` (read in full — the original had a hero with a live-metrics console panel, a stats section, a 2020→2024 story timeline, a 3-person team, and 3 named-client testimonials, in addition to a manifesto, values, and process section). Per the same rule:

- **Hero**: headline ("Pas un prestataire. Un partenaire de croissance."), mission subtitle, CTA buttons (démarrer un projet / voir les créations). No metrics console panel.
- **Expertise marquee**: scrolling list of skills (tunnels de vente, landing pages, email marketing, branding digital, automatisation, copywriting, optimisation CRO) — drop "Systeme.io" from the list.
- **Manifesto**: philosophy quote + supporting paragraphs — no numbers, pure positioning. Kept as-is in spirit (no fabrication risk here).
- **Stats section** ("En chiffres" — 4 big numbers with a progress-bar animation): removed entirely.
- **Story/timeline** (2020 → 2024 with specific milestones): removed entirely — no verified history to present yet.
- **Values** (4 cards: résultats avant tout, livraison express, transparence totale, optimisation continue): kept — these are principles/commitments, not claimed track record.
- **Team** (3 fictional named people with bios): removed entirely.
- **Process** (4 steps: audit gratuit → plan d'action → implémentation → optimisation continue): kept, matching the process section already used on other pages.
- **Testimonials** (3 fictional named clients): removed entirely.
- **Final CTA**: kept, with a proof line built only from real commitments (audit gratuit, réponse 24h, livraison 7 jours, sans engagement) — no counts.

Uses the site's `BaseLayout`/`Header`/`Footer` components, matching every other Astro page (not the legacy file's self-contained nav/footer markup). Route: `/a-propos` (already linked from `Header.astro`, currently 404s).

## Root reference file

`a-propos.html` (legacy root file) gets rebuilt as a static reference copy matching the new `a-propos.astro` content, following the same established pattern as `home-page.html`/`services.html`/`service-saas.html`/`contact.html` — standalone document, no working JS, `<title>À propos — TalentDigital.net</title>`.

## Testing / Verification

No automated tests apply (static marketing content). Verification is: `npm run build` succeeds, and manual browser check via the preview tools that each edited page still renders correctly, the removed sections are gone cleanly (no orphaned CSS selectors causing layout gaps), and section numbering (`01 —`, `02 —`, etc.) stays sequential where sections were removed.

## Out of Scope

- Rewriting the value proposition or process steps themselves — only removing fabricated proof, not changing the site's actual service descriptions.
- Any other root-level legacy `.html` reference files not tied to pages touched by this spec.
