# Audit complet — talentdigital.net
**Date : 2026-07-05 · Périmètre : 9 pages (/, /landing-page, /tunnel, /site-web, /saas, /a-propos, /contact, /audit, /mentions-legales)**
**Méthode : inspection du code source (Astro), du build, et vérification navigateur. Charte graphique intacte — aucun problème de cohérence visuelle détecté entre les pages (tokens partagés via global.css).**

---

## Synthèse

| Sévérité | Trouvés | Corrigeables sans ambiguïté | Nécessitent une décision |
|---|---|---|---|
| Critique | 4 | 3 | 1 |
| Important | 9 | 8 | 1 |
| Mineur | 6 | 5 | 1 |

---

## CRITIQUES

### C1 — Aucun sitemap.xml ni robots.txt `[SEO · site entier]`
Le site n'a ni `robots.txt` ni `sitemap.xml` (l'intégration `@astrojs/sitemap` n'est pas installée). Google découvre les pages uniquement par crawl de liens — indexation lente et incomplète, et la Search Console (vérifiée via le fichier google82726…) ne peut pas recevoir de sitemap.
**Correction :** ajouter `@astrojs/sitemap` + `public/robots.txt` pointant vers le sitemap.

### C2 — Statistique client inventée sur /audit `[Contenu · /audit]`
`src/pages/audit.astro:242` (FAQ) : « 60 % de nos clients sont basés hors du Maroc ». Cette statistique n'est adossée à aucune donnée réelle — violation directe de la règle du projet (aucun chiffre client fabriqué). Elle survit de l'ancienne page contact.
**Correction :** reformuler honnêtement (« Nous travaillons avec des clients au Maroc comme à l'étranger — France, Belgique, Suisse, Canada, Afrique de l'Ouest… ») sans pourcentage inventé. Aussi présent dans `audit.html` (référence).

### C3 — Ligne de preuve dupliquée sur 3 pages service `[Contenu · /landing-page, /tunnel, /site-web]`
Le bandeau final de ces 3 pages affiche deux fois « Audit gratuit » : « Audit gratuit · plan d'action sous 48 h » ET « Audit gratuit · réponse sous 24 h » (lignes 156-157 de chaque fichier). Doublon visuel qui affaiblit la preuve.
**Correction :** fusionner en 2 lignes distinctes : « **Audit gratuit** · réponse sous 24 h » + « **Plan d'action** sous 48 h ».

### C4 — Aucune preuve sociale réelle disponible `[Contenu · site entier]` ⚠️ DÉCISION REQUISE
Aucun témoignage, étude de cas ni chiffre client sur tout le site. **Contrainte bloquante :** la règle absolue du projet interdit de fabriquer témoignages/statistiques, et l'activité n'a pas encore de références clients publiables. Le portfolio sectoriel (13 visuels) constitue la seule preuve visuelle réelle.
**Statut :** NON corrigeable sans données réelles fournies par le propriétaire. Documenté, pas de fabrication. Alternative appliquée : renforcer les engagements vérifiables (délais, garantie de révisions, processus) déjà présents.

---

## IMPORTANTS (SEO / AEO / GEO structurels)

### I1 — Aucun schema FAQPage `[AEO · /, /audit]`
La homepage a 5 questions FAQ bien formulées (style question directe — idéal AEO) et /audit en a 6, mais aucune n'a de balisage JSON-LD `FAQPage`. Featured snippets et réponses IA non captables.
**Correction :** ajouter `FAQPage` JSON-LD sur / et /audit, reprenant mot pour mot les Q/R existantes.

### I2 — Aucun schema Service sur les 4 pages prestation `[AEO · /landing-page, /tunnel, /site-web, /saas]`
**Correction :** ajouter un JSON-LD `Service` par page (nom, description, provider TalentDigital, areaServed, url canonique).

### I3 — Aucun schema Organization/ProfessionalService global `[AEO/GEO · site entier]`
Les zones desservies (Maroc, France, Belgique, Suisse, Canada) sont dans la FAQ mais pas en données structurées.
**Correction :** ajouter un JSON-LD `ProfessionalService` sur la homepage : nom, url, email, réseaux sociaux (sameAs : Facebook, Instagram, YouTube, Pinterest), areaServed, offres. Sans adresse postale ni note agrégée inventées.

### I4 — Incohérence de domaine dans les JSON-LD existants `[SEO · /contact, /audit]`
Les schemas ContactPage utilisent `https://www.talentdigital.net/...` alors que les canonicals (via `Astro.site`) sont `https://talentdigital.net/...`. Entité incohérente pour Google.
**Correction :** aligner tous les JSON-LD sur le domaine sans www.

