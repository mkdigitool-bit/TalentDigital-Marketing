# Astro Foundation & Homepage Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Astro project for TalentDigital with a shared header/footer layout, and migrate the homepage (`home-page.html`) onto it as the first working page.

**Architecture:** A single Astro project at the repo root. `src/styles/global.css` holds design tokens and elements reused on every page (buttons, cards, nav, footer, typography). `src/components/Header.astro` and `src/components/Footer.astro` are the shared chrome. `src/layouts/BaseLayout.astro` wires head/meta + Header + `<slot/>` + Footer. `src/pages/index.astro` is the first content page, consuming the layout.

**Tech Stack:** Astro (latest), plain CSS (no preprocessor — matches the existing site), vanilla JS via Astro's built-in `<script>` bundling (no framework/UI library — matches YAGNI, the current site has zero JS dependencies).

## Global Constraints

- Design tokens (from `home-page.html:3-21`): `--void:#0E0E10`, `--panel:#151518`, `--panel-2:#1B1B1F`, `--line:#27272D`, `--line-2:#3A3A42`, `--txt:#B8B8B2`, `--muted:#72727A`, `--lime:#C7F73E`, `--lime-dim:#9ec22f`, fonts Archivo (display) + JetBrains Mono (mono), `--maxw:1240px`.
- Sitemap (per `docs/superpowers/specs/2026-07-03-site-structure-design.md`): `/`, `/creations` (+ `/creations/landing-page`, `/creations/tunnel`, `/creations/site-web`, `/creations/saas`), `/a-propos`, `/contact`. This plan only builds `/` — the other pages are follow-up plans.
- Nav: no separate "Accueil" link (logo = home), "Créations" opens a dropdown to the 4 sub-pages, "À propos" plain link, CTA button "Audit gratuit" linking to `/contact`, nav is sticky.
- No unit test framework in this project — it is a static marketing site with no business logic to unit test. Verification per task is: `npm run build` succeeds (catches Astro/CSS/JS syntax errors and broken links between components), plus a manual check in the dev server (documented per task) confirming the rendered output matches the spec. This mirrors the "test-first" spirit — each task states the expected visual/structural outcome before you build it.
- All internal links use root-relative paths (`/`, `/creations`, `/a-propos`, `/contact`) — not the old `https://www.talentdigital.net/...` absolute URLs from the Systeme.io version.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder, overwritten in Task 6), `.gitignore`

**Interfaces:**
- Produces: a working `npm run dev` and `npm run build` in the repo root, which every later task depends on.

- [ ] **Step 1: Run the Astro scaffolding CLI**

Run this from the repo root (`C:\Users\Cash Tech\OneDrive\Bureau\TD-AA`):

```bash
npm create astro@latest .
```

