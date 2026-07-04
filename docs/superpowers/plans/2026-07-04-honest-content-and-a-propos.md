# Honest Content Cleanup + À Propos Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every fabricated statistic, fake client testimonial, and fake team member from the live site, and build the new `/a-propos` page (currently 404s) using only honest, controllable claims.

**Architecture:** Pure content edits across 6 existing Astro pages (no logic/behavior changes), plus one new Astro page (`src/pages/a-propos.astro`) built with the same `BaseLayout`/`Header`/`Footer` pattern as every other page, plus a matching root-level static reference file (`a-propos.html`) following the project's established reference-copy convention.

**Tech Stack:** Astro 7 (static), existing `src/styles/global.css` design tokens (no new tokens needed).

## Global Constraints

- **Keep** (forward commitments the business controls regardless of track record): delivery timelines (7 jours, 3-5 jours, 10-14 jours), quote turnaround (devis sous 48h / 24h / 48h), guarantees (garantie post-livraison 30j, PageSpeed 90+ garanti), free-audit terms, "100% du code source livré."
- **Remove** (claimed track record with no real data behind it): project/tunnel/page/site counts (120+, 98+, 75+), average result claims (×3, +180%, 42%, +28%), star ratings (4.8★), country-reach counts (12+ pays, 10+/15+ secteurs), and every fabricated named-client testimonial and fabricated named team member.
- No Systeme.io references anywhere in the site (established rule from the Contact-page work) — also remove the 4 remaining mentions of "Systeme.io" as an example third-party tool in `tunnel.astro` and `landing-page.astro`.
- New/edited pages use the site's shared `BaseLayout`/`Header`/`Footer` components — never a page's own self-contained nav/footer markup.
- No automated test framework applies here (static marketing content, consistent with the rest of the project) — verification is `npm run build` plus manual browser checks.
- Section numbering (the `01 —`, `02 —` prompt labels) must stay sequential after any section is removed.

---

### Task 1: Clean up the homepage (`src/pages/index.astro`)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the fabricated hero metrics panel with an honest commitments panel**

Find (lines 49–77):

```astro
    <div class="console reveal" aria-label="Indicateurs de performance">
      <div class="console__bar" aria-hidden="true">
        <span class="console__dot"></span><span class="console__dot"></span><span class="console__dot on"></span>
        <span class="console__name">résultats.live</span>
      </div>
      <div class="console__body">
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">taux_ouverture_email</span>
            <span class="metric__val">42<span class="u">%</span></span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="84"></div></div>
        </div>
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">délai_livraison</span>
            <span class="metric__val">7<span class="u">j</span></span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="70"></div></div>
        </div>
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">projets_livrés</span>
            <span class="metric__val">120<span class="u">+</span></span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="92"></div></div>
        </div>
      </div>
    </div>
```

Replace with:

```astro
    <div class="console reveal" aria-label="Engagements">
      <div class="console__bar" aria-hidden="true">
        <span class="console__dot"></span><span class="console__dot"></span><span class="console__dot on"></span>
        <span class="console__name">engagements</span>
      </div>
      <div class="console__body">
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">audit_gratuit</span>
            <span class="metric__val">oui</span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="100"></div></div>
        </div>
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">réponse_sous</span>
            <span class="metric__val">24<span class="u">h</span></span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="90"></div></div>
        </div>
        <div class="metric">
          <div class="metric__top">
            <span class="metric__label">délai_livraison</span>
            <span class="metric__val">7<span class="u">j</span></span>
          </div>
          <div class="metric__bar"><div class="metric__fill" data-w="95"></div></div>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Remove the fabricated testimonials section and renumber the sections after it**

Find (lines 186–252, the whole testimonials section through the end of the process section's opening prompt):

```astro
<div class="tmo-cinematic"><section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>résultats clients</b></span>
    <h2>Des chiffres, <em>pas</em> des compliments.</h2>
    <p class="lede" style="margin-top:.8rem">Chaque témoignage correspond à un projet réel, des chiffres vérifiés, un client joignable.</p>
  </div>
  <div class="tmo__grid">
    <figure class="tmo reveal">
      <div class="tmo__head"><div class="stars" aria-label="Note 5 sur 5">★★★★★</div><span class="tmo__delta">+32 appels</span></div>
      <blockquote class="tmo__q">« Mon tunnel tourne tout seul. +32 appels qualifiés le premier mois, sans que je touche à rien. »</blockquote>
      <figcaption class="tmo__by">
        <span class="tmo__av" aria-hidden="true">S</span>
        <span><span class="tmo__name">Sofia M.</span><br><span class="tmo__role">Coach business · Lyon</span></span>
      </figcaption>
    </figure>
    <figure class="tmo reveal">
      <div class="tmo__head"><div class="stars" aria-label="Note 5 sur 5">★★★★★</div><span class="tmo__delta">1,2% → 4,8%</span></div>
      <blockquote class="tmo__q">« Page de vente livrée en 6 jours. On est passés de 1,2 % à 4,8 % de conversion sur le même trafic. »</blockquote>
      <figcaption class="tmo__by">
        <span class="tmo__av" aria-hidden="true">K</span>
        <span><span class="tmo__name">Karim B.</span><br><span class="tmo__role">Formateur · Casablanca</span></span>
      </figcaption>
    </figure>
    <figure class="tmo reveal">
      <div class="tmo__head"><div class="stars" aria-label="Note 5 sur 5">★★★★★</div><span class="tmo__delta">+28% panier</span></div>
      <blockquote class="tmo__q">« Les order bumps ont fait +28 % de panier moyen. Rentabilisé en deux semaines, chrono en main. »</blockquote>
      <figcaption class="tmo__by">
        <span class="tmo__av" aria-hidden="true">É</span>
        <span><span class="tmo__name">Émilie D.</span><br><span class="tmo__role">E-commerçante · Bruxelles</span></span>
      </figcaption>
    </figure>
  </div>
