# TalentDigital.net — Phase 1 : Audit

Date : 14 novembre 2026
Périmètre : production `https://talentdigital.net` + dépôt `TalentDigital-Marketing` (branche `main`, commit `999f0d0`).
Méthode : lecture intégrale du code source, vérification des 10 URLs en production, en-têtes HTTP, poids des ressources, données structurées, formulaires, endpoints, configuration Vercel.

## Limites de l'audit

- PageSpeed Insights / Lighthouse : API publique en erreur 429 le 14/11/2026. Aucune mesure labo ni terrain fiable n'a pu être obtenue. Les constats de performance ci-dessous sont **déduits du code et du poids des ressources**, pas mesurés.
- Pas d'accès à Google Search Console, GA4, ni aux données de conversion. Impossible de conclure sur le trafic, les positions, les requêtes réelles et les taux de conversion.
- Les visuels du portfolio n'ont pas pu être inspectés visuellement (outil d'analyse d'image indisponible) : leur nature exacte (maquette, rendu IA, capture de projet réel) reste à confirmer par le propriétaire.

## 1. Identité actuelle

**Marque affichée** : « studio indépendant spécialisé en infrastructure de conversion numérique » (index.astro:36, a-propos.astro:5).

**Logo** : wordmark blanc transparent, 1608×434 px (`src/assets/logo-talentdigital.png`). Accent du logo ≈ **#95C804**. Le site utilise un vert plus clair, **#C7F73E** (`--lime`). Deux verts coexistent → écart de charte à trancher.

**Palette en production** (`src/styles/global.css:3-21`) :

| Token | Valeur | Usage |
|---|---|---|
| `--void` | `#0E0E10` | fond |
| `--panel` / `--panel-2` | `#151518` / `#1B1B1F` | cartes |
| `--line` / `--line-2` | `#27272D` / `#3A3A42` | bordures |
| `--txt` | `#B8B8B2` | texte |
| `--muted` | `#72727A` | texte secondaire |
| `--lime` | `#C7F73E` | accent |
| `--lime-dim` | `#9EC22F` | accent secondaire |

**Typographie** : Archivo (400 à 900, 6 graisses) + JetBrains Mono (400/500/700), chargées via Google Fonts (9 fichiers `@font-face`).

**Codes visuels** : fond quadrillé, libellés monospace préfixés `>`, sections numérotées `01 —`, panneaux « console » et « métriques », vocable technique (`audit_gratuit`, `délai_livraison`, `système opérationnel`).

**Ton** : direct, performatif, orienté exécution — « Des sites et tunnels conçus pour convertir, pas pour décorer », « machines à convertir », « 7 jours, pas 7 semaines ».

**Diagnostic identité** : système visuel cohérent, mémorable et différenciant, mais qui raconte une **identité de studio de production technique / growth hacking**, pas une identité de **conseil marketing**. Un dirigeant de PME non technique y lit « prestataire web », pas « partenaire stratégique ».

## 2. Inventaire technique

| Élément | Constat |
|---|---|
| Framework | **Astro 7.0.6**, sortie statique |
| Hébergement | Vercel (HSTS actif, cache edge CDN) |
| Pages générées | 11 (dont 404). 10 URLs dans le sitemap |
| Fonctions serverless | `api/contact.js`, `api/contact-general.js` (+ `api/_validate.js`) |
| Base de données | Supabase, table `contact_submissions` |
| Email transactionnel | Resend |
| Analytics | GA4 `G-62J5D8NLMW` + Vercel Analytics |
| Vérifications | Google Search Console, Pinterest |
| Sitemap | `@astrojs/sitemap` → `/sitemap-index.xml` |
| CSS | 2 fichiers : 21 404 o (base) + 11 214 o (accueil) |
| HTML accueil | 38 258 o |
| Images portfolio | 14 visuels WebP, 27,8 à 44,2 Ko chacun (10 en `lazy`) |
| JS | 2 à 3 scripts inline par page (nav, reveal, accordéons) |
| Tests | 3 fichiers, formulaires + validation |

