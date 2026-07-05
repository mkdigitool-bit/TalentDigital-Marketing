# Mentions Légales Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a combined "Mentions légales / Politique de confidentialité" page at `/mentions-legales`, fix the two dead `Politique de confidentialité` links, and link the new page from the footer.

**Architecture:** One new Astro page styled like the existing `a-propos.astro` (`.page-hero` + `.section wrap` pattern), two anchored sections (`#mentions`, `#confidentialite`). No new backend, no forms, no tests beyond a build check — this is static prose content.

**Tech Stack:** Astro 7, existing global design tokens (`src/styles/global.css`).

## Global Constraints

- No fabricated business/legal information: no invented SIRET/RC/ICE registration number, no invented registered address, no invented legal form (TalentDigital has no registered legal entity as of this writing).
- Hosting is stated as **Vercel Inc.** only (no street address — not confidently known, so it is omitted rather than guessed).
- The privacy section must describe only what the codebase actually does: the two real Supabase-backed forms and their real field sets, and honest disclosure of Google Analytics without claiming a consent mechanism that doesn't exist (no cookie banner exists — out of scope, per explicit user decision recorded in the spec).
- Root reference `.html` files use a **minimal one-line copyright footer** (verified: `contact.html`, `audit.html`, `home-page.html`, `a-propos.html` all use `<footer class="site-footer"><div class="wrap"><p>© 2026 TalentDigital — Tous droits réservés</p></div></footer>`, not the multi-column footer) — so no footer-link changes are needed in any reference `.html` file, only the two dead-link fixes and the new `mentions-legales.html` file.
- "Mentions légales" is a footer-only link — it is NOT added to the primary nav (`Header.astro` or the reference files' nav), matching the spec.

---

### Task 1: Create `src/pages/mentions-legales.astro`

**Files:**
- Create: `src/pages/mentions-legales.astro`

**Interfaces:**
- Consumes: `../layouts/BaseLayout.astro` (existing, unchanged).
- Produces: route `/mentions-legales` with anchors `#mentions` and `#confidentialite`, consumed by Task 2's link fixes.

- [ ] **Step 1: Create the page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Mentions légales — TalentDigital" description="Mentions légales et politique de confidentialité de TalentDigital : informations sur l'éditeur du site, l'hébergement, et le traitement de vos données personnelles.">

<section class="page-hero wrap">
  <span class="prompt">Informations légales — <b>TalentDigital.net</b></span>
  <h1>Mentions légales<br>&amp; <em>confidentialité.</em></h1>
  <p class="page-hero__sub">Les informations légales sur l'éditeur du site et la manière dont vos données sont utilisées lorsque vous nous contactez.</p>
</section>

<section id="mentions" class="section wrap legal">
  <div class="section__head">
    <span class="prompt">01 — <b>mentions légales</b></span>
    <h2>Éditeur du <em>site.</em></h2>
  </div>
  <div class="legal__body">
    <p>Ce site est édité par <b>TalentDigital</b>, activité exercée à titre indépendant. TalentDigital n'est, à ce jour, pas immatriculé en tant que société ; cette page sera mise à jour dès qu'une structure juridique sera enregistrée.</p>
    <ul class="legal__list">
      <li><b>Nom commercial :</b> TalentDigital</li>
      <li><b>Site :</b> talentdigital.net</li>
      <li><b>Contact :</b> <a href="mailto:info@talentdigital.net">info@talentdigital.net</a></li>
      <li><b>WhatsApp :</b> <a href="https://wa.me/212663206266">+212 6 63 20 62 66</a></li>
    </ul>
    <h3>Hébergement</h3>
    <p>Ce site est hébergé par <b>Vercel Inc.</b> (<a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>).</p>
  </div>
</section>

<section id="confidentialite" class="section wrap legal">
  <div class="section__head">
    <span class="prompt">02 — <b>confidentialité</b></span>
    <h2>Vos <em>données.</em></h2>
  </div>
  <div class="legal__body">
    <h3>Responsable du traitement</h3>
    <p>TalentDigital est responsable du traitement des données collectées via ce site. Pour toute question, contactez <a href="mailto:info@talentdigital.net">info@talentdigital.net</a>.</p>

    <h3>Données collectées</h3>
    <p>Deux formulaires sur ce site collectent des informations, uniquement lorsque vous les soumettez volontairement :</p>
    <ul class="legal__list">
      <li><b>Demande d'audit</b> (page /audit) : prénom, nom, email, téléphone (facultatif), service recherché, budget estimé, message.</li>
      <li><b>Formulaire de contact</b> (page /contact) : prénom, email, téléphone (facultatif), message.</li>
    </ul>

    <h3>Finalité</h3>
    <p>Ces informations servent uniquement à traiter votre demande et à vous répondre. Chaque soumission déclenche également un email de notification interne à TalentDigital.</p>

    <h3>Destinataires</h3>
    <p>Vos données ne sont ni vendues ni partagées avec des tiers. Elles sont accessibles uniquement à TalentDigital.</p>

    <h3>Vos droits</h3>
    <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment en écrivant à <a href="mailto:info@talentdigital.net">info@talentdigital.net</a>.</p>

    <h3>Mesure d'audience</h3>
    <p>Ce site utilise Google Analytics pour mesurer la fréquentation et comprendre l'usage des pages. Ce service peut déposer des cookies dans votre navigateur. Vous pouvez bloquer ces cookies via les réglages de votre navigateur ou une extension de blocage.</p>
  </div>
</section>

</BaseLayout>

<style>
  .legal{border-top:1px solid var(--line)}
  .legal:first-of-type{border-top:0}
  .legal__body{max-width:68ch}
  .legal__body p{color:var(--muted);line-height:1.7;margin-bottom:1rem}
  .legal__body h3{font-size:1.1rem;font-weight:800;margin:1.6rem 0 .6rem;letter-spacing:-.01em}
  .legal__body a{color:var(--lime);text-decoration:underline;text-underline-offset:3px}
  .legal__list{list-style:none;display:flex;flex-direction:column;gap:.5rem;color:var(--muted);margin-bottom:1rem}
  .legal__list b{color:var(--txt)}

  #mentions,#confidentialite{scroll-margin-top:90px}
</style>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds; `dist/mentions-legales/index.html` exists and contains both "Éditeur du site" and "Vos données" section headings.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mentions-legales.astro
git commit -m "feat: add /mentions-legales page (mentions légales + confidentialité)"
```

---

### Task 2: Link the new page (Footer + dead-link fixes)

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/audit.astro`

**Interfaces:**
- Consumes: route `/mentions-legales` and anchor `#confidentialite` (Task 1).

- [ ] **Step 1: Add the footer link**

In `src/components/Footer.astro`, find:

```astro
          <li><a href="mailto:contact@talentdigital.net">contact@talentdigital.net</a></li>
          <li><a href="/contact">Formulaire de contact</a></li>
          <li><a href="/audit">Audit gratuit</a></li>
        </ul>
      </div>
```

Replace with:

```astro
          <li><a href="mailto:contact@talentdigital.net">contact@talentdigital.net</a></li>
          <li><a href="/contact">Formulaire de contact</a></li>
          <li><a href="/audit">Audit gratuit</a></li>
          <li><a href="/mentions-legales">Mentions légales</a></li>
        </ul>
      </div>
```

- [ ] **Step 2: Fix the dead link in `contact.astro`**

In `src/pages/contact.astro`, find:

```astro
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="#">Politique de confidentialité</a></p>
```

Replace with:

```astro
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="/mentions-legales#confidentialite">Politique de confidentialité</a></p>
```

- [ ] **Step 3: Fix the dead link in `audit.astro`**

In `src/pages/audit.astro`, apply the identical find/replace as Step 2 (same exact line of text).

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro src/pages/contact.astro src/pages/audit.astro
git commit -m "feat: link /mentions-legales from footer and fix dead privacy-policy links"
```

---

### Task 3: Root reference files — `mentions-legales.html` (new) + dead-link fixes

**Files:**
- Create: `mentions-legales.html`
- Modify: `contact.html`
- Modify: `audit.html`

**Interfaces:**
- Consumes: this project's established reference-file convention (self-contained `<style>`, text-logo nav, zero `<script>` tags, full document structure, minimal one-line copyright footer).

- [ ] **Step 1: Create `mentions-legales.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mentions légales — TalentDigital.net</title>
<meta name="description" content="Mentions légales et politique de confidentialité de TalentDigital : informations sur l'éditeur du site, l'hébergement, et le traitement de vos données personnelles." />
<meta name="color-scheme" content="dark" />
<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
:root{
  --void:#0E0E10; --panel:#151518; --panel-2:#1B1B1F; --line:#27272D; --line-2:#3A3A42;
  --txt:#B8B8B2; --muted:#72727A; --lime:#C7F73E;
  --display:"Archivo",system-ui,sans-serif; --mono:"JetBrains Mono",ui-monospace,monospace;
  --maxw:1240px; --pad:clamp(1.25rem,5vw,3.5rem); --section:clamp(4.5rem,9vw,8rem); --ease:cubic-bezier(.2,.7,.2,1);
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--void);color:var(--txt);font-family:var(--display);line-height:1.6}
a{color:inherit;text-decoration:none}
.wrap{max-width:var(--maxw);margin:0 auto;padding-inline:var(--pad)}
.prompt{font-family:var(--mono);font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:.6rem}
.prompt::before{content:">";color:var(--lime);font-weight:700}
h1,h2,h3,h4{font-family:var(--display);line-height:1.02;letter-spacing:-.02em}
h2{font-size:clamp(1.9rem,4.4vw,3.3rem);font-weight:800;margin-top:.9rem}
h2 em{font-style:normal;color:var(--lime)}
.btn{--bg:var(--lime);--fg:var(--void);--bd:var(--lime);display:inline-flex;align-items:center;gap:.6rem;background:var(--bg);color:var(--fg);font-family:var(--mono);font-weight:700;font-size:.85rem;letter-spacing:.02em;text-transform:uppercase;padding:.92rem 1.5rem;border:1px solid var(--bd);border-radius:3px}
.btn--ghost{--bg:transparent;--fg:var(--txt);--bd:var(--line-2)}
.nav{position:sticky;top:0;z-index:200;background:rgba(14,14,16,.92);border-bottom:1px solid var(--line)}
.nav__in{display:flex;align-items:center;justify-content:space-between;height:74px}
.brand{font-weight:900;font-size:1.45rem;letter-spacing:-.04em}
.nav__links{display:flex;align-items:center;gap:2rem;font-family:var(--mono);font-size:.8rem;text-transform:uppercase;color:var(--muted)}
.nav__links a{color:inherit}
.section{padding-block:var(--section)}
.section__head{max-width:64ch;margin-bottom:clamp(2.4rem,5vw,3.6rem)}
.site-footer{border-top:1px solid var(--line);padding-block:3rem 2rem;background:var(--panel);font-size:.9rem;color:var(--muted)}

