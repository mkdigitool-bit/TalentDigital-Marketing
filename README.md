# TalentDigital — site vitrine

Site de conseil marketing de TalentDigital, construit avec [Astro](https://astro.build).
Publication automatique sur <https://talentdigital.net> à chaque push sur `main` (Vercel).

## Commandes

```bash
npm install        # dépendances
npm run dev        # serveur local (http://localhost:4321)
npm run build      # génère dist/
npm run preview    # prévisualise dist/
npm test           # tests des routes API de contact (14 tests)
node tools/check-links.mjs   # vérifie les liens internes du build
```

## Structure

```
src/
  assets/          images sources (logo, portfolio) optimisées au build
  components/      Header (thème clair/sombre), Footer, Cta, Faq, Breadcrumbs…
  data/            contenu partagé : navigation, offres, images OG
  layouts/         BaseLayout : <head>, SEO, JSON-LD, script anti-flash du thème
  pages/           1 fichier = 1 page (19 pages)
  styles/          global.css (tokens des 2 thèmes), v2.css (composants), fonts.css
public/            fichiers servis tels quels (OG, favicons, polices, robots.txt, llms.txt)
api/               fonctions serverless : formulaires de contact (Resend + Supabase)
tests/             tests Node des routes API
tools/             scripts d'audit, de liens et de génération d'images OG
docs/              documentation projet (audits, stratégie, plans)
```

## Thème

Le site est sombre par défaut. La bascule clair/sombre est dans le header
(`data-theme` sur `<html>`, préférence stockée dans `localStorage` sous `td-theme`).
Les couleurs passent toutes par les tokens de `src/styles/global.css`.

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les clés nécessaires au formulaire
de contact. Les variables sont à définir dans Vercel pour la production.
