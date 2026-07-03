# TalentDigital — Pages Créations (vue d'ensemble + 4 prestations)

Date : 2026-07-03

## Contexte

Le site Astro a actuellement une page d'accueil fonctionnelle mais le menu
"Créations" (`Header.astro`) pointe vers 4 URLs qui n'existent pas encore :
`/creations`, `/creations/landing-page`, `/creations/tunnel`,
`/creations/site-web`, `/creations/saas`. Le contenu de 3 des 4 prestations
existe déjà dans l'ancien site (`service-tunnels.html`,
`service-landing-pages.html`, `service-sites-web.html`), avec un patron
visuel identique entre elles. La prestation SaaS n'a aucun contenu existant.

## Routes

- `src/pages/creations/index.astro` — vue d'ensemble, 4 cartes
- `src/pages/creations/tunnel.astro`
- `src/pages/creations/landing-page.astro`
- `src/pages/creations/site-web.astro`
- `src/pages/creations/saas.astro`

## Structure technique

Les fichiers legacy (`service-tunnels.html` etc.) partagent un patron
identique, ligne pour ligne en CSS : hero avec icône/titre/stats
(`.svc-hero`, `.stats-panel`), grille de livrables (`.deliver-grid`),
audience (`.who-grid`), processus en 4 étapes (`.process-grid`/`.ps`),
témoignage chiffré (`.result-box`), CTA final (`.final`, déjà présent dans
`global.css`).

Ces classes partagées sont ajoutées à `src/styles/global.css` (même
traitement que `.btn`/`.card` dans le plan précédent) plutôt que dupliquées
dans 5 fichiers de page. Chaque page `.astro` ne contient que son contenu
propre et n'a pas besoin de `<style>` supplémentaire pour ces sections.

La page de vue d'ensemble réutilise le patron `.svc-card` de l'ancien
`services.html` (icône/titre/description/liste de livrables/méta
délai+résultat), également ajouté à `global.css`.

## Contenu

**Tunnel, Landing page, Site web** : contenu repris tel quel des fichiers
`service-tunnels.html`, `service-landing-pages.html`,
`service-sites-web.html` (hero, livrables, pour qui, processus, témoignage,
CTA). Seuls changent : les liens internes (absolus `talentdigital.net/...`
→ relatifs `/contact`, `/creations`), le retrait du nav/footer/logo dupliqués
(gérés par `Header`/`Footer`), et l'intégration dans `BaseLayout`.

**SaaS** : aucun contenu existant. Rédigé sur le même patron (hero avec
icône/stats, 6 livrables, 3 cartes "pour qui", processus en 4 étapes,
1 témoignage chiffré, CTA final) avec un contenu générique mais crédible
pour du développement logiciel sur mesure. Marqué comme premier jet à
valider/corriger après implémentation — pas de faits ou chiffres inventés
présentés comme vérifiés (le témoignage sera explicitement fictif/exemple
tant qu'un vrai cas client n'est pas fourni).

**Vue d'ensemble `/creations`** : grille de 4 cartes (Tunnel, Landing page,
Site web, SaaS), chacune liée à sa page de détail, avec icône, titre,
description courte, 3-4 livrables clés et méta délai/résultat — cohérent
avec le patron des 4 pages de détail.

## Hors périmètre

- Contenu détaillé définitif de la page SaaS (premier jet à valider).
- Les autres prestations de l'ancien site (branding, content social, email
  marketing) — hors du sitemap retenu, non migrées.
- Page À propos et page Contact + API Systeme.io — chantiers séparés.