### I5 — Un seul visuel OG pour tout le site `[SEO · site entier]` ⚠️ DÉCISION REQUISE
`og-default.png` unique. Chaque page devrait avoir son image de partage (titre du service visible).
**Correction proposée :** générer 8 images OG de plus (même style que l'existante : fond --void, logo, titre de page, accent lime) via script Python/PIL, + prop `ogImage` optionnelle dans BaseLayout. À valider avant génération.

### I6 — 13 images portfolio toutes en loading="eager" `[Performance · /]`
`index.astro:91` : les 13 images sectorielles chargent immédiatement, dont ~10 hors écran. Pénalise LCP et consomme la bande passante mobile inutilement.
**Correction :** `loading="eager"` sur les 3 premières (visibles), `loading="lazy"` sur les 10 suivantes.

### I7 — Images de fond distantes Unsplash `[Performance · /contact, /audit, global.css]`
3 fonds d'écran chargés depuis images.unsplash.com (dépendance externe, non optimisée, non garantie dans le temps, ~200-400 Ko chacun).
**Correction :** télécharger, compresser en WebP local (`public/`), remplacer les URL. Rendu visuel identique.

### I8 — Pas de llms.txt `[GEO · site entier]`
**Correction :** créer `public/llms.txt` : présentation concise du studio, services, zones, pages clés — format lisible par les crawlers IA.

### I9 — Google Analytics sans consentement `[Conformité · site entier]` — REPORTÉ (décision utilisateur)
GA se charge sans bannière de consentement pour les visiteurs UE. Déjà documenté dans le spec mentions-légales du 2026-07-05 : explicitement hors périmètre par décision utilisateur. Non corrigé ici, re-signalé pour mémoire.

---

## MINEURS

### M1 — Accordéons FAQ homepage sans aria-controls `[A11y · /]`
Les boutons `.acc__btn` ont `aria-expanded` mais pas de liaison `aria-controls`/`id` vers leurs panneaux (la FAQ de /audit, elle, est correcte).
**Correction :** ajouter les paires id/aria-controls.

### M2 — Titres h5 dans le footer `[A11y · composant Footer]`
Saut de niveau h2→h5. Impact faible.
**Correction :** passer les `<h5>` du footer en `<p class="...">` stylé identique (aucun changement visuel) ou h2 visually-neutral. Choix : garder le rendu, corriger la sémantique.

### M3 — og:image sans dimensions ni alt `[SEO · BaseLayout]`
**Correction :** ajouter `og:image:width` (1200), `og:image:height` (630), `og:image:alt`.

### M4 — BreadcrumbList absent `[AEO · pages service]`
Site plat (1 niveau), gain marginal mais gratuit.
**Correction :** ajouter `BreadcrumbList` (Accueil → Service) sur les 4 pages service.

### M5 — hreflang absent `[SEO · site entier]` — N/A pour l'instant
Une seule langue/locale. À ajouter uniquement si des versions par marché sont créées. Aucune action.

### M6 — FAQ à enrichir pour le GEO `[GEO · /]` ⚠️ DÉCISION REQUISE
Les 5 questions actuelles sont bonnes mais courtes face aux requêtes réelles posées aux IA (« combien coûte un tunnel de vente », « quelle différence entre landing page et site web », « tunnel de vente c'est quoi »). Ajouter 3-4 questions/réponses définitionnelles renforcerait la citabilité LLM.
**Correction proposée :** rédiger 3 Q/R supplémentaires honnêtes (définitions + fourchettes de prix déjà publiées sur /audit : 500 € landing, 1 500-3 500 € tunnel). À valider (ajout de contenu visible).

---

## Points vérifiés SANS problème
- H1 unique sur chacune des 9 pages ; hiérarchie H1→H2→H3 correcte dans le contenu principal.
- Meta title + description uniques et adaptés par page (aucune duplication inter-pages).
- Canonical correct sur chaque page (via Astro.site).
- URLs propres et cohérentes ; redirections 301 des anciennes URLs /creations/* en place (vercel.json).
- Alt text présents sur toutes les images de contenu (portfolio : « Site web pour {métier} »).
- Formulaires /contact et /audit : états d'erreur inline, honeypot anti-spam, états loading/succès, role=alert — complets.
- Skip-link « Aller au contenu », focus-visible stylé, prefers-reduced-motion respecté partout.
- Contraste : lime #C7F73E et txt #B8B8B2 sur fond #0E0E10 passent AA.
- Ton éditorial cohérent sur les 9 pages ; pas de chevauchement de contenu significatif entre les 4 pages service (livrables, processus et cibles distincts par page).
- Images portfolio : WebP générés par Astro, dimensions déclarées (pas de CLS).
- Maillage interne : nav 7 liens + footer + CTA croisés — correct pour un site de cette taille.
- Mentions légales honnêtes (pas de structure juridique inventée) ; liens Politique de confidentialité fonctionnels.

---

## Récapitulatif des corrections prévues (Phase 2)

**Priorité 1 (critique) :** C1 sitemap+robots · C2 stat inventée · C3 doublon preuve
**Priorité 2 (structurel) :** I1 FAQPage · I2 Service · I3 ProfessionalService · I4 domaine JSON-LD · I6 lazy loading · I7 fonds locaux · I8 llms.txt · M3 og:image meta · M4 breadcrumbs
**Priorité 3 (contenu, après validation) :** I5 OG par page · M6 FAQ enrichie
**Priorité 4 (mineur) :** M1 aria-controls · M2 sémantique footer
**Non corrigés (justifiés) :** C4 preuve sociale (aucune donnée réelle — fabrication interdite) · I9 consentement cookies (reporté par décision utilisateur) · M5 hreflang (mono-langue)

---

## Résultat final (Phase 3 — validation du 2026-07-05)

- **19 problèmes trouvés · 16 corrigés · 3 volontairement écartés** (C4, I9, M5 — justifications ci-dessus).
- Build Astro : **9 pages sans erreur**, sitemap-index.xml généré, robots.txt et llms.txt présents dans `dist/`.
- Tests : **14/14 passent**.
- JSON-LD : **11 blocs validés** (parse JSON strict, 0 erreur) — ProfessionalService + FAQPage (accueil), ContactPage + FAQPage (audit), ContactPage (contact), Service + BreadcrumbList (4 pages prestation).
- Performance : portfolio homepage 3 images eager / 10 lazy ; 3 fonds Unsplash distants remplacés par des WebP locaux (~193 Ko).
- Vérification navigateur : FAQ 8 questions fonctionnelle avec aria-controls, hero /contact sur fond local, footer sans h5, OG par page servie avec dimensions. **Charte graphique strictement inchangée.**
- Détail complet des changements : voir `changelog.md`.
