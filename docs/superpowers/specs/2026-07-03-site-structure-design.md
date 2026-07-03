# TalentDigital — Design de la structure du site (migration Vercel)

Date : 2026-07-03

## Contexte

Le site TalentDigital.net est actuellement hébergé sur Systeme.io sous forme
de fragments HTML (sans `<html>`/`<head>` propres) collés dans l'éditeur de
la plateforme. Motivation de la migration : le widget formulaire et
l'automatisation intégrés à l'éditeur Systeme.io posent problème (rigides,
peu fiables). Le formulaire de contact actuel (`contact-sio.html`) est un
mock — il ne fait qu'un `setTimeout`, aucune soumission réelle n'est
envoyée.

Décision : migrer l'hébergement vers Vercel tout en gardant Systeme.io comme
moteur d'automatisation (campagnes, tags, séquences existantes), via son
API plutôt que via son éditeur de page.

## Sitemap

- `/` — Accueil
- `/creations` — Vue d'ensemble des prestations
  - `/creations/landing-page`
  - `/creations/tunnel`
  - `/creations/site-web`
  - `/creations/saas` — développement de SaaS sur mesure pour clients.
    Aucun contenu existant : page à rédiger entièrement.
- `/a-propos`
- `/contact`

Hors périmètre (contenu existant mais non repris dans la migration) :
`service-branding.html`, `service-content-social.html`,
`service-email-marketing.html`.

## Navigation

`[Logo] — Créations (menu déroulant vers les 4 sous-pages) — À propos — [Bouton] Audit gratuit`

- Pas d'item "Accueil" séparé : le logo sert de lien retour.
- Nav fixe (sticky) au scroll pour garder le CTA visible en permanence.
- Le CTA n'est pas un lien texte parmi d'autres : c'est le bouton `.btn`
  existant (fond lime), avec le libellé orienté résultat "Audit gratuit"
  plutôt que "Contact".

## Structure technique

Framework retenu : **Astro**.

Raisons : layout partagé natif (header/nav/footer/CSS de base écrits une
fois, réutilisés sur toutes les pages — élimine la duplication actuelle sur
8 fichiers), zéro JS envoyé au visiteur par défaut, déploiement Vercel
natif sans configuration particulière. Gratuit et open-source.

## Formulaire de contact

La page `/contact` garde son formulaire actuel (champs, validation), mais
la soumission appelle une route API (fonction serverless Vercel) qui
transmet les données à l'API Systeme.io côté serveur — la clé API
Systeme.io reste en variable d'environnement, jamais exposée côté client.
Remplace le mock `setTimeout` existant. Les automatisations/tags/séquences
Systeme.io déjà configurées restent utilisées telles quelles.

## Assets

Nouveau logo disponible dans `logo talentdigital/` (plusieurs variantes
fond transparent / fond blanc / fond noir, couleurs T blanc + D lime ou T
noir + D lime). Choix retenu pour la nav (fond sombre du site) : la
variante fond transparent, T blanc + D lime — **non encore appliquée**,
décision à confirmer avant intégration.

## Hors périmètre de ce document

- Choix définitif et intégration du logo.
- Contenu détaillé de la page `/creations/saas`.
- Choix de l'outil de stockage des leads si une alternative à l'API
  Systeme.io est envisagée plus tard (Supabase + Sender avait été discuté
  comme option de repli, mais l'approche retenue reste Systeme.io via API).
