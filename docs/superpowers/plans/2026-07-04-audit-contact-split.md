# Audit / Contact Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current audit-request page (`/contact`) into two pages: a dedicated `/audit` landing page (today's content, unchanged) and a new minimal `/contact` general-inquiry page, each backed by its own Supabase table + Vercel API endpoint.

**Architecture:** `src/pages/audit.astro` is a near-verbatim copy of today's `contact.astro`, still POSTing to the existing `api/contact.js` / `contact_submissions` table. `src/pages/contact.astro` is rewritten as a short general-contact page POSTing to a new `api/contact-general.js` / `general_inquiries` table. Every CTA across the site that means "request the free audit" is repointed to `/audit`; CTAs that mean plain "get in touch" stay on `/contact`.

**Tech Stack:** Astro 7 (static), Vercel serverless functions (`/api`), Supabase (`@supabase/supabase-js`), Resend, Node's built-in `node --test` runner.

## Global Constraints

- No fabricated statistics, ratings, or client testimonials in any new copy (project-wide rule) — the new `/contact` copy only states the real, controllable 24h response commitment.
- No Systeme.io dependency or mention anywhere.
- Root reference `.html` files must stay in sync with the live Astro pages: self-contained `<style>`, text-logo nav (never `<img>`), zero `<script>` tags, complete `<!DOCTYPE html>`/`<html>`/`<head>`/`<body>` structure.
- `/audit` reuses the existing `api/contact.js` endpoint and `contact_submissions` table unchanged. `/contact` gets its own new endpoint (`api/contact-general.js`) and new table (`general_inquiries`) — these are NOT shared, per the approved spec.
- The only intentional deviation from a byte-for-byte copy for `/audit` is the `<title>`/meta `description` and the JSON-LD `url` — needed so `/audit` and `/contact` don't serve duplicate `<title>` tags. The visible body content (hero, form, sidebar, FAQ, closing strip) stays identical to today's `contact.astro`.
- Env vars are unchanged: both endpoints reuse `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`. No new Vercel env vars needed.

---

### Task 1: `validateGeneralContactPayload` validator (TDD)

**Files:**
- Modify: `api/_validate.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Produces: `validateGeneralContactPayload(body)` → `{ valid: boolean, honeypot: boolean, error?: string }`, exported from `api/_validate.js` alongside the existing `validateContactPayload`.

- [ ] **Step 1: Write the failing tests**

Modify the import line at the top of `tests/validate.test.js`:

```javascript
import { validateContactPayload, validateGeneralContactPayload } from '../api/_validate.js';
```

Append these tests to the end of `tests/validate.test.js`:

```javascript
const generalBasePayload = {
  website: '',
  prenom: 'Yassine',
  email: 'yassine@example.com',
  message: 'Bonjour, une question rapide.',
};