.page-hero{padding-block:clamp(3.5rem,8vw,6rem) var(--section)}
.page-hero h1{font-size:clamp(2.4rem,5.6vw,4.6rem);font-weight:900;letter-spacing:-.03em;margin-top:1rem}
.page-hero h1 em{font-style:normal;color:var(--lime)}
.page-hero__sub{margin-top:1.4rem;color:var(--muted);max-width:56ch;font-size:clamp(1rem,1.3vw,1.15rem);line-height:1.65}

.legal{border-top:1px solid var(--line)}
.legal:first-of-type{border-top:0}
.legal__body{max-width:68ch}
.legal__body p{color:var(--muted);line-height:1.7;margin-bottom:1rem}
.legal__body h3{font-size:1.1rem;font-weight:800;margin:1.6rem 0 .6rem;letter-spacing:-.01em}
.legal__body a{color:var(--lime);text-decoration:underline;text-underline-offset:3px}
.legal__list{list-style:none;display:flex;flex-direction:column;gap:.5rem;color:var(--muted);margin-bottom:1rem}
.legal__list b{color:var(--txt)}
</style>
</head>
<body>

<header>
  <nav class="nav">
    <div class="wrap nav__in">
      <a href="/" class="brand">TalentDigital<span style="color:var(--lime)">.net</span></a>
      <div class="nav__links">
        <a href="/">Accueil</a>
        <a href="/landing-page">Landing page</a>
        <a href="/tunnel">Tunnel de vente</a>
        <a href="/site-web">Site web</a>
        <a href="/saas">SaaS</a>
        <a href="/a-propos">À propos</a>
        <a href="/contact">Contact</a>
        <a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
      </div>
    </div>
  </nav>
