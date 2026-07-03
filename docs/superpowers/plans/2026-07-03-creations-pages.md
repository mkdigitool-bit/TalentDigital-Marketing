# Créations Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/creations` overview page and its 4 detail pages (`tunnel`, `landing-page`, `site-web`, `saas`), already linked from the Header's dropdown but not yet implemented.

**Architecture:** 6 new files: 5 pages under `src/pages/creations/` plus one CSS addition to `src/styles/global.css` holding the classes shared by all 5 pages (hero-with-stats, deliverables grid, audience cards, 4-step process, result box, overview card grid). Each page is a thin `BaseLayout` consumer with its own content and a small page-scoped `<script>` for the scroll-reveal animation (the same pattern already used by `src/pages/index.astro`).

**Tech Stack:** Astro, plain CSS (no preprocessor), vanilla JS.

## Global Constraints

- Routes: `/creations` (overview), `/creations/tunnel`, `/creations/landing-page`, `/creations/site-web`, `/creations/saas`.
- Tunnel, Landing page, Site web: content ported verbatim from `service-tunnels.html`, `service-landing-pages.html`, `service-sites-web.html` respectively — only internal links change (absolute `https://www.talentdigital.net/...` → root-relative `/contact`, `/creations`), and the duplicated nav/footer/logo markup is dropped (handled by `Header`/`Footer`).
- SaaS: no existing content. Written fresh, same structural pattern as the other 3. No fabricated named client testimonials or invented performance metrics — the "résultats" section states TalentDigital's own commitment (code ownership, scoped delivery) rather than a fake case study.
- Overview page: 4-card grid (`.svc-grid`/`.svc-card`, ported from `services.html`, reduced from 6 services to these 4), same numbering/order as the homepage's Services section: Tunnel=01, Landing page=02, Site web=03, SaaS=04.
- Shared CSS classes (`.svc-hero*`, `.stats-panel*`, `.deliver-grid*`, `.who-grid*`, `.process-grid`/`.ps*`, `.result-box*`, `.page-hero*`, `.svc-grid`/`.svc-card*`, `.process-strip*`) live in `global.css`, not duplicated per page. The overview page's compact process-strip uses its own `.pstrip*` class names (not `.ps`) to avoid colliding with the 4-column `.ps` used by the detail pages' process section — these are two different visual components that happened to share a name in the legacy files.
- No unit test framework in this project — verification is `npm run build` succeeding plus a manual check in the dev server, consistent with prior plans.

---

### Task 1: Shared service-page CSS in global.css

**Files:**
- Modify: `src/styles/global.css` (append; do not touch existing rules)

**Interfaces:**
- Produces: CSS classes consumed by every task in this plan (`.svc-hero*`, `.stats-panel*`, `.deliver-grid*`, `.who-grid*`, `.process-grid`, `.ps*`, `.result-box*`, `.page-hero*`, `.svc-grid`, `.svc-card*`, `.process-strip*`, `.pstrip*`).

- [ ] **Step 1: Append the shared classes**

Add this block to the end of `src/styles/global.css`:

