# Changelog — Optimisation SEO/AEO/GEO du 2026-07-05

Référence : `audit-report.md` (identifiants C/I/M). Charte graphique inchangée sur toutes les corrections.

## Critiques
- **C1** — Ajout de `@astrojs/sitemap` (sitemap-index.xml généré au build) et de `public/robots.txt` le référençant. *Pourquoi : sans sitemap ni robots, l'indexation Google est lente et la Search Console ne peut pas recevoir le plan du site.*
- **C2** — `/audit` (+ `audit.html`) : la statistique inventée « 60 % de nos clients sont basés hors du Maroc » remplacée par une formulation honnête sans pourcentage. *Pourquoi : aucun chiffre client fabriqué (règle du projet).*
- **C3** — `/landing-page`, `/tunnel`, `/site-web` (+ leurs 3 fichiers de référence) : le bandeau final répétait deux fois « Audit gratuit » ; fusionné en « Audit gratuit · réponse sous 24 h » + « Plan d'action sous 48 h ».

## SEO / AEO / GEO structurels
- **I1** — Schema JSON-LD `FAQPage` ajouté sur `/` (8 Q/R) et `/audit` (6 Q/R), reprenant mot pour mot le contenu visible. *Pourquoi : featured snippets + réponses IA.*
- **I2 + M4** — Schema `Service` + `BreadcrumbList` ajoutés sur les 4 pages prestation (nom, description, provider, areaServed MA/FR/BE/CH/CA, fil d'Ariane Accueil → Service).
- **I3** — Schema `ProfessionalService` ajouté sur la homepage : identité, email, téléphone, sameAs (Facebook, Instagram, YouTube, Pinterest), zones desservies, 4 offres liées. *Sans adresse postale ni note inventées.*
- **I4** — JSON-LD de `/contact` et `/audit` : domaine aligné sur `https://talentdigital.net` (sans www) pour correspondre aux canonicals ; nom du schema `/audit` corrigé en « Audit gratuit — TalentDigital ».
- **I5** — 8 images OG spécifiques générées (1200×630, style identique à og-default : fond void, grille subtile, logo, titre accentué lime) + prop `ogImage` dans BaseLayout, branchée sur les 8 pages. La homepage garde og-default.png.
- **I6** — Portfolio homepage : seules les 3 premières images restent en `loading="eager"`, les 10 suivantes passent en `lazy`. *Pourquoi : LCP et bande passante mobile.*
- **I7** — Les 3 fonds d'écran Unsplash distants (hero contact/audit, bande processus) téléchargés, convertis en WebP local (~193 Ko chacun) : `public/bg-contact-hero.webp`, `public/bg-process.webp`. Références mises à jour dans `contact.astro`, `audit.astro`, `global.css`, `contact.html`, `audit.html`. *Pourquoi : dépendance externe supprimée, chargement contrôlé.*
- **I8** — `public/llms.txt` créé : présentation, services, tarifs indicatifs publics, processus, pages, contact. *Pourquoi : indexation par les crawlers IA (ChatGPT, Perplexity, Claude).*
- **M3** — BaseLayout : ajout `og:image:width` (1200), `og:image:height` (630), `og:image:alt`.

## Contenu
- **M6** — 3 Q/R ajoutées en tête de la FAQ homepage (+ `home-page.html`) : définition du tunnel de vente, landing page vs site web, fourchettes de prix (reprend uniquement les tarifs déjà publiés sur /audit). Intégrées au schema FAQPage.

## Design / accessibilité (mineurs)
- **M1** — FAQ homepage : paires `aria-controls`/`id` ajoutées sur les 8 accordéons.
- **M2** — Footer : les `<h5>` de colonnes remplacés par `<p class="foot__h">` avec style strictement identique (correction du saut de niveau de titres, zéro changement visuel).

## Non corrigés (justifiés)
- **C4** — Preuve sociale : aucune donnée client réelle disponible ; fabrication interdite. À ajouter dès que de vrais témoignages/résultats existent.
- **I9** — Consentement cookies (Google Analytics) : reporté par décision utilisateur (spec mentions-légales du 2026-07-05).
- **M5** — hreflang : sans objet tant que le site est mono-langue.