**Anomalie bloquante** : `npm run build` échoue en local — `ERR_DLOPEN_FAILED` sur le binding natif `rolldown` (Node 24.14.1 / npm 11.21.2, `rolldown@1.1.4`). Impossible de builder, prévisualiser ou tester localement en l'état. À corriger avant toute intervention.

**Écart production / dépôt** : les titres en ligne utilisent un tiret cadratin (« À propos — TalentDigital ») alors que le dépôt contient un trait d'union (« À propos - TalentDigital ») sur **toutes** les pages. Le dernier déploiement date du **13/11/2026 10:17** alors que le dernier commit poussé est du **10/07/2026**. Il existe donc des modifications non versionnées (ou un autre canal de déploiement). À clarifier avant de toucher au code.

**Bug confirmé** : la balise `<title>` de l'accueil contient `&amp;amp;` en dur → l'onglet du navigateur affiche littéralement « &amp; ».

**En-têtes de sécurité** : `vercel.json` ne contient que 5 redirections. Aucune CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

**Polices** : `@import` Google Fonts en première ligne de `global.css` → chaîne bloquante CSS → fonts.googleapis.com → fonts.gstatic.com, sans `preconnect`, 9 fichiers de police à télécharger.

## 3. Contenu et arborescence

Arborescence actuelle :

```
/                     Accueil
/landing-page         Landing pages
/tunnel               Tunnels de vente
/site-web             Sites web pro
/saas                 SaaS sur mesure
/a-propos             À propos
/contact              Contact
/audit                Audit gratuit 30 min (formulaire)
/audit-tunnel         Auto-diagnostic 15 points (quiz)
/mentions-legales     Mentions légales + confidentialité
/404
```

**Écarts majeurs avec le brief stratégique** :

1. Aucune page **consulting marketing**, **stratégie marketing**, **acquisition clients**, **SEO**, **publicité digitale**, **email marketing**, **automatisation marketing**, **marketing digital Maroc**.
2. Aucun **blog** ni espace ressources.
3. Les 4 pages prestation sont toutes des prestations **d'exécution** (landing, tunnel, site, SaaS). Le pôle conseil — qui doit porter le positionnement — est absent.
4. Le SaaS ne figure pas dans les 3 pôles du brief.
5. La signature « Stratégie. Marketing. Transformation digitale. » et la mention « Marketing Consulting & Digital Solutions » n'existent nulle part.

**Incohérences de positionnement dans le copy** :

| Fichier | Ligne | Problème |
|---|---|---|
| `audit.astro` | 47 | « **Notre équipe** revient vers vous » → suggère une équipe constituée |
| `a-propos.astro` | 10, 61 | « studio », « notre studio » |
| `a-propos.astro` | 43 | « Nous ne fabriquons pas de beaux sites. Nous construisons des **machines à convertir** » |
| `a-propos.astro` | 13 | Bouton « Voir **nos créations** » → suggère un portfolio client réel |
| `index.astro` | 79 | 14 visuels sectoriels présentés en portfolio |
| `index.astro` | 36 | Description « Studio indépendant » |

Les mentions légales sont, elles, **honnêtes** : elles déclarent explicitement l'absence d'immatriculation (mentions-legales.astro:19). Cette cohérence doit être conservée et propagée partout.

**Promesses chiffrées à valider** (aucune preuve disponible dans le dépôt) : « PageSpeed 90+ », « LCP sous 2,5 s », « livraison 7 jours », « taux d'efficacité mesuré », prix publics 500 € / 1 500–3 500 €.

## 4. SEO / AEO / GEO

**Acquis solides** :

- `robots.txt` + sitemap-index valides, 10 URLs.
- Canonicals auto-générés, cohérents avec le sitemap (slash final identique).
- Titles et meta descriptions uniques sur les 10 pages.
- Un seul H1 par page, hiérarchie H2/H3 globalement propre.
- Images WebP responsives avec `alt`.
- JSON-LD : `ProfessionalService` (accueil), `FAQPage` (accueil 8 Q/R, /audit 6 Q/R), `Service` + `BreadcrumbList` (4 pages prestation), `WebPage` + `BreadcrumbList` (/audit-tunnel).
- `llms.txt` présent.
- `lang="fr"`, viewport, `color-scheme`.

**Manques** :