Answer the interactive prompts exactly as follows:
- "Where should we create your new project?" → press Enter (accept `.`, current directory — it will warn the directory isn't empty because of `docs/`; choose "yes, continue" / allow non-empty)
- "How would you like to start your new project?" → **Empty**
- "Install dependencies?" → **Yes**
- "Initialize a new git repository?" → **No** (this repo is already a git repo)
- "Do you plan to write TypeScript?" → **Yes**
- "How strict?" → **Strict**

- [ ] **Step 2: Verify the dev server runs**

Run: `npm run dev`
Expected: terminal prints a local URL (e.g. `http://localhost:4321/`), no errors. Stop the server with Ctrl+C once confirmed.

- [ ] **Step 3: Verify the production build works**

Run: `npm run build`
Expected: exit code 0, output ends with something like `X page(s) built`, and a `dist/index.html` file exists.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src .gitignore
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Global design tokens and shared base styles

**Files:**
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: CSS custom properties and base classes (`.wrap`, `.prompt`, `.btn`, `.btn--ghost`, `.btn--sm`, `.tag`, `.tag--free`, `.card`, `.skip`, `.reveal`) that Header, Footer, and every future page rely on.
- Consumes: nothing (first stylesheet, no dependencies).

- [ ] **Step 1: Create the global stylesheet**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root{
  --void:#0E0E10;
  --panel:#151518;
  --panel-2:#1B1B1F;
  --line:#27272D;
  --line-2:#3A3A42;
  --txt:#B8B8B2;
  --muted:#72727A;
  --lime:#C7F73E;
  --lime-dim:#9ec22f;

  --display:"Archivo",system-ui,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,monospace;

  --maxw:1240px;
  --pad:clamp(1.25rem,5vw,3.5rem);
  --section:clamp(4.5rem,9vw,8rem);
  --ease:cubic-bezier(.2,.7,.2,1);
}

*{box-sizing:border-box;margin:0;padding:0}

html,body{
  background:var(--void);
  color:var(--txt);
  font-family:var(--display);
  font-weight:400;
  font-size:clamp(1rem,1.05vw,1.0625rem);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  overflow-x:hidden;
  min-height:100vh;
}

body::before{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:72px 72px;opacity:.4;
  -webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,#000 30%,transparent 100%);
  mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,#000 30%,transparent 100%);
}
main,header,footer{position:relative;z-index:1}

a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:var(--lime);color:var(--void)}

.skip{position:absolute;left:-999px;top:0;background:var(--lime);color:var(--void);padding:.6rem 1rem;z-index:10000;font-weight:700}
.skip:focus{left:.5rem;top:.5rem}

.wrap{max-width:var(--maxw);margin:0 auto;padding-inline:var(--pad)}

.prompt{
  font-family:var(--mono);font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--muted);display:flex;align-items:center;gap:.6rem;
}
.prompt::before{content:">";color:var(--lime);font-weight:700}
.prompt b{color:var(--txt);font-weight:500}

h1,h2,h3{font-family:var(--display);line-height:1.02;letter-spacing:-.02em}
h2{font-size:clamp(1.9rem,4.4vw,3.3rem);font-weight:800;margin-top:.9rem}
h2 em{font-style:normal;color:var(--lime)}

.lede{color:var(--muted);max-width:48ch;font-size:clamp(1.02rem,1.4vw,1.16rem)}

.btn{
  --bg:var(--lime);--fg:var(--void);--bd:var(--lime);
  display:inline-flex;align-items:center;gap:.6rem;
  background:var(--bg);color:var(--fg);
  font-family:var(--mono);font-weight:700;font-size:.85rem;letter-spacing:.02em;text-transform:uppercase;
  padding:.92rem 1.5rem;border:1px solid var(--bd);border-radius:3px;cursor:pointer;
  transition:transform .25s var(--ease),box-shadow .25s,background .2s,color .2s;
}
.btn .arr{transition:transform .3s var(--ease)}
.btn:hover{transform:translateY(-2px);box-shadow:0 0 0 3px rgba(199,247,62,.18),0 14px 30px -14px rgba(199,247,62,.5)}
.btn:hover .arr{transform:translateX(4px)}
.btn--ghost{--bg:transparent;--fg:var(--txt);--bd:var(--line-2)}
.btn--ghost:hover{--fg:var(--lime);--bd:var(--lime);box-shadow:0 0 0 3px rgba(199,247,62,.1)}
.btn:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.btn--sm{padding:.6rem 1.1rem;font-size:.78rem}

.tag{display:inline-block;font-family:var(--mono);font-size:.68rem;letter-spacing:.04em;text-transform:uppercase;border:1px solid var(--line-2);color:var(--txt);padding:.35rem .65rem;border-radius:100px}
.tag--free{border-color:var(--lime);color:var(--lime)}

.card{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:clamp(1.6rem,3vw,2.4rem);transition:border-color .3s,transform .3s var(--ease),box-shadow .3s;position:relative}
.card:hover{border-color:var(--lime);transform:translateY(-4px);box-shadow:0 0 0 1px rgba(199,247,62,.3),0 26px 50px -30px rgba(0,0,0,.8)}