```css
/* ── creation/service pages ── */
.svc-hero{padding-top:clamp(3rem,7vw,5rem);padding-bottom:var(--section)}
.svc-hero__back{font-family:var(--mono);font-size:.74rem;color:var(--muted);letter-spacing:.06em;display:inline-flex;align-items:center;gap:.5rem;margin-bottom:1.6rem;transition:color .2s}
.svc-hero__back:hover{color:var(--lime)}
.svc-hero__back::before{content:"←";color:var(--lime)}
.svc-hero__grid{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(2rem,5vw,4rem);align-items:start;margin-top:2rem}
.svc-hero__icon{font-family:var(--mono);font-size:2.4rem;color:var(--lime);border:1px solid var(--line-2);width:64px;height:64px;display:grid;place-items:center;border-radius:8px;margin-bottom:1.2rem}
.svc-hero h1{font-size:clamp(2.2rem,5vw,4.2rem);font-weight:900;text-transform:uppercase;letter-spacing:-.03em;line-height:1.0;margin-top:.5rem}
.svc-hero h1 em{font-style:normal;color:var(--lime)}
.svc-hero__sub{margin-top:1.4rem;color:var(--muted);font-size:clamp(1rem,1.4vw,1.12rem);max-width:44ch;line-height:1.65}
.svc-hero__cta{margin-top:2rem;display:flex;flex-wrap:wrap;gap:1rem 1.4rem;align-items:center}
.svc-hero__micro{font-family:var(--mono);font-size:.76rem;color:var(--muted)}
.svc-hero__micro b{color:var(--lime)}

.stats-panel{background:var(--panel);border:1px solid var(--line);border-radius:6px;overflow:hidden}
.stat-row{padding:1.2rem 1.4rem;border-bottom:1px dashed var(--line);display:flex;justify-content:space-between;align-items:baseline}
.stat-row:last-child{border-bottom:0}
.stat-row__lbl{font-family:var(--mono);font-size:.72rem;color:var(--muted);letter-spacing:.02em}
.stat-row__val{font-family:var(--display);font-weight:900;font-size:clamp(1.5rem,2.5vw,2rem);color:var(--txt);line-height:1}
.stat-row__val .u{font-family:var(--mono);font-size:.5em;color:var(--lime);font-weight:700;vertical-align:super}

.deliver-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.deliver-item{background:var(--panel);padding:1.6rem 1.8rem;transition:.3s var(--ease)}
.deliver-item:hover{background:var(--panel-2)}
.deliver-item__no{font-family:var(--mono);font-size:.68rem;color:var(--lime);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.7rem}
.deliver-item h4{font-size:1.1rem;font-weight:800;letter-spacing:-.015em;margin-bottom:.5rem;color:var(--txt)}
.deliver-item p{font-size:.9rem;color:var(--muted);line-height:1.55}

.who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
.who-card{border:1px solid var(--line);border-radius:6px;padding:1.5rem;transition:.3s var(--ease)}
.who-card:hover{border-color:var(--lime);background:var(--panel)}
.who-card__tag{font-family:var(--mono);font-size:.7rem;color:var(--lime);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.7rem}
.who-card h3{font-size:1.15rem;font-weight:800;letter-spacing:-.015em;margin-bottom:.5rem}
.who-card p{font-size:.9rem;color:var(--muted);line-height:1.55}

.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.ps{border-top:2px solid var(--line-2);padding:1.4rem 1.4rem 1.4rem 0;position:relative;transition:border-color .3s}
.process-grid .ps{border-right:1px solid var(--line);padding-inline:1.4rem}
.process-grid .ps:first-child{padding-left:0}
.process-grid .ps:last-child{border-right:0}
.ps:hover{border-top-color:var(--lime)}
.ps__no{font-family:var(--mono);font-size:.8rem;color:var(--lime);letter-spacing:.06em;font-weight:700}
.ps h4{font-size:1.2rem;margin:.7rem 0 .4rem;font-weight:800;letter-spacing:-.015em}
.ps p{font-size:.88rem;color:var(--muted)}
.ps__tag{display:inline-block;font-family:var(--mono);font-size:.68rem;letter-spacing:.04em;text-transform:uppercase;border:1px solid var(--line-2);color:var(--txt);padding:.3rem .6rem;border-radius:100px;margin-top:.8rem}
.ps__tag--free{border-color:var(--lime);color:var(--lime)}

.result-box{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:clamp(2rem,4vw,3rem);display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center}
.result-box__quote{font-size:clamp(1.1rem,2vw,1.4rem);font-weight:600;line-height:1.5;border-left:2px solid var(--lime);padding-left:1.2rem}
.result-box__delta{font-family:var(--display);font-weight:900;font-size:clamp(3rem,6vw,5rem);color:var(--lime);line-height:1;letter-spacing:-.04em}
.result-box__lbl{font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.4rem;letter-spacing:.02em}
.result-box__by{font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:1rem}
.result-box__by b{color:var(--txt)}

.page-hero{padding-top:clamp(3rem,6vw,5rem);padding-bottom:clamp(3rem,6vw,5rem);border-bottom:1px solid var(--line)}
.page-hero__grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4rem);align-items:center;margin-top:1.8rem}
.page-hero h1{font-size:clamp(2rem,4.5vw,3.8rem);font-weight:900;text-transform:uppercase;letter-spacing:-.03em;line-height:1.0}
.page-hero h1 em{font-style:normal;color:var(--lime)}
.page-hero__sub{color:var(--muted);font-size:clamp(1rem,1.3vw,1.12rem);max-width:44ch;margin-top:1.2rem}
.page-hero__stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:6px;overflow:hidden}
.stat{background:var(--panel);padding:1.4rem 1.2rem}
.stat__val{font-family:var(--display);font-weight:900;font-size:clamp(1.8rem,3vw,2.6rem);color:var(--lime);line-height:1;letter-spacing:-.03em}
.stat__lbl{font-family:var(--mono);font-size:.72rem;color:var(--muted);letter-spacing:.04em;text-transform:uppercase;margin-top:.4rem}

.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.4rem}
.svc-card{background:var(--panel);border:1px solid var(--line);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;transition:border-color .3s,transform .3s var(--ease),box-shadow .3s}
.svc-card:hover{border-color:var(--lime);transform:translateY(-4px);box-shadow:0 0 0 1px rgba(199,247,62,.2),0 28px 55px -30px rgba(0,0,0,.8)}
.svc-card__top{padding:clamp(1.6rem,2.5vw,2.2rem);flex:1}
.svc-card__no{font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--lime)}
.svc-card__icon{font-family:var(--mono);font-size:1.1rem;font-weight:700;color:var(--lime);border:1px solid var(--line-2);width:42px;height:42px;display:grid;place-items:center;border-radius:6px;margin:1rem 0 .8rem}
.svc-card h3{font-size:clamp(1.3rem,2vw,1.7rem);font-weight:800;letter-spacing:-.02em;color:var(--txt);margin-bottom:.6rem}
.svc-card__desc{font-size:.95rem;color:var(--muted);max-width:42ch;line-height:1.55}
.svc-card__list{list-style:none;margin-top:1.4rem;border-top:1px solid var(--line)}
.svc-card__list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--line);font-size:.88rem;color:var(--txt)}
.svc-card__list li::before{content:"+";color:var(--lime);font-family:var(--mono);font-weight:700;flex:none;margin-top:.05em}
.svc-card__bottom{padding:1.2rem clamp(1.6rem,2.5vw,2.2rem);border-top:1px solid var(--line);background:var(--panel-2);display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.svc-card__meta{display:flex;flex-direction:column;gap:.25rem}
.svc-card__time{font-family:var(--mono);font-size:.72rem;color:var(--lime);letter-spacing:.04em;text-transform:uppercase}
.svc-card__result{font-family:var(--mono);font-size:.7rem;color:var(--muted);letter-spacing:.02em}

.process-strip{background:linear-gradient(rgba(14,14,16,.91),rgba(14,14,16,.91)),url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1920&q=80&fit=crop') center/cover no-repeat;border-block:1px solid rgba(199,247,62,.1);padding:clamp(2.5rem,5vw,4rem) 0}
.process-strip__inner{display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap}
.process-strip__txt h2{font-size:clamp(1.5rem,2.8vw,2.2rem)}
.process-strip__txt p{color:var(--muted);font-size:.95rem;max-width:40ch;margin-top:.6rem}
.process-steps{display:flex;gap:0;flex:1;min-width:300px}
.pstrip{flex:1;border-left:2px solid var(--line-2);padding:.8rem 1.2rem;transition:border-color .3s}
.pstrip:hover{border-left-color:var(--lime)}
.pstrip__no{font-family:var(--mono);font-size:.68rem;color:var(--lime);font-weight:700;letter-spacing:.06em}
.pstrip h4{font-size:.95rem;font-weight:700;margin:.4rem 0 .2rem;letter-spacing:-.01em}
.pstrip p{font-size:.8rem;color:var(--muted)}

@media (max-width:880px){
  .svc-hero__grid{grid-template-columns:1fr}
  .deliver-grid{grid-template-columns:1fr}
  .who-grid{grid-template-columns:1fr}
  .process-grid{grid-template-columns:1fr 1fr}
  .result-box{grid-template-columns:1fr}
  .page-hero__grid{grid-template-columns:1fr}
  .page-hero__stats{grid-template-columns:repeat(3,1fr)}
  .svc-grid{grid-template-columns:1fr}
  .process-strip__inner{flex-direction:column}
  .process-steps{width:100%}
}
@media (max-width:520px){
  .process-grid{grid-template-columns:1fr}
  .page-hero__stats{grid-template-columns:1fr}
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: exit code 0. (Nothing consumes these classes yet — this only confirms no CSS syntax errors.)

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add shared CSS for creation/service pages"
```