test('general: rejects a payload with the honeypot field filled', () => {
  const result = validateGeneralContactPayload({ ...generalBasePayload, website: 'http://spam.example' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, true);
});

test('general: rejects a payload missing a required field', () => {
  const result = validateGeneralContactPayload({ ...generalBasePayload, prenom: '' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, false);
  assert.match(result.error, /prenom/);
});

test('general: rejects a payload with an invalid email', () => {
  const result = validateGeneralContactPayload({ ...generalBasePayload, email: 'not-an-email' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, false);
  assert.match(result.error, /email/i);
});

test('general: accepts a fully valid payload', () => {
  const result = validateGeneralContactPayload(generalBasePayload);
  assert.equal(result.valid, true);
  assert.equal(result.honeypot, false);
  assert.equal(result.error, undefined);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `validateGeneralContactPayload is not a function` (or similar import error), since it doesn't exist yet.

- [ ] **Step 3: Implement the validator**

Append to `api/_validate.js` (the file already defines `EMAIL_RE` near the top — reuse it, don't redefine it):

```javascript
const GENERAL_REQUIRED_FIELDS = ['prenom', 'email', 'message'];

const GENERAL_FIELD_LABELS = {
  prenom: 'prenom',
  email: 'email',
  message: 'message',
};

export function validateGeneralContactPayload(body) {
  const data = body || {};

  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return { valid: false, honeypot: true };
  }

  for (const field of GENERAL_REQUIRED_FIELDS) {
    const value = data[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return {
        valid: false,
        honeypot: false,
        error: `Le champ "${GENERAL_FIELD_LABELS[field]}" est requis.`,
      };
    }
  }

  if (!EMAIL_RE.test(data.email.trim())) {
    return { valid: false, honeypot: false, error: 'Adresse email invalide.' };
  }

  return { valid: true, honeypot: false };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests in `tests/validate.test.js` green (existing `validateContactPayload` tests plus the 4 new ones).

- [ ] **Step 5: Commit**

```bash
git add api/_validate.js tests/validate.test.js
git commit -m "feat: add validateGeneralContactPayload for the general contact form"
```

---

### Task 2: `general_inquiries` table + `api/contact-general.js` endpoint (TDD)

**Files:**
- Create: `api/contact-general.js`
- Test: `tests/contact-general.test.js`
- Modify: `supabase/schema.sql` (append the new table definition, documentation-only — the file is never executed automatically)

**Interfaces:**
- Consumes: `validateGeneralContactPayload` from Task 1 (`api/_validate.js`).
- Produces: default-exported `handler(req, res)` from `api/contact-general.js`, matching the same `(req, res) => Promise<void>` shape as `api/contact.js`, POSTing to a Supabase table named `general_inquiries`.

- [ ] **Step 1: Create the Supabase table**

Append to `supabase/schema.sql`:

```sql

create table general_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  email text not null,
  telephone text,
  message text not null
);
```

Apply it to the live Supabase project (the same project already used for `contact_submissions`) — use the Supabase MCP tools (`list_projects` to find the project, then `apply_migration` with this SQL and a migration name like `create_general_inquiries`), or paste the same SQL into the Supabase Dashboard's SQL editor for that project if the MCP tool isn't available. RLS stays enabled with no policies, matching `contact_submissions` (the service-role key used by the API bypasses RLS).

- [ ] **Step 2: Write the failing tests**

Create `tests/contact-general.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact-general.js';

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('rejects non-POST requests with 405', async () => {
  const res = createMockRes();
  await handler({ method: 'GET', body: {} }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.ok, false);
});

test('returns a fake success for honeypot-filled submissions without touching external services', async () => {
  const res = createMockRes();
  await handler(
    {
      method: 'POST',
      body: {
        website: 'http://spam.example',
        prenom: 'Yassine',
        email: 'yassine@example.com',
        message: 'Bonjour',
      },
    },
    res
  );
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
});

test('rejects a payload missing required fields with 400', async () => {
  const res = createMockRes();
  await handler({ method: 'POST', body: { website: '' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.ok, false);
  assert.ok(res.body.error);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../api/contact-general.js'`.

- [ ] **Step 4: Implement the endpoint**

Create `api/contact-general.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { validateGeneralContactPayload } from './_validate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée.' });
  }

  const body = req.body || {};
  const result = validateGeneralContactPayload(body);

  if (!result.valid) {
    if (result.honeypot) {
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, error: result.error });
  }

  const prenom = body.prenom.trim();
  const email = body.email.trim();
  const tel = typeof body.tel === 'string' ? body.tel.trim() : '';
  const message = body.message.trim();

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: dbError } = await supabase.from('general_inquiries').insert({
      prenom,
      email,
      telephone: tel || null,
      message,
    });

    if (dbError) {
      throw new Error(`Supabase insert failed: ${dbError.message}`);
    }

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_TO_EMAIL || 'info@talentdigital.net',
      replyTo: email,
      subject: `Nouveau message de contact — ${prenom}`,
      text: [
        `Prénom : ${prenom}`,
        `Email : ${email}`,
        `Téléphone : ${tel || 'non renseigné'}`,
        '',
        'Message :',
        message,
      ].join('\n'),
    });

    if (emailError) {
      throw new Error(`Resend send failed: ${emailError.message}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('General contact form submission failed:', err);
    return res.status(500).json({
      ok: false,
      error: 'Une erreur est survenue. Réessayez ou écrivez-nous directement à info@talentdigital.net.',
    });
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green, including the 3 new ones in `tests/contact-general.test.js`.

- [ ] **Step 6: Commit**

```bash
git add api/contact-general.js tests/contact-general.test.js supabase/schema.sql
git commit -m "feat: add api/contact-general.js endpoint and general_inquiries table"
```

---

### Task 3: `src/pages/audit.astro`

**Files:**
- Create: `src/pages/audit.astro`

**Interfaces:**
- Consumes: `../layouts/BaseLayout.astro` (existing, unchanged), posts to `/api/contact.js` (existing, unchanged).
- Produces: route `/audit`, rendering the full audit-request page.

- [ ] **Step 1: Copy the current contact page**

```bash
cp "src/pages/contact.astro" "src/pages/audit.astro"
```

- [ ] **Step 2: Update the BaseLayout title/description**

In `src/pages/audit.astro`, find:

```astro
<BaseLayout title="Contact — TalentDigital" description="Audit gratuit de 30 min, sans engagement. Décrivez votre projet, on vous répond sous 24 h avec un plan d'action concret.">
```

Replace with:

```astro
<BaseLayout title="Audit gratuit — TalentDigital" description="Audit gratuit de 30 min, sans engagement. Décrivez votre projet, on vous répond sous 24 h avec un plan d'action concret.">
```

- [ ] **Step 3: Update the JSON-LD url**

In `src/pages/audit.astro`, find:

```
"url":"https://www.talentdigital.net/contact"
```

Replace with:

```
"url":"https://www.talentdigital.net/audit"
```

- [ ] **Step 4: Verify the build picks up the new route**

Run: `npm run build`
Expected: build succeeds; output includes both `dist/contact/index.html` and `dist/audit/index.html` (contact.astro hasn't been rewritten yet at this point in the plan, so both still exist with the old content — that's expected here).

- [ ] **Step 5: Commit**

```bash
git add src/pages/audit.astro
git commit -m "feat: add /audit page (copy of the audit-request contact page)"
```

---

### Task 4: Rewrite `src/pages/contact.astro` (minimal general contact page)

**Files:**
- Modify: `src/pages/contact.astro` (full rewrite)

**Interfaces:**
- Consumes: `../layouts/BaseLayout.astro` (existing), posts to `/api/contact-general` (Task 2).
- Produces: route `/contact` now renders the minimal general-inquiry page instead of the audit-request page.

- [ ] **Step 1: Replace the full contents of `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Contact — TalentDigital" description="Une question, un projet, une simple prise de contact ? Écrivez-nous à TalentDigital, réponse sous 24 h.">

<section class="hero-contact" aria-labelledby="td-contact-heading">
  <div class="hero-contact__glow" aria-hidden="true"></div>
  <div class="wrap">
    <div class="prompt"><b>Contact</b></div>
    <h1 id="td-contact-heading">Contactez-<em>nous.</em></h1>
    <p class="lede" style="margin-top:1.2rem;max-width:56ch">
      Une question, un projet, une simple prise de contact ? Écrivez-nous, on vous répond sous 24 heures.
    </p>
  </div>
</section>

<section class="contact-section" aria-label="Formulaire de contact">
  <div class="wrap">
    <div class="contact-grid">

      <div class="reveal">
        <div class="contact-form" id="td-contact-form">
          <div class="form-success" role="status" aria-live="polite">
            <div class="form-success__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--lime)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14l6 6 12-12"/></svg>
            </div>
            <h3>Message bien reçu !</h3>
            <p>Merci, votre message est bien arrivé. On vous répond sous 24 heures.</p>
            <span class="form-success__timer">Réponse sous 24 h</span>
          </div>
          <div class="form-fields">
            <div class="form-title">Envoyer un message</div>
            <form id="td-form" novalidate>
              <div class="hp-field" aria-hidden="true">
                <label for="td-website">Laissez ce champ vide</label>
                <input type="text" id="td-website" name="website" tabindex="-1" autocomplete="off">
              </div>
              <div class="field">
                <label for="td-prenom">Prénom <span class="req" aria-hidden="true">*</span></label>
                <input type="text" id="td-prenom" name="prenom" placeholder="Yassine" autocomplete="given-name" required>
              </div>
              <div class="form-row">
                <div class="field">
                  <label for="td-email">Email <span class="req" aria-hidden="true">*</span></label>
                  <input type="email" id="td-email" name="email" placeholder="vous@example.com" autocomplete="email" required>
                </div>
                <div class="field">
                  <label for="td-tel">Téléphone / WhatsApp</label>
                  <input type="tel" id="td-tel" name="tel" placeholder="+212 6XX XXX XXX" autocomplete="tel">
                </div>
              </div>
              <div class="field">
                <label for="td-message">Votre message <span class="req" aria-hidden="true">*</span></label>
                <textarea id="td-message" name="message" placeholder="Ex : Bonjour, j'ai une question sur..." required></textarea>
              </div>
              <div class="form-agree">
                <input type="checkbox" id="td-agree" name="agree" required>
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="#">Politique de confidentialité</a></p>
              </div>
              <button type="submit" class="btn btn--full" id="td-submit">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h14M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Envoyer le message
              </button>
              <p class="form-note">Réponse sous 24 h</p>
            </form>
          </div>
        </div>
      </div>

      <div class="contact-side reveal" style="transition-delay:.15s">
        <div class="side-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
            Contact direct
          </h3>
          <div class="direct-links">
            <a href="mailto:info@talentdigital.net" class="direct-link">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
              <div>
                info@talentdigital.net
                <span class="direct-link__lbl">Email professionnel</span>
              </div>
            </a>
            <a href="https://wa.me/212663206266" class="direct-link" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 1.38.37 2.68 1.01 3.8L1.5 16.5l3.78-1.02A7.5 7.5 0 109 1.5z"/><path d="M6.5 6.5s.5 1 1.5 2 2 1.5 2 1.5l1-1 1.5 1.5s-.5 1.5-2 1.5C8 12 6 10 6 10S4 8 4 5.5l1.5-1L7 6l-.5.5z"/></svg>
              <div>
                WhatsApp
                <span class="direct-link__lbl">Réponse rapide</span>
              </div>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<script type="application/ld+json">{"@context":"https://schema.org","@type":"ContactPage","name":"Contactez TalentDigital","url":"https://www.talentdigital.net/contact","description":"Une question, un projet ? Écrivez-nous à TalentDigital, réponse sous 24 h.","publisher":{"@type":"Organization","name":"TalentDigital","url":"https://www.talentdigital.net","email":"info@talentdigital.net","telephone":"+212663206266"}}</script>

</BaseLayout>

<style>
  .hero-contact{padding-top:clamp(3rem,7vw,5.5rem);padding-bottom:clamp(2.5rem,5vw,4rem);border-bottom:1px solid rgba(199,247,62,.1);position:relative;overflow:hidden;background:linear-gradient(rgba(14,14,16,.86),rgba(14,14,16,.86)),url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&fit=crop') center/cover no-repeat}
  .hero-contact__glow{position:absolute;top:-20%;right:-10%;width:600px;height:600px;background:radial-gradient(ellipse 60% 60% at 60% 40%,rgba(199,247,62,.05) 0%,transparent 65%);pointer-events:none}
  .hero-contact>*:not(.hero-contact__glow){position:relative;z-index:1}
  .hero-contact h1{font-size:clamp(2rem,4vw,3.6rem);font-weight:900;letter-spacing:-.03em;line-height:1.05;margin-top:.7rem}
  .hero-contact h1 em{font-style:normal;color:var(--lime)}

  .contact-section{padding-block:var(--section)}
  .contact-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:start}
  @media(max-width:900px){.contact-grid{grid-template-columns:1fr;gap:3rem}}

  .hp-field{position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden}

  .contact-form{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:clamp(1.8rem,4vw,2.8rem)}
  .form-title{font-size:1.35rem;font-weight:800;letter-spacing:-.02em;margin-bottom:1.8rem}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  @media(max-width:600px){.form-row{grid-template-columns:1fr}}
  .field{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.1rem}
  .field label{font-family:var(--mono);font-size:.73rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
  .field label .req{color:var(--lime);margin-left:.15rem}
  .field input,.field textarea{
    background:var(--panel-2);
    border:1px solid var(--line-2);
    border-radius:4px;
    color:var(--txt);
    font-family:var(--display);
    font-size:.95rem;
    padding:.85rem 1rem;
    width:100%;
    transition:border-color .2s,box-shadow .2s;
    outline:none;
    -webkit-appearance:none;
  }
  .field input::placeholder,.field textarea::placeholder{color:var(--muted);opacity:.7}
  .field input:focus,.field textarea:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(199,247,62,.1)}
  .field textarea{resize:vertical;min-height:110px;line-height:1.6}
  .form-agree{display:flex;align-items:flex-start;gap:.75rem;margin-top:.5rem;margin-bottom:1.4rem}
  .form-agree input[type=checkbox]{width:18px;height:18px;min-width:18px;border:1px solid var(--line-2);border-radius:3px;background:var(--panel-2);cursor:pointer;accent-color:var(--lime);margin-top:.1rem}
  .form-agree p{font-size:.82rem;color:var(--muted);line-height:1.55}
  .form-agree a{color:var(--txt);text-decoration:underline;text-underline-offset:3px;opacity:.7}
  .form-agree a:hover{opacity:1;color:var(--lime)}
  .form-note{font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:1rem;text-align:center}
  .btn--full{width:100%;justify-content:center}

  .contact-side{display:flex;flex-direction:column;gap:1.6rem}
  .side-card{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:1.6rem}
  .side-card h3{font-size:1rem;font-weight:800;letter-spacing:-.01em;margin-bottom:1.1rem;display:flex;align-items:center;gap:.6rem}
  .side-card h3 svg{color:var(--lime)}

  .direct-links{display:flex;flex-direction:column;gap:.6rem;margin-top:.2rem}
  .direct-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1px solid var(--line);border-radius:4px;font-size:.9rem;transition:.2s}
  .direct-link:hover{border-color:var(--lime);background:rgba(199,247,62,.04);color:var(--lime)}
  .direct-link svg{color:var(--lime);flex-none}
  .direct-link__lbl{font-size:.72rem;font-family:var(--mono);color:var(--muted);display:block;margin-top:.1rem}

  .form-success{display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3rem 2rem;gap:1.2rem;min-height:340px}
  .form-success__icon{width:64px;height:64px;border-radius:50%;background:rgba(199,247,62,.12);border:2px solid var(--lime);display:grid;place-items:center}
  .form-success h3{font-size:1.5rem;font-weight:800;letter-spacing:-.02em}
  .form-success p{color:var(--muted);max-width:34ch;line-height:1.6}
  .form-success__timer{font-family:var(--mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--lime);border:1px solid rgba(199,247,62,.3);border-radius:100px;padding:.35rem .9rem}
  .contact-form.is-sent .form-fields{display:none}
  .contact-form.is-sent .form-success{display:flex}
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

(function(){
  var form=document.getElementById('td-form');
  var wrap=document.getElementById('td-contact-form');
  var submit=document.getElementById('td-submit');
  if(!form)return;

  function showError(msg){
    var existing=document.getElementById('td-form-error');
    if(existing) existing.remove();
    var el=document.createElement('p');
    el.id='td-form-error';
    el.setAttribute('role','alert');
    el.style.cssText='font-family:var(--mono);font-size:.78rem;color:#f87171;margin-top:1rem;text-align:center';
    el.textContent=msg;
    submit.insertAdjacentElement('afterend',el);
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var valid=true;

    form.querySelectorAll('.field-error').forEach(function(el){el.remove();});
    form.querySelectorAll('.is-invalid').forEach(function(el){el.classList.remove('is-invalid');});
    var prevError=document.getElementById('td-form-error');
    if(prevError) prevError.remove();

    form.querySelectorAll('[required]').forEach(function(field){
      if(!field.value.trim()||(field.type==='checkbox'&&!field.checked)){
        valid=false;
        field.classList.add('is-invalid');
        var err=document.createElement('span');
        err.className='field-error';
        err.style.cssText='display:block;font-family:var(--mono);font-size:.68rem;color:#f87171;margin-top:.3rem';
        err.textContent=field.type==='checkbox'?'Veuillez accepter la politique de confidentialité':'Ce champ est requis';
        field.parentNode.appendChild(err);
      }
    });

    if(!valid){
      var first=form.querySelector('.is-invalid');
      if(first)first.focus();
      return;
    }

    var data={
      prenom: form.prenom.value.trim(),
      email: form.email.value.trim(),
      tel: form.tel.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value
    };

    submit.disabled=true;
    submit.style.opacity='.6';
    submit.textContent='Envoi en cours…';

    fetch('/api/contact-general',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }).then(function(res){
      return res.json().then(function(payload){ return {ok:res.ok, payload:payload}; });
    }).then(function(result){
      if(!result.ok || !result.payload.ok){
        throw new Error((result.payload&&result.payload.error)||'Une erreur est survenue.');
      }
      wrap.classList.add('is-sent');
      wrap.querySelector('.form-success').scrollIntoView({behavior:'smooth',block:'center'});
    }).catch(function(err){
      showError(err.message||'Une erreur est survenue. Réessayez ou écrivez-nous à info@talentdigital.net.');
      submit.disabled=false;
      submit.style.opacity='';
      submit.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h14M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> Envoyer le message';
    });
  });

  form.querySelectorAll('input,textarea').forEach(function(field){
    field.addEventListener('input',function(){
      field.classList.remove('is-invalid');
      var err=field.parentNode.querySelector('.field-error');
      if(err)err.remove();
    });
  });
})();
</script>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds; `dist/contact/index.html` now contains "Contactez-nous" / "Envoyer un message" rather than "Demande d'audit gratuit".

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: rewrite /contact as a minimal general-inquiry page"
```

---

### Task 5: Update `Header.astro` and `Footer.astro` links

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: routes `/audit` (Task 3) and `/contact` (Task 4).

- [ ] **Step 1: Add `isAudit` to `Header.astro`'s frontmatter**

In `src/components/Header.astro`, find:

```astro
const isContact = pathname.startsWith('/contact');
```

Replace with:

```astro
const isContact = pathname.startsWith('/contact');
const isAudit = pathname.startsWith('/audit');
```

(`isAudit` isn't consumed by any markup yet — the CTA buttons are styled as `.btn`, not plain nav links, so they don't participate in the active-underline treatment. This keeps the frontmatter consistent with the other page-detection booleans for any future use.)

- [ ] **Step 2: Repoint both "Audit gratuit" CTA buttons to `/audit`**

In `src/components/Header.astro`, there are two identical CTA blocks (desktop `.nav__links` and mobile `.nav__end`). Replace both in one edit using find-and-replace-all on this exact substring:

Find:
```
href="/contact" class="btn btn--ghost btn--sm">
          Audit gratuit
```

Replace with (both occurrences):
```
href="/audit" class="btn btn--ghost btn--sm">
          Audit gratuit
```

- [ ] **Step 3: Repoint Footer's "Audit gratuit" link**

In `src/components/Footer.astro`, find:

```astro
<li><a href="/contact">Audit gratuit</a></li>
```

Replace with:

```astro
<li><a href="/audit">Audit gratuit</a></li>
```

(The `<li><a href="/contact">Contact</a></li>` and `<li><a href="/contact">Formulaire de contact</a></li>` lines stay unchanged — they're plain contact links.)

- [ ] **Step 4: Verify in the dev server**

Run: `npm run dev` (or reuse an already-running instance)
Open `/` in a browser and confirm both "Audit gratuit" buttons in the header (desktop nav bar and, at a narrow viewport, the mobile menu) link to `/audit`, and the footer's "Audit gratuit" link does too, while "Contact" and "Formulaire de contact" still link to `/contact`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: point Header/Footer audit CTAs to /audit"
```

---

### Task 6: Update page-level CTAs (`index.astro`, `a-propos.astro`, and the 4 créations pages)

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/a-propos.astro`
- Modify: `src/pages/landing-page.astro`
- Modify: `src/pages/tunnel.astro`
- Modify: `src/pages/site-web.astro`
- Modify: `src/pages/saas.astro`

**Interfaces:**
- Consumes: route `/audit` (Task 3).

- [ ] **Step 1: `index.astro`**

Find:
```astro
<a href="/contact" class="btn">Réserver mon audit gratuit <span class="arr">→</span></a>
```

Replace with:
```astro
<a href="/audit" class="btn">Réserver mon audit gratuit <span class="arr">→</span></a>
```

- [ ] **Step 2: `a-propos.astro`**

Find:
```astro
<a href="/contact" class="btn">Démarrer un projet <span class="arr">→</span></a>
```

Replace with:
```astro
<a href="/audit" class="btn">Démarrer un projet <span class="arr">→</span></a>
```

Find:
```astro
<a href="/contact" class="btn">Demander mon audit gratuit <span class="arr">→</span></a>
```

Replace with:
```astro
<a href="/audit" class="btn">Demander mon audit gratuit <span class="arr">→</span></a>
```

- [ ] **Step 3: `landing-page.astro`, `tunnel.astro`, `site-web.astro`, `saas.astro`**

Each of these 4 files contains the identical CTA markup **twice** (once in the hero, once in the final section):

```astro
<a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```

In each of the 4 files, replace **both** occurrences with:

```astro
<a href="/audit" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/a-propos.astro src/pages/landing-page.astro src/pages/tunnel.astro src/pages/site-web.astro src/pages/saas.astro
git commit -m "feat: point project-starting CTAs to /audit across site pages"
```

---

### Task 7: Root reference files — `audit.html` (new) + `contact.html` (rewritten)

**Files:**
- Create: `audit.html` (copy of the current `contact.html`, with 3 targeted edits)
- Modify: `contact.html` (full rewrite, mirroring Task 4's new page)

**Interfaces:**
- Consumes: this project's established reference-file convention (self-contained `<style>`, text-logo nav, zero `<script>` tags, full document structure).

- [ ] **Step 1: Create `audit.html` from the current `contact.html`**

```bash
cp "contact.html" "audit.html"
```

- [ ] **Step 2: Edit `audit.html` — title**

In `audit.html`, find:
```html
<title>Contact — TalentDigital.net</title>
```
Replace with:
```html
<title>Audit gratuit — TalentDigital.net</title>
```

- [ ] **Step 3: Edit `audit.html` — nav "Contact" is no longer the active link**

In `audit.html`, find:
```html
<a href="/contact" class="is-active" aria-current="page">Contact</a>
```
Replace with:
```html
<a href="/contact">Contact</a>
```

- [ ] **Step 4: Edit `audit.html` — nav CTA now points to itself**

In `audit.html`, find:
```html
<a href="/contact" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```
Replace with:
```html
<a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```

- [ ] **Step 5: Replace the full contents of `contact.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Contact — TalentDigital.net</title>
<meta name="description" content="Une question, un projet ? Écrivez-nous à TalentDigital, réponse sous 24 h." />
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
.lede{color:var(--muted);max-width:48ch}
.btn{--bg:var(--lime);--fg:var(--void);--bd:var(--lime);display:inline-flex;align-items:center;gap:.6rem;background:var(--bg);color:var(--fg);font-family:var(--mono);font-weight:700;font-size:.85rem;letter-spacing:.02em;text-transform:uppercase;padding:.92rem 1.5rem;border:1px solid var(--bd);border-radius:3px}
.btn--ghost{--bg:transparent;--fg:var(--txt);--bd:var(--line-2)}
.nav{position:sticky;top:0;z-index:200;background:rgba(14,14,16,.92);border-bottom:1px solid var(--line)}
.nav__in{display:flex;align-items:center;justify-content:space-between;height:74px}
.brand{font-weight:900;font-size:1.45rem;letter-spacing:-.04em}
.nav__links{display:flex;align-items:center;gap:2rem;font-family:var(--mono);font-size:.8rem;text-transform:uppercase;color:var(--muted)}
.nav__links a{color:inherit}
.site-footer{border-top:1px solid var(--line);padding-block:3rem 2rem;background:var(--panel);font-size:.9rem;color:var(--muted)}

.hero-contact{padding-top:clamp(3rem,7vw,5.5rem);padding-bottom:clamp(2.5rem,5vw,4rem);border-bottom:1px solid rgba(199,247,62,.1);position:relative;overflow:hidden;background:linear-gradient(rgba(14,14,16,.86),rgba(14,14,16,.86)),url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&fit=crop') center/cover no-repeat}
.hero-contact__glow{position:absolute;top:-20%;right:-10%;width:600px;height:600px;background:radial-gradient(ellipse 60% 60% at 60% 40%,rgba(199,247,62,.05) 0%,transparent 65%);pointer-events:none}
.hero-contact>*:not(.hero-contact__glow){position:relative;z-index:1}
.hero-contact h1{font-size:clamp(2rem,4vw,3.6rem);font-weight:900;letter-spacing:-.03em;line-height:1.05;margin-top:.7rem}
.hero-contact h1 em{font-style:normal;color:var(--lime)}

.contact-section{padding-block:var(--section)}
.contact-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:start}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr;gap:3rem}}

.hp-field{position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden}

.contact-form{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:clamp(1.8rem,4vw,2.8rem)}
.form-title{font-size:1.35rem;font-weight:800;letter-spacing:-.02em;margin-bottom:1.8rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:600px){.form-row{grid-template-columns:1fr}}
.field{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.1rem}
.field label{font-family:var(--mono);font-size:.73rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.field label .req{color:var(--lime);margin-left:.15rem}
.field input,.field textarea{
  background:var(--panel-2);
  border:1px solid var(--line-2);
  border-radius:4px;
  color:var(--txt);
  font-family:var(--display);
  font-size:.95rem;
  padding:.85rem 1rem;
  width:100%;
  outline:none;
  -webkit-appearance:none;
}
.field textarea{resize:vertical;min-height:110px;line-height:1.6}
.form-agree{display:flex;align-items:flex-start;gap:.75rem;margin-top:.5rem;margin-bottom:1.4rem}
.form-agree input[type=checkbox]{width:18px;height:18px;min-width:18px;border:1px solid var(--line-2);border-radius:3px;background:var(--panel-2);accent-color:var(--lime);margin-top:.1rem}
.form-agree p{font-size:.82rem;color:var(--muted);line-height:1.55}
.form-agree a{color:var(--txt);text-decoration:underline;text-underline-offset:3px;opacity:.7}
.form-note{font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:1rem;text-align:center}
.btn--full{width:100%;justify-content:center}

.contact-side{display:flex;flex-direction:column;gap:1.6rem}
.side-card{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:1.6rem}
.side-card h3{font-size:1rem;font-weight:800;letter-spacing:-.01em;margin-bottom:1.1rem;display:flex;align-items:center;gap:.6rem}
.side-card h3 svg{color:var(--lime)}

.direct-links{display:flex;flex-direction:column;gap:.6rem;margin-top:.2rem}
.direct-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1px solid var(--line);border-radius:4px;font-size:.9rem}
.direct-link svg{color:var(--lime);flex-none}
.direct-link__lbl{font-size:.72rem;font-family:var(--mono);color:var(--muted);display:block;margin-top:.1rem}
@media (max-width:880px){.hero-contact__inner{grid-template-columns:1fr}}
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
        <a href="/contact" class="is-active" aria-current="page">Contact</a>
        <a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
      </div>
    </div>
  </nav>
</header>

<main>

<section class="hero-contact">
  <div class="hero-contact__glow"></div>
  <div class="wrap">
    <div class="prompt"><b>Contact</b></div>
    <h1>Contactez-<em>nous.</em></h1>
    <p class="lede" style="margin-top:1.2rem;max-width:56ch">
      Une question, un projet, une simple prise de contact ? Écrivez-nous, on vous répond sous 24 heures.
    </p>
  </div>
</section>

<section class="contact-section" aria-label="Formulaire de contact">
  <div class="wrap">
    <div class="contact-grid">

      <div>
        <div class="contact-form">
          <div class="form-fields">
            <div class="form-title">Envoyer un message</div>
            <form novalidate>
              <div class="hp-field" aria-hidden="true">
                <label for="td-website">Laissez ce champ vide</label>
                <input type="text" id="td-website" name="website" tabindex="-1" autocomplete="off">
              </div>
              <div class="field">
                <label for="td-prenom">Prénom <span class="req" aria-hidden="true">*</span></label>
                <input type="text" id="td-prenom" name="prenom" placeholder="Yassine" autocomplete="given-name" required>
              </div>
              <div class="form-row">
                <div class="field">
                  <label for="td-email">Email <span class="req" aria-hidden="true">*</span></label>
                  <input type="email" id="td-email" name="email" placeholder="vous@example.com" autocomplete="email" required>
                </div>
                <div class="field">
                  <label for="td-tel">Téléphone / WhatsApp</label>
                  <input type="tel" id="td-tel" name="tel" placeholder="+212 6XX XXX XXX" autocomplete="tel">
                </div>
              </div>
              <div class="field">
                <label for="td-message">Votre message <span class="req" aria-hidden="true">*</span></label>
                <textarea id="td-message" name="message" placeholder="Ex : Bonjour, j'ai une question sur..." required></textarea>
              </div>
              <div class="form-agree">
                <input type="checkbox" id="td-agree" name="agree" required>
                <p>J'accepte que mes données soient utilisées pour traiter ma demande et me contacter. <a href="#">Politique de confidentialité</a></p>
              </div>
              <button type="submit" class="btn btn--full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h14M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Envoyer le message
              </button>
              <p class="form-note">Réponse sous 24 h</p>
            </form>
          </div>
        </div>
      </div>

      <div class="contact-side">
        <div class="side-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
            Contact direct
          </h3>
          <div class="direct-links">
            <a href="mailto:info@talentdigital.net" class="direct-link">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M2 5l7 5.5L16 5"/></svg>
              <div>
                info@talentdigital.net
                <span class="direct-link__lbl">Email professionnel</span>
              </div>
            </a>
            <a href="https://wa.me/212663206266" class="direct-link" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 1.38.37 2.68 1.01 3.8L1.5 16.5l3.78-1.02A7.5 7.5 0 109 1.5z"/><path d="M6.5 6.5s.5 1 1.5 2 2 1.5 2 1.5l1-1 1.5 1.5s-.5 1.5-2 1.5C8 12 6 10 6 10S4 8 4 5.5l1.5-1L7 6l-.5.5z"/></svg>
              <div>
                WhatsApp
                <span class="direct-link__lbl">Réponse rapide</span>
              </div>
            </a>
          </div>
        </div>
      </div>

    </div>
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

- [ ] **Step 6: Commit**

```bash
git add audit.html contact.html
git commit -m "feat: add reference audit.html, rewrite reference contact.html"
```

---

### Task 8: Update remaining root reference `.html` files' links

**Files:**
- Modify: `a-propos.html`
- Modify: `home-page.html`
- Modify: `service-saas.html`
- Modify: `service-sites-web.html`
- Modify: `service-tunnels.html`
- Modify: `service-landing-pages.html`

**Interfaces:**
- Consumes: `/audit` (Task 7's `audit.html` is the reference mirror; the routes themselves come from Task 3).

- [ ] **Step 1: `a-propos.html`**

Find:
```html
<a href="/contact" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```
Replace with:
```html
<a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```

Find:
```html
<a href="/contact" class="btn">Démarrer un projet →</a>
```
Replace with:
```html
<a href="/audit" class="btn">Démarrer un projet →</a>
```

Find:
```html
<a href="/contact" class="btn">Demander mon audit gratuit →</a>
```
Replace with:
```html
<a href="/audit" class="btn">Demander mon audit gratuit →</a>
```

- [ ] **Step 2: `home-page.html`**

Find:
```html
<a href="/contact" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```
Replace with:
```html
<a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```

Find:
```html
<a href="/contact" class="btn">Réserver un audit gratuit →</a>
```
Replace with:
```html
<a href="/audit" class="btn">Réserver un audit gratuit →</a>
```

Find:
```html
<a href="/contact" class="btn">Réserver mon audit gratuit →</a>
```
Replace with:
```html
<a href="/audit" class="btn">Réserver mon audit gratuit →</a>
```

- [ ] **Step 3: `service-saas.html` and `service-sites-web.html`**

Both files share the same two patterns. In each file:

Find:
```html
<a href="/contact" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```
Replace with:
```html
<a href="/audit" class="btn btn--ghost" style="padding:.6rem 1.1rem;font-size:.78rem">Audit gratuit</a>
```

Then, since `<a href="/contact" class="btn">Démarrer ce projet →</a>` appears **twice** in each of these two files (hero + final section), replace **both** occurrences in each file with:
```html
<a href="/audit" class="btn">Démarrer ce projet →</a>
```

- [ ] **Step 4: `service-tunnels.html` and `service-landing-pages.html`**

Both files share the same two duplicated patterns. In each file, the audit CTA appears **twice** (desktop + mobile nav):

Find (both occurrences):
```html
<a href="/contact" class="btn btn--ghost btn--sm">Audit gratuit <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```
Replace both with:
```html
<a href="/audit" class="btn btn--ghost btn--sm">Audit gratuit <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```

And the "Démarrer ce projet" CTA also appears **twice** (hero + final section) in each file:

Find (both occurrences):
```html
<a href="/contact" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```
Replace both with:
```html
<a href="/audit" class="btn">Démarrer ce projet <svg class="arr" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
```

- [ ] **Step 5: Verify no stray `/contact` audit-intent links remain**

Run: `grep -rn 'href="/contact"' *.html`
Expected: only the plain "Contact" nav links and "Formulaire de contact" / "contact@talentdigital.net" style links remain — no "Audit gratuit", "Démarrer un/ce projet", or "Réserver ... audit" labeled link should still point to `/contact`.

- [ ] **Step 6: Commit**

```bash
git add a-propos.html home-page.html service-saas.html service-sites-web.html service-tunnels.html service-landing-pages.html
git commit -m "feat: point reference-file audit CTAs to /audit"
```

---

### Task 9: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (existing `contact.test.js`/`validate.test.js` tests plus the new `contact-general.test.js` tests and the 4 new `validate.test.js` tests from Task 1).

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: build succeeds; `dist/audit/index.html` and `dist/contact/index.html` both exist with distinct content.

- [ ] **Step 3: Manual smoke check in the dev server**

Run: `npm run dev`
- Open `/audit` — confirm it shows the full audit-request page (hero "Parlons de votre projet", form titled "Demande d'audit gratuit" with Service/Budget fields, "Ce qui se passe ensuite" sidebar, FAQ).
- Open `/contact` — confirm it shows the new minimal page (hero "Contactez-nous", form titled "Envoyer un message" with only Prénom/Email/Téléphone/Message, single "Contact direct" sidebar card, no FAQ).
- Click the header's "Audit gratuit" button (desktop) — confirm it navigates to `/audit`.
- Click the plain "Contact" nav link — confirm it navigates to `/contact`.
- Submit the `/contact` form with a real-looking payload and confirm the success state appears (network tab shows a POST to `/api/contact-general` returning `{ ok: true }` — actual Supabase/Resend delivery can only be confirmed once deployed, since local `npm run dev` doesn't run the `/api` serverless functions).

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

Expected: push succeeds; no conflicts.