.section{padding-block:var(--section)}
.section__head{max-width:64ch;margin-bottom:clamp(2.4rem,5vw,3.6rem)}

.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.reveal.in{opacity:1;transform:none}

@media (prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none;transition:none}
}
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: exit code 0 (the stylesheet isn't imported anywhere yet, so this just confirms no syntax errors break the build — Astro doesn't lint unimported CSS, so also open `src/styles/global.css` and re-read it once for stray braces).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global design tokens and base styles"
```

---

### Task 3: Header component with Créations dropdown

**Files:**
- Create: `src/components/Header.astro`

**Interfaces:**
- Consumes: `.wrap`, `.btn`, `.btn--ghost`, `.btn--sm` classes from `global.css` (Task 2).
- Produces: `<Header />` component, importable as `import Header from '../components/Header.astro'`, used by `BaseLayout.astro` (Task 5).

- [ ] **Step 1: Create the Header component**

Create `src/components/Header.astro`:

```astro
---
const { pathname } = Astro.url;
const isCreations = pathname.startsWith('/creations');
const isAPropos = pathname.startsWith('/a-propos');
---

<header>
  <nav class="nav" id="td-nav" role="navigation" aria-label="Navigation principale">
    <div class="wrap nav__in">
      <a href="/" class="brand" aria-label="TalentDigital — Accueil">
        <img src="/logo-talentdigital.png" alt="TalentDigital" height="34" />
      </a>

      <div class="nav__links" id="td-nav-links" aria-label="Liens navigation">
        <div class="nav__drop">
          <button class:list={['nav__drop-btn', { 'is-active': isCreations }]} aria-expanded="false" aria-controls="td-creations-panel">
            Créations
            <span class="nav__drop-sign" aria-hidden="true">+</span>
          </button>
          <div class="nav__drop-panel" id="td-creations-panel">
            <a href="/creations/landing-page">Landing page</a>
            <a href="/creations/tunnel">Tunnel de vente</a>
            <a href="/creations/site-web">Site web</a>
            <a href="/creations/saas">SaaS</a>
          </div>
        </div>
        <a href="/a-propos" class:list={[{ 'is-active': isAPropos }]} aria-current={isAPropos ? 'page' : undefined}>À propos</a>
        <a href="/contact" class="btn btn--ghost btn--sm">
          Audit gratuit
          <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>

      <div class="nav__end">
        <a href="/contact" class="btn btn--ghost btn--sm">
          Audit gratuit
          <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <button class="nav__toggle" id="td-nav-toggle" aria-expanded="false" aria-controls="td-nav-links" aria-label="Menu mobile">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</header>