---

### Task 2: /creations/tunnel

**Files:**
- Create: `src/pages/creations/tunnel.astro`

**Interfaces:**
- Consumes: `BaseLayout` from `../../layouts/BaseLayout.astro`; classes from Task 1 (`.svc-hero*`, `.stats-panel*`, `.deliver-grid*`, `.who-grid*`, `.process-grid`/`.ps*`, `.result-box*`, plus `.section`, `.section__head`, `.prompt`, `.lede`, `.btn*`, `.reveal` already in `global.css`).

- [ ] **Step 1: Create the page**

Create `src/pages/creations/tunnel.astro` with this content — it ports `service-tunnels.html:159-317` (everything between `<section class="svc-hero wrap">` and the closing `</section>` of the final CTA) verbatim, with these exact changes: wrap in `<BaseLayout title="Tunnels de vente — TalentDigital" description="Tunnel de vente complet : page de capture, VSL, bon de commande, upsells et séquence email. Livraison en 7 jours.">`; `href="https://www.talentdigital.net/services"` → `href="/creations"`; `href="https://www.talentdigital.net/contact"` → `href="/contact"`; the prompt in the hero changes from `01 / prestation — <b>Tunnels de vente</b>` to `<b>01 / prestation — Tunnels de vente</b>` is unchanged (already correct); drop the `<div class="td-root">`, `<header>`/`<nav>`, and `<footer>` wrapper markup entirely (handled by `Header`/`Footer` inside `BaseLayout`).

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="Tunnels de vente — TalentDigital" description="Tunnel de vente complet : page de capture, VSL, bon de commande, upsells et séquence email. Livraison en 7 jours.">

<section class="svc-hero wrap">
  <a href="/creations" class="svc-hero__back">Retour aux créations</a>
  <span class="prompt">01 / prestation — <b>Tunnels de vente</b></span>
  <div class="svc-hero__grid">
    <div>
      <div class="svc-hero__icon" aria-hidden="true">◎</div>
      <h1 class="reveal">Tunnels de <em>vente</em></h1>
      <p class="svc-hero__sub reveal">Du premier clic au paiement — un parcours automatisé, structuré pour faire monter chaque commande et vendre à votre place, 24h/24.</p>
      <div class="svc-hero__cta reveal">
        <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <span class="svc-hero__micro"><b>Livraison 7 jours</b> · Audit gratuit inclus</span>
      </div>
    </div>
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
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>livrables</b></span>
    <h2>Ce que vous <em>recevez</em></h2>
    <p class="lede" style="margin-top:1rem">Chaque tunnel est livré clé en main, testé et prêt à recevoir du trafic. Voici précisément ce qui est inclus.</p>
  </div>
  <div class="deliver-grid">
    <div class="deliver-item reveal">
      <div class="deliver-item__no">01 / livrable</div>
      <h4>Page de capture opt-in</h4>
      <p>Une page d'entrée optimisée pour collecter les emails de vos prospects. Headline percutante, formulaire épuré, preuve sociale intégrée. Taux de conversion cible : 30 à 50 %.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">02 / livrable</div>
      <h4>Page de vente VSL</h4>
      <p>Une page de vente longue conçue pour accueillir votre vidéo de vente (VSL). Structure AIDA, blocs de bénéfices, objections traitées, boutons CTA stratégiquement placés.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">03 / livrable</div>
      <h4>Bon de commande + order bumps</h4>
      <p>Un bon de commande friction-less avec intégration paiement (Stripe, PayPal) et au moins un order bump configuré pour augmenter la valeur moyenne de commande de 15 à 30 %.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">04 / livrable</div>
      <h4>Upsells &amp; downsells post-achat</h4>
      <p>Deux à trois offres complémentaires présentées immédiatement après l'achat, quand le client est en mode « achat ». Chaque page est optimisée pour maximiser la valeur vie client.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">05 / livrable</div>
      <h4>Séquence email relance</h4>
      <p>3 emails de relance panier abandonné + 5 emails de nurturing post-opt-in. Chaque email a un objectif précis : récupérer les prospects froids et les convertir en acheteurs.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">06 / livrable</div>
      <h4>Tracking complet</h4>
      <p>Configuration de tous les événements de conversion (Meta Pixel, Google Analytics, Systeme.io). Vous voyez exactement d'où viennent vos clients et quel levier génère le plus de revenus.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">02 — <b>pour qui</b></span>
    <h2>Conçu pour ceux qui ont une <em>offre à vendre</em></h2>
  </div>
  <div class="who-grid">
    <div class="who-card reveal">
      <div class="who-card__tag">formateurs &amp; infopreneurs</div>
      <h3>Vous avez une formation à vendre</h3>
      <p>Vous avez créé votre formation mais vos ventes stagnent. Un tunnel bien construit automatise la vente et vous libère du démarchage manuel. Résultat : des ventes pendant que vous dormez.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">coachs &amp; consultants</div>
      <h3>Votre offre premium mérite un système</h3>
      <p>Votre accompagnement à 1 000 € ou plus ne peut pas reposer sur le bouche-à-oreille. Un tunnel de qualification filtre vos prospects et remplit votre agenda d'appels stratégiques.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">e-commerçants</div>
      <h3>Vous voulez multiplier votre panier</h3>
      <p>Order bumps, upsells et séquences de relance transforment chaque commande simple en panier renforcé. Résultat moyen constaté : ×3 sur la valeur moyenne par transaction.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">03 — <b>processus</b></span>
    <h2>De l'audit à la <em>mise en ligne</em></h2>
  </div>
  <div class="process-grid">
    <div class="ps reveal">
      <span class="ps__no">01</span>
      <h4>Audit stratégique</h4>
      <p>On analyse votre offre, votre cible et vos frictions actuelles. On identifie les opportunités de revenus manquées dans votre parcours client.</p>
      <span class="ps__tag ps__tag--free">Gratuit · 30 min</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">02</span>
      <h4>Architecture du tunnel</h4>
      <p>On conçoit le plan complet : pages, séquences email, order bumps, upsells. Chaque élément est justifié par des données, pas par l'intuition.</p>
      <span class="ps__tag">Sous 48 h</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">03</span>
      <h4>Build &amp; intégration</h4>
      <p>On construit, on connecte les outils (Systeme.io, Stripe, email) et on teste chaque étape du parcours avant livraison. Zéro bug au lancement.</p>
      <span class="ps__tag">7 jours ouvrés</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">04</span>
      <h4>Optimisation continue</h4>
      <p>Après lancement, on suit les chiffres et on ajuste les pages, les emails et les offres pour améliorer le taux de conversion mois après mois.</p>
      <span class="ps__tag">En option</span>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>résultats</b></span>
    <h2>Des chiffres, pas des <em>promesses</em></h2>
  </div>
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
</section>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Votre tunnel est à <em>7 jours</em> d'ici.</h2>
    <div class="final__proof">
      <span><b>120+</b> tunnels livrés dans 12+ pays</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Livraison garantie en <b>7 jours ouvrés</b></span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="/creations" class="btn btn--ghost">Voir toutes les créations</a>
    </div>
  </div>