- Zéro couverture des intentions commerciales du nouveau positionnement (voir §3).
- Aucune grappe de contenu : pas de blog, pas d'articles piliers, donc peu de surface pour Google et pour les moteurs de réponse IA.
- `llms.txt` et JSON-LD décrivent encore « studio indépendant » et 4 prestations d'exécution → à réécrire.
- `BreadcrumbList` déclaré sans fil d'Ariane visible sur les pages concernées → incohérence signalée par Google.
- Titles faibles sur les pages prestation : « Sites web pro », « SaaS sur mesure », « Landing pages haute conversion » (pas de bénéfice ni de zone géographique).
- Aucune optimisation géographique (« Maroc », « Casablanca », « Rabat »…) alors que c'est un axe du brief.
- Deux pages se disputent l'intention « audit gratuit » : `/audit` et `/audit-tunnel` (cannibalisation).
- Contenu essentiellement promotionnel : peu de réponses directes sourcées, peu de définitions, peu de pédagogie — donc peu citable par les IA.

## 5. UX / UI et accessibilité

**Points forts** : hiérarchie visuelle nette, espacements généreux, composants cohérents, skip-link, accordéons conformes (`aria-expanded` / `aria-controls`), labels de formulaire explicites, états `aria-live` sur les succès, `prefers-reduced-motion` géré.

**Problèmes** :

| Sévérité | Constat | Référence |
|---|---|---|
| Majeur | Contraste `--muted #72727A` sur `--void #0E0E10` = **4,05:1** < 4,5:1 (WCAG AA texte courant). Utilisé pour `.lede`, `.prompt`, paragraphes légaux | global.css:10, 57-68 |
| Majeur | Deux CTA primaires concurrents « Audit gratuit » pointant vers **deux pages différentes** | Header.astro:31,38 → `/audit-tunnel` ; Footer.astro:53 → `/audit` |
| Moyen | 10 liens internes vers `/audit`, 10 vers `/audit-tunnel` : parcours volontairement scindé mais message identique → l'utilisateur ne sait pas ce qu'il obtient | global |
| Moyen | H1 avec `<br>` collé : « Parlons de**votre** projet », « Pas un prestataire.**Un** partenaire » → restitution lecteur d'écran | audit.astro:13, a-propos.astro:9 |
| Moyen | Aucun style `:focus-visible` sur les liens de navigation | Header.astro |
| Moyen | Navigation à 7 entrées + CTA, en monospace 0,76 rem, qui expose l'exécution et pas les pôles | Header.astro:23-34 |
| Faible | Densité de signaux « tech » (mono, `>`, console, métriques) → charge cognitive pour un dirigeant non technique | global |
| Faible | Un seul breakpoint (880 px) ; à vérifier sur 320–400 px | Header.astro:67 |

**Parcours homepage** : hero → portfolio sectoriel → « pour qui » → 4 services → processus → FAQ → CTA. Il manque la **problématique client** en ouverture et une **méthode en 4 étapes** distincte du simple délai de livraison.

## 6. Conversion et tracking

**Ce qui fonctionne** : 3 parcours de contact, honeypot anti-spam, validation serveur, double persistance (Supabase + email Resend), messages d'erreur explicites, mention « sans engagement ».

**Ce qui ne fonctionne pas** :

1. **`/audit-tunnel` ne capture aucun lead.** Le quiz de 15 points calcule un score côté client, propose un PDF statique, et ne demande ni email ni enregistrement. C'est un aimant à leads qui ne génère aucun contact (audit-tunnel.astro:105-142).
2. **GA4 ne suit aucune conversion.** Un seul `gtag('event')` dans tout le code ; aucune soumission de formulaire, aucun clic CTA, aucun téléchargement PDF n'est mesuré. Impossible d'attribuer les demandes à une source.
3. **Le formulaire `/audit` propose l'ancienne offre** (tunnel, landing, site web, SaaS) → incohérent avec le nouveau positionnement (audit.astro:84-88).
4. **Deux audits concurrents** brouillent la promesse : appel de 30 min vs auto-diagnostic de 15 min.
5. **Aucun consentement cookies** alors que GA4 est chargé inconditionnellement (BaseLayout.astro:49) → non conforme pour un public FR/BE/CH.
6. **Aucune réassurance de substitution** à la preuve sociale : ni méthodologie détaillée, ni livrables types, ni engagements contractuels affichés.