<style>
  .nav{position:sticky;top:0;z-index:200;background:rgba(14,14,16,.7);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:border-color .3s,background .3s}
  .nav.is-stuck{border-color:var(--line);background:rgba(14,14,16,.92)}
  .nav__in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:74px}
  .brand{font-family:var(--display);font-weight:900;font-size:1.45rem;letter-spacing:-.04em;display:inline-flex;align-items:center}
  .nav__links{display:flex;align-items:center;gap:2rem}
  .nav__links > a:not(.btn){font-family:var(--mono);font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);position:relative;padding:.2rem 0;transition:color .2s}
  .nav__links > a:not(.btn):hover{color:var(--txt)}
  .nav__links > a:not(.btn)::after{content:"";position:absolute;left:0;bottom:-3px;height:2px;width:100%;background:var(--lime);transform:scaleX(0);transform-origin:left;transition:transform .3s var(--ease)}
  .nav__links > a:not(.btn):hover::after,.nav__links > a:not(.btn).is-active::after{transform:scaleX(1)}
  .nav__links > a.is-active{color:var(--txt)}
  .nav__links .btn{display:none}

  .nav__drop{position:relative}
  .nav__drop-btn{background:none;border:0;cursor:pointer;font-family:var(--mono);font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);display:inline-flex;align-items:center;gap:.4rem;padding:.2rem 0;transition:color .2s}
  .nav__drop-btn:hover,.nav__drop-btn.is-active{color:var(--txt)}
  .nav__drop-sign{font-size:.85em;transition:transform .25s var(--ease)}
  .nav__drop-panel{position:absolute;top:calc(100% + 14px);left:50%;transform:translateX(-50%);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:.5rem;display:flex;flex-direction:column;min-width:190px;opacity:0;visibility:hidden;transform:translate(-50%,6px);transition:opacity .2s var(--ease),transform .2s var(--ease),visibility .2s}
  .nav__drop:hover .nav__drop-panel,.nav__drop.is-open .nav__drop-panel{opacity:1;visibility:visible;transform:translate(-50%,0)}
  .nav__drop.is-open .nav__drop-sign{transform:rotate(45deg)}
  .nav__drop-panel a{display:block;font-family:var(--mono);font-size:.78rem;text-transform:uppercase;letter-spacing:.03em;color:var(--txt);padding:.6rem .8rem;border-radius:4px;transition:background .2s,color .2s}
  .nav__drop-panel a:hover{background:var(--panel-2);color:var(--lime)}

  .nav__toggle{display:none;background:none;border:1px solid var(--line-2);border-radius:3px;width:46px;height:40px;cursor:pointer;flex-direction:column;gap:5px;align-items:center;justify-content:center}
  .nav__toggle span{width:20px;height:2px;background:var(--txt);transition:.3s}
  .nav__end{display:flex;align-items:center;gap:.75rem;justify-self:end}

  @media (max-width:880px){
    .nav__toggle{display:flex}
    .nav__end .btn{display:none}
    .nav__links .btn{display:inline-flex}
    .nav__links{position:fixed;inset:74px 0 auto 0;background:var(--panel);flex-direction:column;align-items:flex-start;gap:.2rem;padding:1rem var(--pad) 2rem;border-bottom:1px solid var(--line);transform:translateY(-130%);transition:transform .4s var(--ease);max-height:calc(100vh - 74px);overflow-y:auto}
    .nav__links.is-open{transform:translateY(0)}
    .nav__links > a:not(.btn){font-size:1rem;padding:.8rem 0;width:100%;border-bottom:1px solid var(--line)}
    .nav__links > a:not(.btn)::after{display:none}
    .nav__links .btn{margin-top:1rem;width:100%;justify-content:center}
    .nav.is-open .nav__toggle span:nth-child(1){transform:translateY(7px) rotate(45deg)}
    .nav.is-open .nav__toggle span:nth-child(2){opacity:0}
    .nav.is-open .nav__toggle span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

    .nav__drop{width:100%;border-bottom:1px solid var(--line)}
    .nav__drop-btn{width:100%;justify-content:space-between;font-size:1rem;padding:.8rem 0}
    .nav__drop-panel{position:static;opacity:1;visibility:visible;transform:none;display:none;background:transparent;border:0;padding:0 0 .6rem;min-width:0}
    .nav__drop.is-open .nav__drop-panel{display:flex}
    .nav__drop-panel a{padding:.6rem 0 .6rem 1rem;color:var(--muted)}
  }
</style>