</section>

</BaseLayout>

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
Expected: exit code 0, `dist/creations/tunnel/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/creations/tunnel.astro
git commit -m "feat: add /creations/tunnel page"
```

---

### Task 3: /creations/landing-page

**Files:**
- Create: `src/pages/creations/landing-page.astro`

**Interfaces:**
- Consumes: same as Task 2.

- [ ] **Step 1: Create the page**

Create `src/pages/creations/landing-page.astro`, porting `service-landing-pages.html:159-317` with the same transformation rules as Task 2 (BaseLayout wrap with `title="Landing pages haute conversion — TalentDigital"` and `description="Landing pages haute conversion : copywriting AIDA, design mobile-first, tracking et A/B testing. Livraison en 3 à 5 jours."`; `/services` → `/creations`; `/contact` unchanged in target but absolute URL → root-relative `/contact`; nav/footer/wrapper dropped):

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="Landing pages haute conversion — TalentDigital" description="Landing pages haute conversion : copywriting AIDA, design mobile-first, tracking et A/B testing. Livraison en 3 à 5 jours.">

<section class="svc-hero wrap">
  <a href="/creations" class="svc-hero__back">Retour aux créations</a>
  <span class="prompt">02 / prestation — <b>Landing pages</b></span>
  <div class="svc-hero__grid">
    <div>
      <div class="svc-hero__icon" aria-hidden="true">▣</div>
      <h1 class="reveal">Landing <em>pages</em></h1>
      <p class="svc-hero__sub reveal">Une page. Un objectif. Un résultat. On conçoit des pages d'atterrissage qui convertissent le trafic en leads, abonnés et clients — avec un taux d'efficacité mesuré, pas supposé.</p>
      <div class="svc-hero__cta reveal">
        <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <span class="svc-hero__micro"><b>Livraison 3-5 jours</b> · Audit gratuit inclus</span>
      </div>
    </div>
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
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>livrables</b></span>
    <h2>Ce que vous <em>recevez</em></h2>
    <p class="lede" style="margin-top:1rem">Chaque page est construite sur une structure éprouvée, mobile-first, et optimisée pour l'objectif que vous avez défini ensemble.</p>
  </div>
  <div class="deliver-grid">
    <div class="deliver-item reveal">
      <div class="deliver-item__no">01 / livrable</div>
      <h4>Structure copywriting AIDA</h4>
      <p>Chaque section de la page suit une architecture narrative pensée pour guider le visiteur de l'attention à l'action. Headline, sous-titre, bénéfices, preuves, CTA — rien n'est laissé au hasard.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">02 / livrable</div>
      <h4>Design responsive mobile-first</h4>
      <p>La page est conçue en commençant par le mobile : 60 à 70 % de votre trafic vient du téléphone. La version desktop est ensuite adaptée, jamais l'inverse.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">03 / livrable</div>
      <h4>Optimisation vitesse (Core Web Vitals)</h4>
      <p>Images optimisées, code allégé, LCP sous 2.5s, score PageSpeed 90+ sur mobile. Une page lente est une page qui perd de l'argent. On livre rapide.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">04 / livrable</div>
      <h4>Intégration tracking &amp; analytics</h4>
      <p>Pixel Meta, Google Analytics 4, événement de conversion configurés. Vous savez d'où viennent vos leads, quel support génère le plus, et où optimiser la semaine suivante.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">05 / livrable</div>
      <h4>Formulaire + intégration CRM/email</h4>
      <p>Connexion au formulaire avec votre outil (Systeme.io, Mailchimp, ActiveCampaign, HubSpot). Chaque lead est automatiquement ajouté à votre liste et tagué selon la source.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">06 / livrable</div>
      <h4>A/B testing setup</h4>
      <p>Configuration d'un test A/B sur le headline ou le CTA principal. On identifie la version gagnante et on itère pour continuer à améliorer le taux de conversion au-delà du lancement.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">02 — <b>pour qui</b></span>
    <h2>Pour tous ceux qui <em>payent pour du trafic</em></h2>
  </div>
  <div class="who-grid">
    <div class="who-card reveal">
      <div class="who-card__tag">campagnes payantes</div>
      <h3>Vous lancez des publicités Meta ou Google</h3>
      <p>Votre budget publicitaire mérite une page dédiée par offre. Envoyer du trafic payant vers votre homepage est l'erreur la plus coûteuse du marketing digital. Une landing dédiée multiplie le ROI.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">lancement produit</div>
      <h3>Vous lancez un nouveau produit ou service</h3>
      <p>Pre-launch, waitlist, vente de lancement — chaque phase nécessite une page spécifique avec le bon message. On construit la séquence de pages qui maximise l'impact de chaque étape.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">génération de leads</div>
      <h3>Vous avez besoin de prospects qualifiés</h3>
      <p>Lead magnet, webinaire, consultation gratuite — une landing bien conçue filtre les curieux et attire les acheteurs potentiels. Résultat : des leads qui méritent votre temps commercial.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">03 — <b>processus</b></span>
    <h2>De l'objectif à la <em>mise en ligne</em></h2>
  </div>
  <div class="process-grid">
    <div class="ps reveal">
      <span class="ps__no">01</span>
      <h4>Brief stratégique</h4>
      <p>On définit l'objectif unique de la page, la cible précise et le message clé. Pas de page générique : chaque landing a un angle spécifique et un visiteur idéal clairement identifié.</p>
      <span class="ps__tag ps__tag--free">Gratuit · 20 min</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">02</span>
      <h4>Wireframe &amp; copywriting</h4>
      <p>Structure visuelle + rédaction de tous les textes. Chaque mot est validé avec vous avant de passer au design. On écrit pour convertir, pas pour impressionner.</p>
      <span class="ps__tag">Sous 24 h</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">03</span>
      <h4>Design &amp; développement</h4>
      <p>Intégration du design sur votre plateforme (Systeme.io, WordPress, Webflow). Optimisation performance, tracking, formulaire. La page est testée sur 6 écrans avant livraison.</p>
      <span class="ps__tag">3-5 jours ouvrés</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">04</span>
      <h4>Suivi &amp; itération</h4>
      <p>Après 2 semaines de trafic, on analyse les données et on identifie 2 à 3 changements à tester. L'optimisation continue garantit une progression du taux de conversion mois après mois.</p>
      <span class="ps__tag">En option</span>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>résultats</b></span>
    <h2>Des chiffres, pas des <em>promesses</em></h2>
  </div>
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
</section>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Votre landing page est à <em>5 jours</em> d'ici.</h2>
    <div class="final__proof">
      <span><b>98+</b> pages livrées dans 10+ secteurs</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Livraison garantie en <b>3-5 jours ouvrés</b></span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="/creations" class="btn btn--ghost">Voir toutes les créations</a>
    </div>
  </div>