## 7. Conformité et risques

| Risque | Détail |
|---|---|
| RGPD / cookies | GA4 déposé sans consentement préalable ; public cible France, Belgique, Suisse |
| Sous-traitants | Les mentions légales affirment que les données ne sont accessibles qu'à TalentDigital, alors qu'elles transitent par Supabase et Resend (mentions-legales.astro:48) |
| Allégations | « PageSpeed 90+ », « LCP < 2,5 s », délais de livraison, prix : vérifiables et opposables |
| Portfolio | 14 visuels sans mention « exemples / maquettes » + bouton « Voir nos créations » → risque de laisser croire à des références clients |
| Statut | Mentions légales conformes à la réalité (pas de société) → à ne pas dégrader |

## 8. Synthèse

**Forces à capitaliser** : identité visuelle distinctive et cohérente ; stack rapide et bien choisie ; socle SEO technique au-dessus de la moyenne ; formulaires robustes ; honnêteté des mentions légales ; ton direct.

**Faiblesse centrale** : le site est excellent pour vendre **de l'exécution** (tunnels, pages, sites) à des **infopreneurs francophones**, et inadapté pour vendre du **conseil marketing** à des **PME et entreprises de services au Maroc et à l'international**. Ce n'est pas un problème de design : c'est un problème de positionnement, d'arborescence et de preuve.

**Écart en une phrase** : la marque dit « voici ce que je fabrique », le brief demande « voici le problème que je résous et la transformation que je produis ».

## 9. Priorisation

**P0 — bloquant avant toute refonte**
1. Réparer le build local (`npm ci` propre, ou pin Node 22).
2. Clarifier le canal de déploiement et resynchroniser production ↔ dépôt.
3. Trancher le positionnement et le vocabulaire (« studio » → « consulting & solutions », « nous » de marque sans « notre équipe »).
4. Décider du sort de `/audit` vs `/audit-tunnel`.
5. Valider les allégations chiffrées conservées.

**P1 — structurel**
6. Nouvelle arborescence : `/consulting-marketing`, `/marketing-digital`, `/solutions-digitales`, `/blog`, pages pôles + pages services.
7. Réécriture complète du copy (accueil + 3 pôles + à propos + contact).
8. Recapitalisation SEO : titles, H1, JSON-LD, `llms.txt`, maillage, breadcrumbs visibles.
9. CTA uniques : « Discutons de votre projet » / « Découvrir nos expertises ».
10. Requalification honnête du portfolio.

**P2 — performance, conformité, mesure**
11. Polices auto-hébergées + `preconnect`, suppression de l'`@import`.
12. Contraste `--muted`, focus visibles, correction des H1.
13. Bandeau de consentement + mise à jour des mentions légales (sous-traitants, durée de conservation).
14. En-têtes de sécurité dans `vercel.json`.
15. Événements GA4 : `form_submit`, `cta_click`, `pdf_download`, `quiz_complete`.
16. Capture d'email sur l'aimant à leads.

## 10. Décisions demandées avant la phase 2

1. **URLs des prestations existantes** : conserver `/landing-page`, `/tunnel`, `/site-web`, `/saas` telles quelles et les rattacher à `/solutions-digitales` (recommandé, préserve le SEO) — ou les migrer en sous-chemins avec redirections 301 ?
2. **SaaS** : conserver comme offre de développement sur mesure, ou retirer du périmètre ?
3. **Voix éditoriale** : « TalentDigital » + « nous » de marque (sans « notre équipe »), ou passage au « je » assumé du fondateur ?
4. **Prix publics** : conserver les fourchettes indicatives actuelles, ou basculer en « devis après audit » ?
5. **Blog** : lancement avec 3 articles piliers rédigés en phase 4, ou mise en place technique seule avec ligne éditoriale ?
6. **Langue** : FR seul en v1, ou FR + EN dès la refonte ?
7. **Bandeau cookies** : mise en place immédiate (obligatoire pour FR/BE/CH) — confirmation ?
