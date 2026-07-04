# Reference File Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the root-level static `.html` reference files back in sync with the honest content now live in `src/pages` (fabricated stats/testimonials/team removed, real commitments kept, no Systeme.io), and delete the two reference files that no longer correspond to any live page.

**Architecture:** This is a follow-up to `docs/superpowers/plans/2026-07-04-honest-content-and-a-propos.md`, which cleaned the live Astro pages but explicitly left the sibling root `.html` reference files untouched. Each task here re-derives one root file from its already-cleaned live counterpart, following the exact static-reference pattern established by `service-saas.html`/`a-propos.html`/`contact.html` (self-contained `<style>` block, text-logo nav, plain footer, no `<script>` tag, no working backend). Two files with no live counterpart are deleted outright.

**Tech Stack:** Plain HTML/CSS (no build step — these files are not part of the Astro build).

## Global Constraints

- Every file in this plan must end up with **zero** fabricated statistics (project/tunnel/page/site counts, average-result percentages, star ratings, country-reach counts) and **zero** fake named-client testimonials — matching what is now live in the corresponding `src/pages` file.
- Keep real, controllable commitments unchanged in spirit: delivery timelines, quote turnaround, guarantees (e.g. PageSpeed 90+, 100% code source, 30j garantie).
- **Zero** "Systeme.io" mentions anywhere in any of these files.
- Each rewritten file follows the established reference-file pattern: self-contained `<style>` block with the shared CSS tokens, plain-markup nav with a **text logo** (not an `<img>`), links to `/`, `/creations`, `/a-propos`, `/contact`, plain footer, **no `<script>` tag at all**, no working form/fetch logic.
- No automated test framework applies (static reference documents) — verification is a grep check per file for the forbidden strings.

---

### Task 1: Update `home-page.html`

**Files:**
- Modify: `home-page.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `home-page.html` to mirror the current content of `src/pages/index.astro` (already live and honest on `main`): hero (headline/subtitle/CTA, "engagements" panel showing `audit_gratuit`/`oui`, `réponse_sous`/`24h`, `délai_livraison`/`7j` — no fabricated `42%`/`120+`), portfolio carousel, "pour qui" cards, services cards, processus (4 steps, renumbered sequentially), FAQ, final CTA (no `120+ entrepreneurs` line). No testimonials section (removed from the live page). Follow the established pattern already used in this same file for structure (self-contained `<style>`, text logo, no `<script>`, no reveal animations) — only the content inside needs to match the new honest copy.

- [ ] **Step 2: Verify**

Run: `grep -c "120+\|42%\|Sofia M\.\|Karim B\.\|Émilie D\." home-page.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add home-page.html
git commit -m "docs: sync home-page.html reference copy with honest homepage content"
```

---

### Task 2: Update `contact.html`

**Files:**
- Modify: `contact.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `contact.html` to mirror the current content of `src/pages/contact.astro` (already live and honest on `main`): the sidebar no longer has a "Résultats clients" card with `120+`/`4.8★`/`12+ Pays` — it now has only "Ce qui se passe ensuite" and "Contact direct". Keep the rest of the file's existing structure (hero, form, FAQ, strip) unchanged since those were already accurate; this task's only content change is removing the fabricated trust-stats card to match the live page.

- [ ] **Step 2: Verify**

Run: `grep -c "120+\|4\.8★\|trust-stat" contact.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "docs: sync contact.html reference copy with honest content"
```

---

### Task 3: Update `services.html`

**Files:**
- Modify: `services.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `services.html` to mirror the current content of `src/pages/creations/index.astro` (already live and honest on `main`): hero stats now read `Gratuit`/`Audit initial`, `7j`/`Délai moyen`, `Oui`/`Sans engagement` (no `120+`/`×3`); per-card result lines read `Order bumps & upsells inclus` and `Structure AIDA & A/B testing` (the `Score PageSpeed 90+ garanti` and `Code source livré à 100%` lines are unchanged, real guarantees); final CTA no longer has the `120+ projets livrés dans 12+ pays` line.

- [ ] **Step 2: Verify**

Run: `grep -c "120+\|×3 sur le panier\|+180% de conversion" services.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "docs: sync services.html reference copy with honest content"
```

---

### Task 4: Update `service-tunnels.html`

**Files:**
- Modify: `service-tunnels.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `service-tunnels.html` to mirror the current content of `src/pages/creations/tunnel.astro` (already live and honest on `main`): stats panel now reads `audit_gratuit`/`oui`, `délai_livraison`/`7j`, `sans_engagement`/`oui` (no `×3`/`120+`); both "Systeme.io" mentions removed from the deliverables/process copy; the result-box quote is now attributed to "L'équipe TalentDigital" (not "Karim B.") with a `7j` delta (not `×3`); final CTA no longer has the `120+ tunnels livrés dans 12+ pays` line.