</header>

<main>

<section class="page-hero wrap">
  <span class="prompt">Informations légales — <b>TalentDigital.net</b></span>
  <h1>Mentions légales<br>&amp; <em>confidentialité.</em></h1>
  <p class="page-hero__sub">Les informations légales sur l'éditeur du site et la manière dont vos données sont utilisées lorsque vous nous contactez.</p>
</section>

<section id="mentions" class="section wrap legal">
  <div class="section__head">
    <span class="prompt">01 — <b>mentions légales</b></span>
    <h2>Éditeur du <em>site.</em></h2>
  </div>
  <div class="legal__body">
    <p>Ce site est édité par <b>TalentDigital</b>, activité exercée à titre indépendant. TalentDigital n'est, à ce jour, pas immatriculé en tant que société ; cette page sera mise à jour dès qu'une structure juridique sera enregistrée.</p>
    <ul class="legal__list">
      <li><b>Nom commercial :</b> TalentDigital</li>
      <li><b>Site :</b> talentdigital.net</li>
      <li><b>Contact :</b> <a href="mailto:info@talentdigital.net">info@talentdigital.net</a></li>
      <li><b>WhatsApp :</b> <a href="https://wa.me/212663206266">+212 6 63 20 62 66</a></li>
    </ul>
    <h3>Hébergement</h3>
    <p>Ce site est hébergé par <b>Vercel Inc.</b> (<a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>).</p>
  </div>