</section></div>

<section class="section wrap" id="processus">
  <div class="section__head reveal">
    <span class="prompt">05 — <b>processus</b></span>
```

Replace with:

```astro
<section class="section wrap" id="processus">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>processus</b></span>
```

- [ ] **Step 3: Renumber the FAQ section**

Find (line 257, inside the FAQ section):

```astro
      <span class="prompt">06 — <b>faq</b></span>
```

Replace with:

```astro
      <span class="prompt">05 — <b>faq</b></span>
```

- [ ] **Step 4: Remove the fabricated count from the final CTA proof line**

Find (lines 290–294):

```astro
    <div class="final__proof">
      <span><b>120+</b> entrepreneurs accompagnés dans le monde</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Livraison en <b>7 jours</b> · Sans engagement</span>
    </div>
```

Replace with:

```astro
    <div class="final__proof">
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Livraison en <b>7 jours</b> · Sans engagement</span>
    </div>
```

- [ ] **Step 5: Remove the now-dead testimonials CSS**

Find (lines 378–394):

```css
  .tmo__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
  .tmo{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:1.8rem;display:flex;flex-direction:column;gap:1.1rem;transition:.3s var(--ease)}
  .tmo:hover{transform:translateY(-4px);border-color:var(--line-2)}
  .tmo__head{display:flex;justify-content:space-between;align-items:center}
  .stars{color:var(--lime);letter-spacing:.15em;font-size:.9rem}
  .tmo__delta{font-family:var(--mono);font-size:.72rem;color:var(--lime);border:1px solid var(--line-2);border-radius:100px;padding:.25rem .55rem}
  .tmo__q{font-size:1.12rem;line-height:1.45;font-weight:500}
  .tmo__by{margin-top:auto;display:flex;align-items:center;gap:.85rem;border-top:1px solid var(--line);padding-top:1rem}
  .tmo__av{width:42px;height:42px;border-radius:50%;background:var(--lime);color:var(--void);display:grid;place-items:center;font-family:var(--display);font-weight:900;font-size:1rem;flex:none}
  .tmo__name{font-weight:700;font-size:.95rem}
  .tmo__role{font-family:var(--mono);font-size:.72rem;color:var(--muted)}
  @media (max-width:880px){.tmo__grid{grid-template-columns:1fr}}

  /* ── cinematic sections ── */
  .cinematic{position:relative}
  .cinematic::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none}
  .tmo-cinematic{background:linear-gradient(rgba(14,14,16,.87),rgba(14,14,16,.87)),url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80&fit=crop') center/cover no-repeat;border-block:1px solid rgba(199,247,62,.1)}
```

Delete this whole block (nothing replaces it).

- [ ] **Step 6: Fix the stale comment referencing the removed à-propos metrics pattern**

Find (line 455):

```js
  /* barres de progression — même pattern que résultats.live (a-propos) */
```

Replace with:

```js
  /* barres de progression (engagements) */
```

- [ ] **Step 7: Build and verify**

Run: `npm run build`
Expected: build succeeds, no errors.

Run: `grep -c "Sofia M.\|Karim B.\|Émilie D.\|120+\|42%" src/pages/index.astro` (from the repo root)
Expected: `0` (no matches — confirms every fabricated string is gone).

- [ ] **Step 8: Commit**

```bash
git add src/pages/index.astro
git commit -m "fix: remove fabricated stats and fake testimonials from homepage"
```

---

### Task 2: Clean up the contact page (`src/pages/contact.astro`)

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Remove the fabricated "Résultats clients" sidebar card**

Find (lines 172–195):

```astro
        <div class="side-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 13l4-5 4 3 4-7"/><circle cx="16" cy="4" r="1.5" fill="currentColor"/></svg>
            Résultats clients
          </h3>
          <div class="trust-stats">
            <div class="trust-stat">
              <div class="trust-stat__val">120<span class="u">+</span></div>
              <div class="trust-stat__lbl">Projets livrés</div>
            </div>
            <div class="trust-stat">
              <div class="trust-stat__val">7<span class="u">j</span></div>
              <div class="trust-stat__lbl">Délai moyen</div>
            </div>
            <div class="trust-stat">
              <div class="trust-stat__val">4.8<span class="u">★</span></div>
              <div class="trust-stat__lbl">Note clients</div>
            </div>
            <div class="trust-stat">
              <div class="trust-stat__val">12<span class="u">+</span></div>
              <div class="trust-stat__lbl">Pays</div>
            </div>
          </div>
        </div>

        <div class="side-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
            Contact direct
          </h3>
```

Replace with:

```astro
        <div class="side-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
            Contact direct
          </h3>
```

- [ ] **Step 2: Remove the now-dead trust-stats CSS**

Find (in the `<style>` block):

```css
  .trust-stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border-radius:4px;overflow:hidden}
  .trust-stat{background:var(--panel);padding:.9rem 1rem;text-align:center}
  .trust-stat__val{font-family:var(--display);font-weight:900;font-size:1.5rem;line-height:1;letter-spacing:-.02em;color:var(--txt)}
  .trust-stat__val .u{font-family:var(--mono);font-size:.5em;color:var(--lime);font-weight:700;vertical-align:super}
  .trust-stat__lbl{font-family:var(--mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:.3rem}
```

Delete this whole block.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "120+\|4.8\|trust-stat" src/pages/contact.astro`
Expected: `0`

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro
git commit -m "fix: remove fabricated trust-stats card from contact page"
```

---

### Task 3: Clean up the Créations overview (`src/pages/creations/index.astro`)

**Files:**
- Modify: `src/pages/creations/index.astro`

- [ ] **Step 1: Replace the fabricated hero stats with real commitments**

Find (line 15–17):

```astro
      <div class="stat"><div class="stat__val">120+</div><div class="stat__lbl">Projets livrés</div></div>
      <div class="stat"><div class="stat__val">7j</div><div class="stat__lbl">Délai moyen</div></div>
      <div class="stat"><div class="stat__val">×3</div><div class="stat__lbl">Panier moyen</div></div>
```

Replace with:

```astro
      <div class="stat"><div class="stat__val">Gratuit</div><div class="stat__lbl">Audit initial</div></div>
      <div class="stat"><div class="stat__val">7j</div><div class="stat__lbl">Délai moyen</div></div>
      <div class="stat"><div class="stat__val">Oui</div><div class="stat__lbl">Sans engagement</div></div>
```

- [ ] **Step 2: Remove the fabricated per-card result lines**

Find (line 45):

```astro
          <span class="svc-card__result">Résultat moyen : ×3 sur le panier</span>
```

Replace with:

```astro
          <span class="svc-card__result">Order bumps &amp; upsells inclus</span>
```

Find (line 66):

```astro
          <span class="svc-card__result">Résultat moyen : +180% de conversion</span>
```

Replace with:

```astro
          <span class="svc-card__result">Structure AIDA &amp; A/B testing</span>
```

Lines 87 (`Score PageSpeed 90+ garanti`) and 108 (`Code source livré à 100%`) are real, controllable guarantees — leave unchanged.

- [ ] **Step 3: Remove the fabricated count from the final CTA**

Find (lines 139–143):

```astro
    <div class="final__proof">
      <span><b>120+</b> projets livrés dans 12+ pays</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Plan d'action personnalisé sous <b>48 h</b></span>
    </div>
```

Replace with:

```astro
    <div class="final__proof">
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Plan d'action personnalisé sous <b>48 h</b></span>
    </div>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "120+\|×3 sur le panier\|+180% de conversion" src/pages/creations/index.astro`
Expected: `0`

- [ ] **Step 5: Commit**

```bash
git add src/pages/creations/index.astro
git commit -m "fix: remove fabricated stats from Créations overview page"
```

---

### Task 4: Clean up the Tunnels page (`src/pages/creations/tunnel.astro`)

**Files:**
- Modify: `src/pages/creations/tunnel.astro`

- [ ] **Step 1: Replace the fabricated stats panel**

Find (lines 21–32):

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">résultat_panier_moyen</span>
        <span class="stat-row__val">×3<span class="u">moy</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">7<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">tunnels_livrés</span>
        <span class="stat-row__val">120<span class="u">+</span></span>
      </div>
    </div>
```

Replace with:

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">audit_gratuit</span>
        <span class="stat-row__val">oui</span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">7<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">sans_engagement</span>
        <span class="stat-row__val">oui</span>
      </div>
    </div>
```

- [ ] **Step 2: Remove the "Systeme.io" mentions**

Find (line 72):

```astro
      <p>Configuration de tous les événements de conversion (Meta Pixel, Google Analytics, Systeme.io). Vous voyez exactement d'où viennent vos clients et quel levier génère le plus de revenus.</p>
```

Replace with:

```astro
      <p>Configuration de tous les événements de conversion (Meta Pixel, Google Analytics). Vous voyez exactement d'où viennent vos clients et quel levier génère le plus de revenus.</p>
```

Find (line 122):

```astro
      <p>On construit, on connecte les outils (Systeme.io, Stripe, email) et on teste chaque étape du parcours avant livraison. Zéro bug au lancement.</p>
```

Replace with:

```astro
      <p>On construit, on connecte les outils (Stripe, email) et on teste chaque étape du parcours avant livraison. Zéro bug au lancement.</p>
```

- [ ] **Step 3: Remove the fabricated "résultat moyen" claim in the who-card**

Find (line 96):

```astro
      <p>Order bumps, upsells et séquences de relance transforment chaque commande simple en panier renforcé. Résultat moyen constaté : ×3 sur la valeur moyenne par transaction.</p>
```

Replace with:

```astro
      <p>Order bumps, upsells et séquences de relance transforment chaque commande simple en panier renforcé, sans effort supplémentaire de votre part.</p>
```

- [ ] **Step 4: Replace the fabricated named-client result-box with an honest company statement**

Find (lines 139–148):

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« Mon tunnel tourne en autonomie depuis le lancement. En 30 jours, j'ai récupéré l'investissement ×4. Les order bumps seuls ont ajouté 28 % de CA sur chaque commande. »</blockquote>
      <p class="result-box__by">— <b>Karim B.</b>, Formateur digital · Casablanca</p>
    </div>
    <div>
      <div class="result-box__delta">×3</div>
      <div class="result-box__lbl">sur le panier moyen via order bumps &amp; upsells</div>
    </div>
  </div>
```

Replace with:

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« Un tunnel bien construit vend pendant que vous dormez. Les order bumps et upsells sont configurés une fois, puis tournent en autonomie sur chaque commande. »</blockquote>
      <p class="result-box__by">— <b>L'équipe TalentDigital</b></p>
    </div>
    <div>
      <div class="result-box__delta">7j</div>
      <div class="result-box__lbl">de la validation du plan à la mise en ligne</div>
    </div>
  </div>
```

- [ ] **Step 5: Remove the fabricated count from the final CTA**

Find (line 156):

```astro
      <span><b>120+</b> tunnels livrés dans 12+ pays</span>
```

Replace with:

```astro
      <span><b>Audit gratuit</b> · plan d'action sous 48 h</span>
```

- [ ] **Step 6: Build and verify**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "Karim B\.\|Systeme\.io\|120+\|×3<span" src/pages/creations/tunnel.astro`
Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add src/pages/creations/tunnel.astro
git commit -m "fix: remove fabricated stats, fake testimonial, and Systeme.io mentions from tunnel page"
```

---

### Task 5: Clean up the Landing Pages page (`src/pages/creations/landing-page.astro`)

**Files:**
- Modify: `src/pages/creations/landing-page.astro`

- [ ] **Step 1: Replace the fabricated stats panel**

Find (lines 21–32):

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">gain_conversion_moyen</span>
        <span class="stat-row__val">+180<span class="u">%</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">3-5<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">pages_livrées</span>
        <span class="stat-row__val">98<span class="u">+</span></span>
      </div>
    </div>
```

Replace with:

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">audit_gratuit</span>
        <span class="stat-row__val">oui</span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">3-5<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">sans_engagement</span>
        <span class="stat-row__val">oui</span>
      </div>
    </div>
```

- [ ] **Step 2: Remove the "Systeme.io" mention**

Find (line 67):

```astro
      <p>Connexion au formulaire avec votre outil (Systeme.io, Mailchimp, ActiveCampaign, HubSpot). Chaque lead est automatiquement ajouté à votre liste et tagué selon la source.</p>
```

Replace with:

```astro
      <p>Connexion au formulaire avec votre outil (Mailchimp, ActiveCampaign, HubSpot). Chaque lead est automatiquement ajouté à votre liste et tagué selon la source.</p>
```

Find (line 122):

```astro
      <p>Intégration du design sur votre plateforme (Systeme.io, WordPress, Webflow). Optimisation performance, tracking, formulaire. La page est testée sur 6 écrans avant livraison.</p>
```

Replace with:

```astro
      <p>Intégration du design sur votre plateforme (WordPress, Webflow). Optimisation performance, tracking, formulaire. La page est testée sur 6 écrans avant livraison.</p>
```

- [ ] **Step 3: Replace the fabricated named-client result-box with an honest company statement**

Find (lines 139–148):

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« On passait 2 000 MAD par mois en Meta Ads avec une landing générique à 4 % de conversion. Après refonte, on est à 11 %. Même budget, 2.7× plus de leads. »</blockquote>
      <p class="result-box__by">— <b>Nadia M.</b>, Directrice marketing · Marrakech</p>
    </div>
    <div>
      <div class="result-box__delta">+180%</div>
      <div class="result-box__lbl">d'amélioration moyenne du taux de conversion</div>
    </div>
  </div>
```

Replace with:

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« Une landing générique dilue votre budget publicitaire. Une page dédiée par offre, structurée en AIDA et testée en A/B, transforme le même trafic en plus de leads. »</blockquote>
      <p class="result-box__by">— <b>L'équipe TalentDigital</b></p>
    </div>
    <div>
      <div class="result-box__delta">3-5j</div>
      <div class="result-box__lbl">de la validation du brief à la mise en ligne</div>
    </div>
  </div>
```

- [ ] **Step 4: Remove the fabricated count from the final CTA**

Find (line 156):

```astro
      <span><b>98+</b> pages livrées dans 10+ secteurs</span>
```

Replace with:

```astro
      <span><b>Audit gratuit</b> · plan d'action sous 48 h</span>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "Nadia M\.\|Systeme\.io\|98+\|+180" src/pages/creations/landing-page.astro`
Expected: `0`

- [ ] **Step 6: Commit**

```bash
git add src/pages/creations/landing-page.astro
git commit -m "fix: remove fabricated stats, fake testimonial, and Systeme.io mentions from landing-page page"
```

---

### Task 6: Clean up the Sites Web page (`src/pages/creations/site-web.astro`)

**Files:**
- Modify: `src/pages/creations/site-web.astro`

- [ ] **Step 1: Replace the fabricated stats panel (keep the real PageSpeed guarantee)**

Find (lines 21–32):

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">score_pagespeed_mobile</span>
        <span class="stat-row__val">90<span class="u">+</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">10-14<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">sites_livrés</span>
        <span class="stat-row__val">75<span class="u">+</span></span>
      </div>
    </div>
```

Replace with:

```astro
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">score_pagespeed_mobile</span>
        <span class="stat-row__val">90<span class="u">+</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">délai_livraison</span>
        <span class="stat-row__val">10-14<span class="u">j</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">sans_engagement</span>
        <span class="stat-row__val">oui</span>
      </div>
    </div>
```

- [ ] **Step 2: Reword the "résultat moyen" line so it reads as a guarantee, not a historical average**

Find (line 62):

```astro
      <p>Images compressées au format WebP, code minifié, lazy loading, preload des ressources critiques. Résultat moyen : score PageSpeed 90+ sur mobile et 95+ sur desktop. Rapide partout.</p>
```

Replace with:

```astro
      <p>Images compressées au format WebP, code minifié, lazy loading, preload des ressources critiques. Objectif garanti : score PageSpeed 90+ sur mobile et 95+ sur desktop. Rapide partout.</p>
```

- [ ] **Step 3: Replace the fabricated named-client result-box, keeping the real PageSpeed guarantee**

Find (lines 139–148):

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« Mon ancien site était sur Wix, lent, pas référencé. Après la refonte, PageSpeed 94 sur mobile, je suis passé de 0 à 3 leads par semaine via Google en 2 mois. »</blockquote>
      <p class="result-box__by">— <b>Rachid O.</b>, Architecte d'intérieur · Casablanca</p>
    </div>
    <div>
      <div class="result-box__delta">90+</div>
      <div class="result-box__lbl">score PageSpeed mobile garanti à la livraison</div>
    </div>
  </div>
```

Replace with:

```astro
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« Un site lent perd des visiteurs avant même qu'ils aient vu votre offre. Chaque site que nous livrons est optimisé pour charger vite, sur mobile comme sur desktop. »</blockquote>
      <p class="result-box__by">— <b>L'équipe TalentDigital</b></p>
    </div>
    <div>
      <div class="result-box__delta">90+</div>
      <div class="result-box__lbl">score PageSpeed mobile garanti à la livraison</div>
    </div>
  </div>
```

- [ ] **Step 4: Remove the fabricated count from the final CTA**

Find (line 156):

```astro
      <span><b>75+</b> sites livrés dans 15+ secteurs</span>
```

Replace with:

```astro
      <span><b>Audit gratuit</b> · plan d'action sous 48 h</span>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "Rachid O\.\|75+\|Résultat moyen" src/pages/creations/site-web.astro`
Expected: `0`

- [ ] **Step 6: Commit**

```bash
git add src/pages/creations/site-web.astro
git commit -m "fix: remove fabricated stats and fake testimonial from site-web page"
```

---

### Task 7: New `/a-propos` page (`src/pages/a-propos.astro`)

**Files:**
- Create: `src/pages/a-propos.astro`

**Interfaces:**
- Consumes: `BaseLayout` from `../layouts/BaseLayout.astro` (props: `title`, `description`), and the global classes already defined in `src/styles/global.css`: `.wrap`, `.prompt`, `.lede`, `.btn`/`.btn--ghost`, `.page-hero`/`.page-hero__sub`, `.section`/`.section__head`, `h2`, `.process-grid`/`.ps`/`.ps__no`/`.ps__tag`/`.ps__tag--free`, `.final`/`.final__box`/`.eyebrow`/`.final__proof`/`.final__cta`, `.reveal`.
- Produces: the page at route `/a-propos` (already linked from `Header.astro`'s nav, currently 404s).

- [ ] **Step 1: Create the page**

Create `src/pages/a-propos.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="À propos — TalentDigital" description="TalentDigital est un studio indépendant spécialisé en infrastructure de conversion numérique : tunnels de vente, landing pages et sites web pour entrepreneurs, professionnels et commerces.">

<section class="page-hero wrap">
  <span class="prompt">À propos — <b>TalentDigital.net</b></span>
  <h1 class="reveal">Pas un prestataire.<br>Un <em>partenaire</em> de croissance.</h1>
  <p class="page-hero__sub reveal">TalentDigital est un studio spécialisé en infrastructure de conversion numérique. Nous construisons des systèmes — tunnels de vente, landing pages, sites web — qui transforment le trafic en chiffre d'affaires réel, mesurable, scalable.</p>
  <div class="apropos-cta reveal">
    <a href="/contact" class="btn">Démarrer un projet <span class="arr">→</span></a>
    <a href="/creations" class="btn btn--ghost">Voir nos créations</a>
  </div>
</section>

<div class="tools" role="marquee" aria-label="Domaines d'expertise">
  <p class="tools__lbl">Expertises</p>
  <div class="marquee">
    <div class="marquee__track" aria-hidden="true">
      <span>Tunnels de vente</span>
      <span>Landing Pages</span>
      <span>Email Marketing</span>
      <span>Branding Digital</span>
      <span>Automatisation</span>
      <span>Copywriting</span>
      <span>Optimisation CRO</span>
      <span>Tunnels de vente</span>
      <span>Landing Pages</span>
      <span>Email Marketing</span>
      <span>Branding Digital</span>
      <span>Automatisation</span>
      <span>Copywriting</span>
      <span>Optimisation CRO</span>
    </div>
  </div>
</div>

<section class="manifesto section wrap">
  <div class="manifesto__grid">
    <div class="reveal">
      <span class="prompt"><b>Notre philosophie</b></span>
      <blockquote class="manifesto__quote">« Nous ne fabriquons pas de <em>beaux sites.</em> Nous construisons des machines à convertir. »</blockquote>
    </div>
    <div class="reveal" style="transition-delay:.15s">
      <p class="manifesto__body">La plupart des agences web vendent de l'esthétique. Nous, on vend de la performance. Chaque pixel, chaque ligne de copy, chaque séquence email a un objectif unique : transformer votre visiteur en client payant.</p>
      <p class="manifesto__body" style="margin-top:1.2rem">C'est pourquoi chaque projet commence par un audit stratégique, pas par une maquette. On comprend votre cible, votre offre et vos frictions de conversion — avant de toucher à quoi que ce soit.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>nos valeurs</b></span>
    <h2>Ce qui guide <em>chaque décision.</em></h2>
  </div>
  <div class="values__grid">
    <article class="value-card reveal">
      <div class="value-card__no">01</div>
      <h3>Résultats avant tout</h3>
      <p>Aucun livrable ne quitte notre studio sans objectif de conversion clairement défini. Joli sans performant, ce n'est pas notre produit.</p>
    </article>
    <article class="value-card reveal" style="transition-delay:.1s">
      <div class="value-card__no">02</div>
      <h3>Livraison express</h3>
      <p>7 jours, pas 7 semaines. La vitesse est une fonctionnalité. Un tunnel en ligne ce mois-ci génère des revenus ce mois-ci.</p>
    </article>
    <article class="value-card reveal" style="transition-delay:.2s">
      <div class="value-card__no">03</div>
      <h3>Transparence totale</h3>
      <p>Devis clair, délais tenus, reporting honnête. Vous savez exactement ce qui se passe, pourquoi, et ce que ça rapporte.</p>
    </article>
    <article class="value-card reveal" style="transition-delay:.3s">
      <div class="value-card__no">04</div>
      <h3>Optimisation continue</h3>
      <p>Un lancement n'est pas une fin. Chaque projet inclut un plan d'optimisation post-live basé sur les données réelles de comportement.</p>
    </article>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">02 — <b>notre processus</b></span>
    <h2>De zéro à live en <em>7 jours.</em></h2>
    <p class="lede" style="margin-top:1rem">Un processus clair, sans surprise ni délai flottant.</p>
  </div>
  <div class="process-grid">
    <div class="ps reveal">
      <span class="ps__no">01</span>
      <h4>Audit stratégique</h4>
      <p>30 minutes ensemble pour comprendre votre offre, votre cible et vos frictions de conversion actuelles.</p>
      <span class="ps__tag ps__tag--free">Gratuit</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">02</span>
      <h4>Plan d'action</h4>
      <p>Livraison d'un plan personnalisé sous 48 h : structure du tunnel, angles de copy, séquences, outils recommandés.</p>
      <span class="ps__tag">48 h</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">03</span>
      <h4>Implémentation</h4>
      <p>Conception, développement, intégration et tests. Vous êtes informé à chaque étape. Livraison en 7 jours.</p>
      <span class="ps__tag">7 jours</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">04</span>
      <h4>Optimisation continue</h4>
      <p>Analyse des données post-lancement, ajustements basés sur le comportement réel, amélioration du taux de conversion.</p>
      <span class="ps__tag">Optionnel</span>
    </div>
  </div>
</section>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Construisons votre <em>infrastructure de conversion.</em></h2>
    <div class="final__proof">
      <span><b>Audit gratuit</b> · 30 min</span>
      <span><b>Plan d'action</b> sous 48 h</span>
      <span><b>Livraison</b> en 7 jours</span>
      <span>Sans engagement</span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Demander mon audit gratuit <span class="arr">→</span></a>
      <a href="/creations" class="btn btn--ghost">Voir les créations</a>
    </div>
  </div>
</section>

</BaseLayout>

<style>
  .apropos-cta{margin-top:1.8rem;display:flex;flex-wrap:wrap;gap:1rem}

  .tools{border-block:1px solid var(--line);background:var(--panel);overflow:hidden}
  .tools__lbl{font-family:var(--mono);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);padding:.9rem var(--pad) 0}
  .marquee{display:flex;white-space:nowrap;padding:.7rem 0 1rem;overflow:hidden}
  .marquee__track{display:flex;align-items:center;gap:2.6rem;padding-right:2.6rem;animation:apropos-scroll 30s linear infinite}
  .marquee:hover .marquee__track{animation-play-state:paused}
  .marquee__track span{font-family:var(--display);font-weight:700;font-size:clamp(1.1rem,2vw,1.5rem);color:var(--txt);display:inline-flex;align-items:center;gap:2.6rem;text-transform:uppercase;letter-spacing:.02em}
  .marquee__track span::after{content:"//";color:var(--lime);font-family:var(--mono);font-size:.6em;font-weight:700}
  @keyframes apropos-scroll{to{transform:translateX(-50%)}}

  .manifesto{padding-block:var(--section);border-bottom:1px solid var(--line)}
  .manifesto__quote{font-size:clamp(1.5rem,3.5vw,2.7rem);font-weight:800;line-height:1.18;letter-spacing:-.025em;max-width:22ch}
  .manifesto__quote em{font-style:normal;color:var(--lime)}
  .manifesto__body{max-width:44ch;color:var(--muted);font-size:clamp(1rem,1.3vw,1.1rem);line-height:1.7;border-left:2px solid var(--lime);padding-left:1.4rem}
  .manifesto__grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,6rem);align-items:start}
  @media(max-width:768px){.manifesto__grid{grid-template-columns:1fr;gap:2.4rem}}

  .values__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-top:clamp(2rem,4vw,3rem)}
  .value-card{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:1.8rem 1.5rem;transition:.3s var(--ease)}
  .value-card:hover{border-color:var(--lime);transform:translateY(-4px);box-shadow:0 0 0 1px rgba(199,247,62,.2),0 26px 50px -30px rgba(0,0,0,.8)}
  .value-card__no{font-family:var(--mono);font-size:.7rem;color:var(--lime);letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem}
  .value-card h3{font-size:1.2rem;font-weight:800;letter-spacing:-.015em;margin-bottom:.6rem}
  .value-card p{font-size:.88rem;color:var(--muted);line-height:1.55}
  @media(max-width:880px){.values__grid{grid-template-columns:1fr 1fr}}
  @media(max-width:480px){.values__grid{grid-template-columns:1fr}}
</style>

<script>
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if(reduce || !("IntersectionObserver" in window)){
    reveals.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var sibs = Array.prototype.slice.call(e.target.parentNode.querySelectorAll(":scope > .reveal"));
          var i = sibs.indexOf(e.target);
          var delay = Math.min(i,5)*70;
          e.target.style.transitionDelay = delay + "ms";
          e.target.classList.add("in");
          io.unobserve(e.target);
          (function(el,d){ setTimeout(function(){ el.style.transitionDelay = ""; }, d + 750); })(e.target, delay);
        }
      });
    }, {threshold:.16, rootMargin:"0px 0px -8% 0px"});
    reveals.forEach(function(el){ io.observe(el); });
  }
})();
</script>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes, `dist/a-propos/index.html` is generated.

- [ ] **Step 3: Manually verify in the browser**

Start the preview server and check:
- `/a-propos` renders (no more 404), with the shared `Header`/`Footer`.
- Hero, expertise marquee (scrolling, no "Systeme.io"), manifesto, 4 value cards, 4 process steps, and final CTA all display.
- No team section, no testimonials section, no stats/timeline section, no fabricated numbers anywhere on the page.
- Nav's "À propos" link shows the active state on this page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/a-propos.astro
git commit -m "feat: add /a-propos page with no fabricated stats, team, or testimonials"
```

---

### Task 8: Update the root reference file (`a-propos.html`)

**Files:**
- Modify: `a-propos.html`

**Interfaces:**
- None — static reference document, not linked from the Astro build. Follows the exact pattern already established by `home-page.html`, `services.html`, `service-saas.html`, and `contact.html` (self-contained `<style>` block with the shared CSS tokens, plain-markup nav with a **text logo**, links to `/`, `/creations`, `/a-propos`, `/contact`, plain footer, **no `<script>` tag**, no working interactivity).

- [ ] **Step 1: Rewrite the file**

Overwrite `a-propos.html` as a standalone HTML5 document following `service-saas.html`'s established pattern (self-contained `<style>` with the shared CSS tokens, text-logo nav, plain footer, no `<script>` tag), with `<title>À propos — TalentDigital.net</title>`, porting the final content of `src/pages/a-propos.astro` from Task 7 verbatim (hero, expertise marquee, manifesto, 4 value cards, 4 process steps, final CTA) — no team section, no testimonials, no stats/timeline, no fabricated numbers, no "Systeme.io" mention.

- [ ] **Step 2: Commit**

```bash
git add a-propos.html
git commit -m "docs: rebuild a-propos.html reference copy without fabricated content"
```

---

### Task 9: Push to GitHub

**Files:** none (verification only)

- [ ] **Step 1: Verify the full build still passes**

Run: `npm run build`
Expected: build succeeds, all pages generated including `/a-propos`.

- [ ] **Step 2: Verify no fabricated content remains anywhere in `src/pages`**

Run: `grep -rn "120+\|98+\|75+\|4\.8★\|Sofia M\.\|Karim B\.\|Émilie D\.\|Nadia M\.\|Rachid O\.\|Systeme\.io" src/pages`
Expected: no output (empty).

- [ ] **Step 3: Push**

```bash
git push origin main
```

Expected: push succeeds, no conflicts.