- [ ] **Step 2: Verify**

Run: `grep -c "Karim B\.\|Systeme\.io\|120+\|×3<span" service-tunnels.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add service-tunnels.html
git commit -m "docs: sync service-tunnels.html reference copy with honest content"
```

---

### Task 5: Update `service-landing-pages.html`

**Files:**
- Modify: `service-landing-pages.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `service-landing-pages.html` to mirror the current content of `src/pages/creations/landing-page.astro` (already live and honest on `main`): stats panel now reads `audit_gratuit`/`oui`, `délai_livraison`/`3-5j`, `sans_engagement`/`oui` (no `+180%`/`98+`); both "Systeme.io" mentions removed; the result-box quote is now attributed to "L'équipe TalentDigital" (not "Nadia M.") with a `3-5j` delta (not `+180%`); final CTA no longer has the `98+ pages livrées dans 10+ secteurs` line.

- [ ] **Step 2: Verify**

Run: `grep -c "Nadia M\.\|Systeme\.io\|98+\|+180" service-landing-pages.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add service-landing-pages.html
git commit -m "docs: sync service-landing-pages.html reference copy with honest content"
```

---

### Task 6: Update `service-sites-web.html`

**Files:**
- Modify: `service-sites-web.html`

- [ ] **Step 1: Rewrite the file**

Overwrite `service-sites-web.html` to mirror the current content of `src/pages/creations/site-web.astro` (already live and honest on `main`): stats panel now reads `sans_engagement`/`oui` in place of the old `sites_livrés`/`75+` row, while `score_pagespeed_mobile`/`90+` and `délai_livraison`/`10-14j` are unchanged (real guarantees); the "Résultat moyen" wording is now "Objectif garanti" (PageSpeed numbers 90+/95+ unchanged); the result-box quote is now attributed to "L'équipe TalentDigital" (not "Rachid O.") while the `90+` delta and its guarantee label are unchanged; final CTA no longer has the `75+ sites livrés dans 15+ secteurs` line.

- [ ] **Step 2: Verify**

Run: `grep -c "Rachid O\.\|75+\|Résultat moyen" service-sites-web.html`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add service-sites-web.html
git commit -m "docs: sync service-sites-web.html reference copy with honest content"
```

---

### Task 7: Delete orphaned reference files

**Files:**
- Delete: `service-email-marketing.html`
- Delete: `service-content-social.html`
- Delete: `service-branding.html`

**Interfaces:** None — these files have no corresponding live Astro page (no `/creations/email-marketing`, `/creations/content-social`, or `/creations/branding` route exists), so there is nothing to sync them against. The user confirmed deletion of all three (the last one has no fabricated content, but is orphaned like the other two — same disposition).

- [ ] **Step 1: Check tracking status**

Run: `git ls-files -- service-email-marketing.html service-content-social.html service-branding.html`

For each path listed (tracked), remove it with `git rm <path>`. For each path NOT listed (untracked), delete it directly (e.g. `rm <path>` in bash) instead — `git rm` fails on untracked files.

- [ ] **Step 2: Commit**

```bash
git add -A service-email-marketing.html service-content-social.html service-branding.html
git commit -m "docs: remove orphaned reference files with no corresponding live page"
```

(This `git add -A` scoped to the three paths only stages removals for files that were tracked. If all three were untracked and plain-deleted, skip this commit — there is nothing for git to record. Confirm with `git status --short` before committing.)

---

### Task 8: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Verify no fabricated content remains in any root `.html` file**

Run: `grep -rln "120+\|98+\|75+\|4\.8★\|Sofia M\.\|Karim B\.\|Émilie D\.\|Nadia M\.\|Rachid O\.\|Systeme\.io" *.html`
Expected: no output (empty) — or, if any `.html` files outside this plan's scope still match (e.g. files never touched by any plan), list them and confirm with the user whether they're intentionally out of scope before proceeding.

- [ ] **Step 2: Confirm the three orphaned files are gone**

Run: `ls service-email-marketing.html service-content-social.html service-branding.html 2>&1`
Expected: all three report "No such file or directory".

- [ ] **Step 3: Push**

```bash
git push origin main
```

Expected: push succeeds, no conflicts.