<script>
  const nav = document.getElementById('td-nav') as HTMLElement;
  const toggle = document.getElementById('td-nav-toggle') as HTMLButtonElement;
  const menu = document.getElementById('td-nav-links') as HTMLElement;
  const drop = document.querySelector('.nav__drop') as HTMLElement;
  const dropBtn = document.querySelector('.nav__drop-btn') as HTMLButtonElement;

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;pointer-events:none';
  document.body.prepend(sentinel);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  dropBtn.addEventListener('click', () => {
    const open = drop.classList.toggle('is-open');
    dropBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
</script>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: exit code 0. (Header isn't used by any page yet, so this only confirms the `.astro` file itself has no syntax errors — Astro type-checks `.astro` files during build.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Header component with Créations dropdown"
```

---

### Task 4: Footer component

**Files:**
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `.wrap` class from `global.css` (Task 2).
- Produces: `<Footer />` component, used by `BaseLayout.astro` (Task 5).

- [ ] **Step 1: Create the Footer component**

Create `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="site-footer" role="contentinfo">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__brand">
        <a href="/" class="brand" aria-label="TalentDigital — Accueil">
          <img src="/logo-talentdigital.png" alt="TalentDigital" height="38" />
        </a>
        <p class="foot__tag">Infrastructure de conversion pour le web mondial. On construit les systèmes qui transforment votre trafic en chiffre d'affaires.</p>
        <div class="foot__social" aria-label="Réseaux sociaux">
          <a href="https://www.linkedin.com/company/talentdigital" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
          <a href="https://www.instagram.com/talentdigital.net" target="_blank" rel="noopener" aria-label="Instagram">ig</a>
        </div>
      </div>
      <div class="foot">
        <h5>Navigation</h5>
        <ul>
          <li><a href="/">Accueil</a></li>
          <li><a href="/creations">Créations</a></li>
          <li><a href="/a-propos">À propos</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div class="foot">
        <h5>Créations</h5>
        <ul>
          <li><a href="/creations/landing-page">Landing page</a></li>
          <li><a href="/creations/tunnel">Tunnel de vente</a></li>
          <li><a href="/creations/site-web">Site web</a></li>
          <li><a href="/creations/saas">SaaS</a></li>
        </ul>
      </div>
      <div class="foot">
        <h5>Contact</h5>
        <ul>
          <li><a href="mailto:contact@talentdigital.net">contact@talentdigital.net</a></li>
          <li><a href="/contact">Formulaire de contact</a></li>
          <li><a href="/contact">Audit gratuit</a></li>
        </ul>
      </div>
    </div>
    <div class="foot__bottom">
      <span>© {year} TalentDigital — Tous droits réservés</span>
    </div>
  </div>
</footer>

<style>
  .site-footer{border-top:1px solid var(--line);padding-block:clamp(3rem,6vw,4.5rem) 2rem;background:var(--panel)}
  .foot__top{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:2rem}
  .foot__brand .brand{font-size:1.7rem}
  .foot__tag{color:var(--muted);max-width:30ch;margin-top:1rem;font-size:.92rem}
  .foot h5{font-family:var(--mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
  .foot ul{list-style:none;display:flex;flex-direction:column;gap:.6rem}
  .foot a{font-size:.92rem;color:var(--txt);opacity:.8;transition:.2s;width:fit-content}
  .foot a:hover{opacity:1;color:var(--lime)}
  .foot__bottom{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center;border-top:1px solid var(--line);margin-top:3rem;padding-top:1.5rem;font-family:var(--mono);font-size:.72rem;color:var(--muted);letter-spacing:.02em}
  .foot__social{display:flex;gap:.7rem;margin-top:1.2rem}
  .foot__social a{font-family:var(--mono);font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;width:34px;height:34px;border:1px solid var(--line-2);border-radius:4px;display:grid;place-items:center;color:var(--muted);transition:.2s;opacity:1}
  .foot__social a:hover{border-color:var(--lime);color:var(--lime)}

  @media (max-width:880px){.foot__top{grid-template-columns:1fr 1fr}.foot__brand{grid-column:1/-1}}
  @media (max-width:520px){.foot__top{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

### Task 5: BaseLayout wiring Header + slot + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `Header` from `../components/Header.astro` (Task 3), `Footer` from `../components/Footer.astro` (Task 4), `../styles/global.css` (Task 2).
- Produces: `BaseLayout` component accepting props `title: string` and `description: string`, rendering `<slot />` for page content. Every future page imports this: `import BaseLayout from '../layouts/BaseLayout.astro'`.

- [ ] **Step 1: Create the layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="color-scheme" content="dark" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</head>
<body>
  <a href="#main" class="skip">Aller au contenu</a>
  <Header />
  <main id="main" tabindex="-1">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: exit code 0. (Layout isn't consumed by a page yet, so this only confirms the imports resolve and the component itself is valid Astro/TS.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout wiring Header, slot, and Footer"
```

---

### Task 6: Homepage using BaseLayout

**Files:**
- Modify: `src/pages/index.astro` (replace the Task 1 placeholder entirely)
- Create: `public/logo-talentdigital.png` (copy of the existing site's logo)

**Interfaces:**
- Consumes: `BaseLayout` from `../layouts/BaseLayout.astro` (Task 5).

- [ ] **Step 1: Copy the logo into `public/`**

Run:
```bash
mkdir -p public
cp "logo talentdigital/logo-talentdigital.png" public/logo-talentdigital.png
```

- [ ] **Step 2: Write the homepage**

Replace `src/pages/index.astro` with the homepage content migrated from `home-page.html`, using `BaseLayout`. Keep every section (hero, tools marquee, services, processus, résultats, témoignages, faq, final CTA) and their existing copy exactly as written in `home-page.html:313-557`, with these changes only:
- Wrap everything in `<BaseLayout title="TalentDigital — Sites, tunnels de vente & landing pages haute conversion" description="Studio indépendant spécialisé en sites web, tunnels de vente et landing pages haute conversion pour coachs, formateurs, e-commerçants et infopreneurs. Audit gratuit, réponse sous 24 h.">...</BaseLayout>` instead of `<div class="td-root">`.
- Replace the internal anchor links (`#services`, `#processus`, `#resultats`, `#faq`, `#contact`) — keep them as-is, they still work as in-page anchors.
- Replace the "Voir les services" link at `home-page.html:554` to point to `/creations` instead of `https://www.talentdigital.net/services`.
- Move the page-specific CSS (everything in `home-page.html:120-276`, i.e. `.hero` through the `@media (prefers-reduced-motion:reduce)` block excluding what's already in `global.css`) into a `<style>` tag in this file.
- Move the page-specific `<script>` (`home-page.html:610-696`, excluding the nav-toggle/sticky logic which now lives in `Header.astro`) into a `<script>` tag in this file — keep the smooth-scroll, metric bar animation, reveal-on-scroll, and FAQ accordion logic.
- Drop the two inline logo `<img>` references inside this file (there are none in the body content besides nav/footer, which are now in Header/Footer).

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: exit code 0, `dist/index.html` regenerated.

- [ ] **Step 4: Manual verification in the browser**

Run: `npm run dev`, open the printed local URL, and confirm:
- Header shows logo, "Créations" (hover reveals a dropdown with 4 links), "À propos", and an "Audit gratuit" button.
- Scrolling down keeps the header visible (sticky) and it gains a border/opaque background once scrolled.
- All 8 sections from `home-page.html` render with content (hero, tools marquee scrolling, services cards, 4-step process, "pour qui" cards, 3 testimonials, FAQ accordion opens/closes on click, final CTA box).
- Footer shows the 4 columns (brand, Navigation, Créations, Contact) with working links.
- Resize the window below 880px: nav collapses into the hamburger toggle, and the Créations item becomes a tappable accordion inside the mobile menu.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro public/logo-talentdigital.png
git commit -m "feat: migrate homepage onto BaseLayout"
```

---

### Task 7: Push to GitHub

**Files:** none (git operation only)

- [ ] **Step 1: Push the branch**

```bash
git push
```

Expected: all commits from this plan appear on `origin/main` at `https://github.com/mkdigitool-bit/TalentDigital-Marketing`.