</section>

<section id="confidentialite" class="section wrap legal">
  <div class="section__head">
    <span class="prompt">02 — <b>confidentialité</b></span>
    <h2>Vos <em>données.</em></h2>
  </div>
  <div class="legal__body">
    <h3>Responsable du traitement</h3>
    <p>TalentDigital est responsable du traitement des données collectées via ce site. Pour toute question, contactez <a href="mailto:info@talentdigital.net">info@talentdigital.net</a>.</p>

    <h3>Données collectées</h3>
    <p>Deux formulaires sur ce site collectent des informations, uniquement lorsque vous les soumettez volontairement :</p>
    <ul class="legal__list">
      <li><b>Demande d'audit</b> (page /audit) : prénom, nom, email, téléphone (facultatif), service recherché, budget estimé, message.</li>
      <li><b>Formulaire de contact</b> (page /contact) : prénom, email, téléphone (facultatif), message.</li>
    </ul>

    <h3>Finalité</h3>
    <p>Ces informations servent uniquement à traiter votre demande et à vous répondre. Chaque soumission déclenche également un email de notification interne à TalentDigital.</p>

    <h3>Destinataires</h3>
    <p>Vos données ne sont ni vendues ni partagées avec des tiers. Elles sont accessibles uniquement à TalentDigital.</p>

    <h3>Vos droits</h3>
    <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment en écrivant à <a href="mailto:info@talentdigital.net">info@talentdigital.net</a>.</p>

    <h3>Mesure d'audience</h3>
    <p>Ce site utilise Google Analytics pour mesurer la fréquentation et comprendre l'usage des pages. Ce service peut déposer des cookies dans votre navigateur. Vous pouvez bloquer ces cookies via les réglages de votre navigateur ou une extension de blocage.</p>
  </div>
</section>

</main>

<footer class="site-footer">
  <div class="wrap">
    <p>© 2026 TalentDigital — Tous droits réservés</p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Fix the dead link in `contact.html`**

In `contact.html`, find:

```html
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="#">Politique de confidentialité</a></p>
```

Replace with:

```html
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="/mentions-legales#confidentialite">Politique de confidentialité</a></p>
```

- [ ] **Step 3: Fix the dead link in `audit.html`**

In `audit.html`, apply the identical find/replace as Step 2 (same exact line of text).

- [ ] **Step 4: Commit**

```bash
git add mentions-legales.html contact.html audit.html
git commit -m "feat: add reference mentions-legales.html, fix dead privacy-policy links"
```

---

### Task 4: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Run the test suite**

Run: `npm test`
Expected: all 14 existing tests pass (this feature adds no new tests — it's static content, no logic to unit test).

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: build succeeds; `dist/mentions-legales/index.html` exists.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev` (or use an already-running preview server, rebuilding first if it serves from `dist/`)
- Open `/mentions-legales` — confirm both sections render ("Éditeur du site" and "Vos données"), and no fabricated registration number or address appears.
- Open `/contact` and `/audit` — confirm the "Politique de confidentialité" link now navigates to `/mentions-legales#confidentialite` instead of doing nothing.
- Scroll to the footer on any page — confirm "Mentions légales" appears under the "Contact" column and links to `/mentions-legales`.

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

Expected: push succeeds; no conflicts.