</section>

</BaseLayout>

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
Expected: exit code 0, `dist/creations/landing-page/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/creations/landing-page.astro
git commit -m "feat: add /creations/landing-page page"
```

---

### Task 4: /creations/site-web

**Files:**
- Create: `src/pages/creations/site-web.astro`

**Interfaces:**
- Consumes: same as Task 2.

- [ ] **Step 1: Create the page**

Create `src/pages/creations/site-web.astro`, porting `service-sites-web.html:159-317` with the same transformation rules (BaseLayout wrap with `title="Sites web pro — TalentDigital"` and `description="Sites web professionnels : design sur mesure, SEO technique, performance PageSpeed 90+. Livraison en 10 à 14 jours."`; `/services` → `/creations`; absolute contact URL → `/contact`; nav/footer/wrapper dropped). Note the prompt number stays `06 / prestation` (unchanged from the source — it was never renumbered against the other services in the legacy site, and renumbering it isn't required by the spec):

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="Sites web pro — TalentDigital" description="Sites web professionnels : design sur mesure, SEO technique, performance PageSpeed 90+. Livraison en 10 à 14 jours.">

<section class="svc-hero wrap">
  <a href="/creations" class="svc-hero__back">Retour aux créations</a>
  <span class="prompt">03 / prestation — <b>Sites web pro</b></span>
  <div class="svc-hero__grid">
    <div>
      <div class="svc-hero__icon" aria-hidden="true">⬡</div>
      <h1 class="reveal">Sites web <em>pro</em></h1>
      <p class="svc-hero__sub reveal">Un site web professionnel n'est pas un coût, c'est un commercial disponible 24h/24. On conçoit des sites rapides, optimisés SEO et construits pour convertir les visiteurs en clients.</p>
      <div class="svc-hero__cta reveal">
        <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <span class="svc-hero__micro"><b>Livraison 10-14 jours</b> · Audit gratuit inclus</span>
      </div>
    </div>
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
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>livrables</b></span>
    <h2>Ce que vous <em>recevez</em></h2>
    <p class="lede" style="margin-top:1rem">Un site complet, livré clé en main, avec formation incluse pour que vous puissiez le gérer en totale autonomie après la livraison.</p>
  </div>
  <div class="deliver-grid">
    <div class="deliver-item reveal">
      <div class="deliver-item__no">01 / livrable</div>
      <h4>Design sur mesure (5-8 pages)</h4>
      <p>Home, À propos, Services, Blog, Contact — chaque page est designée selon votre charte graphique et optimisée pour guider le visiteur vers une action précise. Pas de templates génériques.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">02 / livrable</div>
      <h4>Développement responsive (mobile-first)</h4>
      <p>Code propre, structuré et léger. Le site est testé sur 8+ écrans (mobile, tablette, desktop) et sur 4 navigateurs avant livraison. Zero bug garanti à la mise en ligne.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">03 / livrable</div>
      <h4>SEO technique on-page</h4>
      <p>Balises title, meta descriptions, structure H1-H6, balisage schema.org, sitemap XML, robots.txt, Core Web Vitals optimisés. Votre site est indexable et compris par Google dès le lancement.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">04 / livrable</div>
      <h4>Performance : PageSpeed 90+ mobile</h4>
      <p>Images compressées au format WebP, code minifié, lazy loading, preload des ressources critiques. Résultat moyen : score PageSpeed 90+ sur mobile et 95+ sur desktop. Rapide partout.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">05 / livrable</div>
      <h4>Intégrations tierces</h4>
      <p>Google Analytics 4, Meta Pixel, formulaire de contact (avec Mailchimp/Brevo), Google Search Console configuré. Votre site collecte les données dès le premier visiteur.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">06 / livrable</div>
      <h4>Formation + documentation</h4>
      <p>Session de 1h pour apprendre à modifier les textes, ajouter des pages, mettre à jour le blog. Guide PDF de référence inclus. Vous êtes autonome à 100 % après la livraison.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">02 — <b>pour qui</b></span>
    <h2>Pour ceux qui ont besoin d'une <em>vitrine sérieuse</em></h2>
  </div>
  <div class="who-grid">
    <div class="who-card reveal">
      <div class="who-card__tag">indépendants &amp; freelances</div>
      <h3>Votre portfolio doit vendre, pas juste montrer</h3>
      <p>Un portfolio sans stratégie de conversion est une galerie. On conçoit un site qui présente votre travail, crédibilise votre expertise et pousse chaque visiteur à prendre contact ou à demander un devis.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">PME &amp; cabinets</div>
      <h3>Votre site actuel ne génère aucun lead</h3>
      <p>Un site qui existe sans conversion, c'est un coût invisible. On refond votre architecture, votre copywriting et votre design pour transformer votre trafic existant en demandes de contact qualifiées.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">nouvelles activités</div>
      <h3>Vous partez de zéro et voulez bien faire</h3>
      <p>Pas question de regretter votre premier site dans 18 mois. On le construit d'emblée avec les bonnes fondations : SEO, performance, structure évolutive. Coût bien inférieur à un refonte 2 ans plus tard.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">03 — <b>processus</b></span>
    <h2>Du brief à la <em>mise en ligne</em></h2>
  </div>
  <div class="process-grid">
    <div class="ps reveal">
      <span class="ps__no">01</span>
      <h4>Brief &amp; audit existant</h4>
      <p>On analyse l'existant (si vous avez déjà un site), vos concurrents, vos objectifs business. On définit ensemble l'architecture du site, les pages prioritaires et les objectifs de conversion par page.</p>
      <span class="ps__tag ps__tag--free">Gratuit · 30 min</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">02</span>
      <h4>Wireframe &amp; maquette</h4>
      <p>Structure des pages sous forme de wireframes, puis maquette haute-fidélité. Vous validez le design avant que la première ligne de code soit écrite. Les surprises à la livraison, ça n'existe pas.</p>
      <span class="ps__tag">Sous 3 jours</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">03</span>
      <h4>Développement &amp; tests</h4>
      <p>Intégration du design, développement des fonctionnalités, tests multi-écrans, optimisation performance. Vous recevez un lien de prévisualisation pour valider avant mise en ligne.</p>
      <span class="ps__tag">10-14 jours ouvrés</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">04</span>
      <h4>Mise en ligne + formation</h4>
      <p>Transfert du nom de domaine, configuration SSL, mise en ligne. Session de formation de 1h pour vous apprendre à mettre à jour votre site en autonomie complète. Garantie 30 jours incluse.</p>
      <span class="ps__tag">Inclus</span>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>résultats</b></span>
    <h2>Des chiffres, pas des <em>promesses</em></h2>
  </div>
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
</section>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Votre site web est en ligne <em>dans 14 jours</em>.</h2>
    <div class="final__proof">
      <span><b>75+</b> sites livrés dans 15+ secteurs</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Livraison garantie en <b>10-14 jours ouvrés</b></span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="/creations" class="btn btn--ghost">Voir toutes les créations</a>
    </div>
  </div>
</section>

</BaseLayout>

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
Expected: exit code 0, `dist/creations/site-web/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/creations/site-web.astro
git commit -m "feat: add /creations/site-web page"
```

---

### Task 5: /creations/saas

**Files:**
- Create: `src/pages/creations/saas.astro`

**Interfaces:**
- Consumes: same as Task 2.

- [ ] **Step 1: Create the page**

Create `src/pages/creations/saas.astro` — new content, no legacy source. Follows the exact same section structure as Tasks 2-4. The "résultats" section states TalentDigital's own delivery commitment rather than a fabricated client quote, per the Global Constraints:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="SaaS sur mesure — TalentDigital" description="Développement de logiciel sur mesure : cahier des charges, architecture, développement, tests et formation. Devis sous 48 h.">

<section class="svc-hero wrap">
  <a href="/creations" class="svc-hero__back">Retour aux créations</a>
  <span class="prompt">04 / prestation — <b>SaaS sur mesure</b></span>
  <div class="svc-hero__grid">
    <div>
      <div class="svc-hero__icon" aria-hidden="true">▣</div>
      <h1 class="reveal">SaaS sur <em>mesure</em></h1>
      <p class="svc-hero__sub reveal">Un logiciel métier n'est pas un site vitrine. On conçoit et développons l'outil qui automatise votre activité — pensé pour votre process, pas pour un template générique.</p>
      <div class="svc-hero__cta reveal">
        <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <span class="svc-hero__micro"><b>Devis sous 48 h</b> · Cahier des charges gratuit</span>
      </div>
    </div>
    <div class="stats-panel reveal" aria-label="Indicateurs clés">
      <div class="stat-row">
        <span class="stat-row__lbl">devis_sous</span>
        <span class="stat-row__val">48<span class="u">h</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">code_source_livré</span>
        <span class="stat-row__val">100<span class="u">%</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-row__lbl">garantie_post-livraison</span>
        <span class="stat-row__val">30<span class="u">j</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>livrables</b></span>
    <h2>Ce que vous <em>recevez</em></h2>
    <p class="lede" style="margin-top:1rem">Un logiciel scopé pour un objectif précis, livré avec le code source et la documentation pour que vous en soyez pleinement propriétaire.</p>
  </div>
  <div class="deliver-grid">
    <div class="deliver-item reveal">
      <div class="deliver-item__no">01 / livrable</div>
      <h4>Cahier des charges &amp; architecture</h4>
      <p>On formalise précisément ce que le logiciel doit faire, pour qui, et comment les données circulent. Cette étape évite les malentendus et les développements inutiles.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">02 / livrable</div>
      <h4>Design d'interface (UI/UX)</h4>
      <p>Maquettes des écrans clés, pensées pour la personne qui va réellement utiliser l'outil au quotidien — pas pour impressionner un jury.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">03 / livrable</div>
      <h4>Développement backend &amp; base de données</h4>
      <p>Logique métier, authentification, base de données structurée pour vos volumes réels. Architecture pensée pour évoluer sans tout reconstruire.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">04 / livrable</div>
      <h4>Interface utilisateur responsive</h4>
      <p>Utilisable sur ordinateur comme sur mobile, avec les mêmes fonctionnalités essentielles disponibles partout où votre équipe en a besoin.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">05 / livrable</div>
      <h4>Tests &amp; assurance qualité</h4>
      <p>Chaque fonctionnalité est testée avant livraison — scénarios normaux et cas limites — pour éviter les mauvaises surprises une fois l'outil en production.</p>
    </div>
    <div class="deliver-item reveal">
      <div class="deliver-item__no">06 / livrable</div>
      <h4>Documentation &amp; formation</h4>
      <p>Documentation technique du code et session de prise en main pour votre équipe. Vous n'êtes jamais bloqué par l'absence de la personne qui a développé l'outil.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">02 — <b>pour qui</b></span>
    <h2>Pour ceux qui ont besoin d'un <em>outil, pas d'un site</em></h2>
  </div>
  <div class="who-grid">
    <div class="who-card reveal">
      <div class="who-card__tag">entrepreneurs &amp; startups</div>
      <h3>Vous avez besoin d'un MVP pour valider une idée</h3>
      <p>Avant d'investir massivement, on construit la version minimale qui vous permet de tester votre marché avec de vrais utilisateurs, sans surinvestir dans des fonctionnalités inutiles.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">PME</div>
      <h3>Votre process tourne encore sur Excel ou un outil no-code limité</h3>
      <p>Quand un tableur ou un outil générique devient un goulot d'étranglement, un logiciel sur mesure élimine les manipulations manuelles et les erreurs de saisie.</p>
    </div>
    <div class="who-card reveal">
      <div class="who-card__tag">agences &amp; studios</div>
      <h3>Vous voulez déléguer le développement d'un outil client ou interne</h3>
      <p>Vous gardez la relation client, on prend en charge la partie technique — cahier des charges, développement, tests — avec un point d'avancement régulier.</p>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">03 — <b>processus</b></span>
    <h2>Du cahier des charges à la <em>mise en production</em></h2>
  </div>
  <div class="process-grid">
    <div class="ps reveal">
      <span class="ps__no">01</span>
      <h4>Cadrage &amp; cahier des charges</h4>
      <p>On clarifie l'objectif, les utilisateurs et les fonctionnalités indispensables. On sort de cet échange avec un périmètre écrit, pas une idée vague.</p>
      <span class="ps__tag ps__tag--free">Gratuit · 45 min</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">02</span>
      <h4>Architecture &amp; maquettes</h4>
      <p>On conçoit la structure technique et les écrans principaux. Vous validez la maquette avant que le développement ne démarre.</p>
      <span class="ps__tag">Sous 5 jours</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">03</span>
      <h4>Développement</h4>
      <p>Construction par lots livrables, avec des points d'étape réguliers pour ajuster si besoin plutôt que découvrir le résultat final à la toute fin.</p>
      <span class="ps__tag">Selon le périmètre</span>
    </div>
    <div class="ps reveal">
      <span class="ps__no">04</span>
      <h4>Tests, livraison &amp; formation</h4>
      <p>Tests complets, mise en production, transfert du code source et session de formation pour votre équipe.</p>
      <span class="ps__tag">Inclus</span>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">04 — <b>notre engagement</b></span>
    <h2>Un périmètre <em>clair</em>, pas des heures floues</h2>
  </div>
  <div class="result-box reveal">
    <div>
      <blockquote class="result-box__quote">« On ne vend pas des heures de développement, on vend un problème résolu. Le cahier des charges validé en amont est notre garantie qu'on construit exactement ce dont vous avez besoin — pas plus, pas moins. »</blockquote>
      <p class="result-box__by">— <b>L'équipe TalentDigital</b></p>
    </div>
    <div>
      <div class="result-box__delta">100%</div>
      <div class="result-box__lbl">du code source vous appartient, à la livraison</div>
    </div>
  </div>
</section>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Votre outil sur mesure démarre par un <em>cahier des charges</em>.</h2>
    <div class="final__proof">
      <span><b>Cahier des charges gratuit</b> · devis sous 48 h</span>
      <span>Code source livré · vous êtes propriétaire</span>
      <span>Architecture pensée pour évoluer</span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="/creations" class="btn btn--ghost">Voir toutes les créations</a>
    </div>
  </div>
</section>

</BaseLayout>

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
Expected: exit code 0, `dist/creations/saas/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/creations/saas.astro
git commit -m "feat: add /creations/saas page (first-draft content)"
```

---

### Task 6: /creations overview page

**Files:**
- Create: `src/pages/creations/index.astro`

**Interfaces:**
- Consumes: `BaseLayout`; `.page-hero*`, `.svc-grid`, `.svc-card*`, `.process-strip*`, `.pstrip*` from Task 1; links to the 4 pages created in Tasks 2-5.

- [ ] **Step 1: Create the page**

Create `src/pages/creations/index.astro` — adapts `services.html:202-398` (page hero, service grid, process strip, final CTA), reduced from 6 services to the 4 in scope, with cards linking to the new pages instead of `#anchor`s, and the process-strip's `.ps` renamed to `.pstrip` per the Global Constraints:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="Créations — TalentDigital" description="Tunnels de vente, landing pages haute conversion, sites web pro et SaaS sur mesure. Des systèmes digitaux conçus pour convertir, pas pour décorer.">

<section class="page-hero wrap">
  <span class="prompt">Créations — <b>TalentDigital.net</b></span>
  <div class="page-hero__grid">
    <div>
      <h1 class="reveal">Quatre systèmes.<br>Une obsession : <em>convertir</em>.</h1>
      <p class="page-hero__sub reveal">On ne vend pas des pages web. On construit des systèmes qui transforment votre trafic en chiffre d'affaires — du premier clic au paiement.</p>
    </div>
    <div class="page-hero__stats reveal">
      <div class="stat"><div class="stat__val">120+</div><div class="stat__lbl">Projets livrés</div></div>
      <div class="stat"><div class="stat__val">7j</div><div class="stat__lbl">Délai moyen</div></div>
      <div class="stat"><div class="stat__val">×3</div><div class="stat__lbl">Panier moyen</div></div>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section__head reveal">
    <span class="prompt">01 — <b>nos créations</b></span>
    <h2>Choisissez votre <em>infrastructure</em>.</h2>
    <p class="lede" style="margin-top:1rem">Chaque création est pensée pour s'intégrer aux autres. Combinées, elles forment un système complet de croissance digitale.</p>
  </div>
  <div class="svc-grid">
    <article class="svc-card reveal">
      <div class="svc-card__top">
        <span class="svc-card__no">01 / création</span>
        <div class="svc-card__icon">◎</div>
        <h3>Tunnels de vente</h3>
        <p class="svc-card__desc">Un parcours guidé du premier clic au paiement. Conçu pour faire monter chaque commande sans effort de votre part.</p>
        <ul class="svc-card__list">
          <li>Page de capture optimisée pour l'opt-in</li>
          <li>Page de vente prête pour la vidéo (VSL)</li>
          <li>Bon de commande + order bumps stratégiques</li>
          <li>Upsells &amp; downsells post-achat</li>
        </ul>
      </div>
      <div class="svc-card__bottom">
        <div class="svc-card__meta">
          <span class="svc-card__time">Livraison · 7 jours</span>
          <span class="svc-card__result">Résultat moyen : ×3 sur le panier</span>
        </div>
        <a href="/creations/tunnel" class="btn btn--sm">Découvrir <span class="arr">→</span></a>
      </div>
    </article>
    <article class="svc-card reveal">
      <div class="svc-card__top">
        <span class="svc-card__no">02 / création</span>
        <div class="svc-card__icon">▣</div>
        <h3>Landing pages haute conversion</h3>
        <p class="svc-card__desc">Une page, un objectif, zéro distraction. Structurée pour le clic suivant, écrite pour parler à votre client.</p>
        <ul class="svc-card__list">
          <li>Copywriting orienté bénéfice (structure AIDA)</li>
          <li>Design responsive, chargement sous 2 secondes</li>
          <li>Intégration formulaire &amp; paiement</li>
          <li>Variante A/B pour trancher sur les chiffres</li>
        </ul>
      </div>
      <div class="svc-card__bottom">
        <div class="svc-card__meta">
          <span class="svc-card__time">Livraison · 3 à 5 jours</span>
          <span class="svc-card__result">Résultat moyen : +180% de conversion</span>
        </div>
        <a href="/creations/landing-page" class="btn btn--sm">Découvrir <span class="arr">→</span></a>
      </div>
    </article>
    <article class="svc-card reveal">
      <div class="svc-card__top">
        <span class="svc-card__no">03 / création</span>
        <div class="svc-card__icon">⬡</div>
        <h3>Sites web pro</h3>
        <p class="svc-card__desc">Une vitrine rapide, propre et prête pour le référencement. Construite pour convertir le visiteur en prospect dès la page d'accueil.</p>
        <ul class="svc-card__list">
          <li>Design sur mesure responsive (mobile-first)</li>
          <li>Optimisation SEO technique (Core Web Vitals)</li>
          <li>Chargement sous 2 secondes garanti</li>
          <li>Formation à la gestion du contenu</li>
        </ul>
      </div>
      <div class="svc-card__bottom">
        <div class="svc-card__meta">
          <span class="svc-card__time">Livraison · 10 à 14 jours</span>
          <span class="svc-card__result">Score PageSpeed 90+ garanti</span>
        </div>
        <a href="/creations/site-web" class="btn btn--sm">Découvrir <span class="arr">→</span></a>
      </div>
    </article>
    <article class="svc-card reveal">
      <div class="svc-card__top">
        <span class="svc-card__no">04 / création</span>
        <div class="svc-card__icon">▣</div>
        <h3>SaaS sur mesure</h3>
        <p class="svc-card__desc">Un logiciel métier pensé pour votre process, pas pour un template générique. Cahier des charges, développement, tests et formation inclus.</p>
        <ul class="svc-card__list">
          <li>Cahier des charges &amp; architecture</li>
          <li>Développement backend &amp; base de données</li>
          <li>Interface utilisateur responsive</li>
          <li>Documentation &amp; formation incluses</li>
        </ul>
      </div>
      <div class="svc-card__bottom">
        <div class="svc-card__meta">
          <span class="svc-card__time">Devis · sous 48 h</span>
          <span class="svc-card__result">Code source livré à 100%</span>
        </div>
        <a href="/creations/saas" class="btn btn--sm">Découvrir <span class="arr">→</span></a>
      </div>
    </article>
  </div>
</section>

<div class="process-strip">
  <div class="wrap">
    <div class="process-strip__inner reveal">
      <div class="process-strip__txt">
        <span class="prompt" style="margin-bottom:.8rem">Comment ça marche</span>
        <h2>De l'audit à la <em>livraison</em></h2>
        <p>Chaque projet démarre par un audit gratuit. On construit ensuite sur des bases solides, dans un délai fixé noir sur blanc.</p>
        <a href="/contact" class="btn" style="margin-top:1.6rem">Démarrer l'audit gratuit <span class="arr">→</span></a>
      </div>
      <div class="process-steps">
        <div class="pstrip"><span class="pstrip__no">01</span><h4>Audit</h4><p>Gratuit · 30 min</p></div>
        <div class="pstrip"><span class="pstrip__no">02</span><h4>Plan d'action</h4><p>Sous 48 h</p></div>
        <div class="pstrip"><span class="pstrip__no">03</span><h4>Livraison</h4><p>7 jours</p></div>
        <div class="pstrip"><span class="pstrip__no">04</span><h4>Optimisation</h4><p>En option</p></div>
      </div>
    </div>
  </div>
</div>

<section class="final wrap">
  <div class="final__box reveal">
    <span class="eyebrow">// prochaine étape</span>
    <h2>Pas sûr de quelle création vous avez besoin ? L'audit <em>clarifie tout</em>.</h2>
    <div class="final__proof">
      <span><b>120+</b> projets livrés dans 12+ pays</span>
      <span><b>Audit gratuit</b> · réponse sous 24 h</span>
      <span>Plan d'action personnalisé sous <b>48 h</b></span>
    </div>
    <div class="final__cta">
      <a href="/contact" class="btn">Demander mon audit gratuit <span class="arr">→</span></a>
      <a href="/a-propos" class="btn btn--ghost">Découvrir le studio</a>
    </div>
  </div>
</section>

</BaseLayout>

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
Expected: exit code 0, `dist/creations/index.html` generated.

- [ ] **Step 3: Manual verification in the browser**

Run `npm run build && npm run preview`, open the local URL, and check:
- `/creations` shows the 4-card grid, each card's "Découvrir" button links to the correct detail page.
- Each of the 4 detail pages loads, shows its hero/stats/livrables/pour-qui/processus/résultats/CTA sections, and the "Retour aux créations" link goes back to `/creations`.
- The Header's "Créations" dropdown links (already pointing to these 4 URLs) now resolve instead of 404ing.
- Reveal-on-scroll animations still fire on each page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/creations/index.astro
git commit -m "feat: add /creations overview page"
```

---

### Task 7: Push to GitHub

**Files:** none (git operation only)

- [ ] **Step 1: Push the branch**

```bash
git push
```

Expected: all commits from this plan appear on `origin/main` at `https://github.com/mkdigitool-bit/TalentDigital-Marketing`.
