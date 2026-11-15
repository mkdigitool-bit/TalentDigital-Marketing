# TalentDigital — Phase 3 : Architecture du site et briefs de contenu

> **Statut** : livrable de phase 3, produit le 15 novembre 2026.
> **Périmètre** : architecture des URL, navigation, briefs de contenu page par page, maillage interne, données structurées, mesure, conformité, checklist de lancement.
> **Amont** : `docs/audit/2026-11-14-phase1-audit.md` (constats et priorités) et `docs/strategy/2026-11-14-phase2-strategy.md` (positionnement, 3 pôles, voix).
> **Aval** : implémentation Astro déjà réalisée dans `src/` — ce document décrit ce qui est construit et ce qui reste à trancher.

---

## 0. Résumé

### 0.1 Ce que ce document décide

| Sujet | Décision |
|---|---|
| Structure | 3 pôles + 1 page méthode + 3 offres d'entrée, une page par intention. |
| Profondeur | 2 niveaux maximum sous l'accueil, sauf articles de blog (niveau 3). |
| URL | Slugs français, sans `/services/`, sans date dans les chemins. |
| Continuité SEO | Anciennes URL `/creations/*` conservées et redirigées en 301. |
| Conversion | Un CTA principal unique — « Discutons de votre projet » → `/contact` — et un CTA secondaire contextuel → `/audit`. |
| Preuve | Aucun témoignage, aucun chiffre de résultat, aucun prix numérique affiché. La preuve est la méthode, les livrables nommés et le périmètre écrit. |
| Offres | `/audit` (mission facturée) et `/audit-tunnel` (auto-diagnostic gratuit) restent **deux pages distinctes**, jamais fusionnées. |

### 0.2 État réel de l'implémentation

Le build Astro produit **19 pages** (18 URL indexables + `404`), sans erreur. Le contenu de cet
document est donc une **spécification rétro-documentée** de ce qui existe, complétée par ce qui
reste à faire.

| Élément | État |
|---|---|
| 16 pages de contenu + 3 articles + 404 | écrites et buildées |
| `src/data/site.ts` (source unique de vérité) | en place |
| Fil d'Ariane sur toutes les pages internes | en place |
| JSON-LD `ProfessionalService` (global) + `Service` (`/audit`) | en place |
| Consentement GA4 avant chargement | en place |
| `llms.txt`, `robots.txt`, `sitemap` | en place |
| Redirections 301 `/creations/*`, `/services/*` | en place dans `vercel.json` |
| En-têtes de sécurité + CSP | en place |
| Prix affichés | **aucun** — voir §15.1 |
| Pages légales | écrites, statut non-immatriculé assumé |

---

## 1. Règles d'architecture

Six règles ont guidé la structure. Elles servent d'arbitrage pour toute page future.

1. **Une page = une intention de recherche.** Si deux pages répondent à la même question, l'une
   des deux est supprimée ou redirigée. Pas de page « satellite » créée pour le SEO.
2. **Le conseil avant l'exécution.** L'ordre de navigation reflète l'ordre de vente :
   consulting → marketing digital → solutions digitales. Un visiteur qui cherche « site web »
   trouve la page, mais il est d'abord exposé au fait qu'on ne construit pas sans diagnostic.
3. **Le blog est une ressource, pas une machine à trafic.** Trois articles longs et utiles valent
   mieux que trente articles courts. Chaque article est relié à une page d'offre.
4. **Aucune page orpheline.** Toute page est atteignable en deux clics depuis l'accueil et figure
   dans le pied de page ou dans le maillage d'un article.
5. **L'URL ne promet rien qu'on ne tienne.** Pas de `/garantie-resultats`, pas de
   `/7-jours-pas-7-semaines`. Les slugs décrivent un métier, pas une promesse.
6. **Le contenu légal est une page de contenu.** `mentions-legales` n'est pas une page poubelle :
   elle porte la transparence sur le statut, les sous-traitants et la mesure — trois éléments de
   crédibilité.

---

## 2. Arborescence

```
/                                   Accueil — la thèse et le choix entre les 3 pôles
│
├── /consulting-marketing           Pôle 1 — décider (priorité de vente)
│   └── /audit                      Offre d'entrée facturée : audit marketing & digital
│
├── /marketing-digital              Pôle 2 — installer l'acquisition
│
├── /solutions-digitales            Pôle 3 — rendre exécutable (hub)
│   ├── /site-web                   Site web / e-commerce
│   ├── /landing-page               Landing page / page de vente
│   ├── /tunnel                     Tunnel de vente
│   │   └── /audit-tunnel           Outil gratuit : auto-diagnostic 15 points
│   └── /saas                       SaaS et outils sur mesure
│
├── /methode                        La méthode en 4 étapes (page de réassurance)
├── /a-propos                       Qui parle, dans quel cadre, ce qu'on refuse
├── /contact                        CTA final — un seul formulaire général
├── /mentions-legales               Légal + confidentialité + cookies
├── /404
│
└── /blog                           Ressources
    ├── /blog/audit-marketing-ce-quil-doit-contenir
    ├── /blog/seo-ou-publicite-comment-choisir
    └── /blog/refaire-son-site-probleme-de-conversion
```

**Note sur l'imbrication** : `/audit` est rattachée conceptuellement au pôle consulting et
`/audit-tunnel` au pôle solutions, mais leurs URL restent à la racine. C'est volontaire —
`/audit` est un point d'entrée commercial, pas une sous-page de `/consulting-marketing`.

---

## 3. Table des URL

| # | URL | Titre (`<title>`) | Rôle | Intention visée | CTA primaire |
|---|---|---|---|---|---|
| 1 | `/` | TalentDigital — Conseil marketing et solutions digitales pour PME | Poser la thèse et router vers un pôle | marque + « conseil marketing » | `/contact` |
| 2 | `/consulting-marketing` | Consulting marketing pour PME — audit, stratégie, plan d'action | Vendre la décision | consultant / consulting marketing PME | `/audit` |
| 3 | `/audit` | Audit marketing et digital — savoir ce qui produit, ce qui coûte | Vendre l'audit | audit marketing, diagnostic digital | formulaire `#demande` |
| 4 | `/marketing-digital` | Marketing digital — SEO, publicité, contenu, email, conversion | Vendre les canaux | agence marketing digital, SEO + ads | `/contact` |
| 5 | `/solutions-digitales` | Solutions digitales — sites, landing pages, tunnels, SaaS | Hub des 4 offres d'exécution | création site + tunnel + landing | `/contact` |
| 6 | `/site-web` | Création de site web professionnel — cadrage, design, intégration | Vendre le site | création site web professionnel | `/contact` |
| 7 | `/landing-page` | Landing page et page de vente — une page, un objectif | Vendre la page | créer une landing page | `/contact` |
| 8 | `/tunnel` | Tunnel de vente — un parcours mesuré étape par étape | Vendre le tunnel | tunnel de vente | `/contact` |
| 9 | `/audit-tunnel` | Auto-diagnostic de tunnel — 15 points de contrôle | Capter et qualifier | tester son tunnel, diagnostic gratuit | email (synthèse) |
| 10 | `/saas` | SaaS et outils sur mesure — première version, puis itérations | Vendre l'outil | développement SaaS sur mesure | `/contact` |
| 11 | `/methode` | La méthode — diagnostiquer, décider, déployer, mesurer | Rassurer et différencier | méthode / déroulé d'une mission | `/contact` |
| 12 | `/a-propos` | À propos — un cabinet qui dit ce qu'il fait et ce qu'il ne fait pas | Établir la confiance | qui est TalentDigital | `/contact` |
| 13 | `/blog` | Ressources — analyses marketing et acquisition | Hub éditorial | conseils marketing concrets | `/contact` |
| 14 | `/blog/audit-marketing-ce-quil-doit-contenir` | Audit marketing : ce qu'il doit contenir pour servir à quelque chose | Article pilier | « audit marketing contenu » | `/audit` |
| 15 | `/blog/seo-ou-publicite-comment-choisir` | SEO ou publicité payante : comment choisir selon votre marché | Article comparatif | « SEO ou publicité » | `/marketing-digital` |
| 16 | `/blog/refaire-son-site-probleme-de-conversion` | Refaire son site ne règle pas un problème de conversion | Article contrarian | « refaire son site », conversion | `/site-web` |
| 17 | `/contact` | Contact — parlons de votre projet | Convertir | contact | formulaire |
| 18 | `/mentions-legales` | Mentions légales et confidentialité | Conformité + confiance | mentions légales | — |
| — | `/404` | Page introuvable — 404 | Récupérer la navigation | — | `/` |
| — | `/checklist-tunnel.pdf` | (fichier) | Aimant à leads hors page | — | — |

**Total : 18 URL indexables**, dans la cible de 15 à 20 fixée en phase 2.

---

## 4. Redirections

Toutes les redirections sont permanentes (301) et déclarées dans `vercel.json`. Aucune n'est gérée
côté Astro, pour que le rewrite intervienne avant le rendu.

| Source | Destination | Raison |
|---|---|---|
| `/creations/landing-page` | `/landing-page` | Ancienne URL, backlinks et indexation à préserver |
| `/creations/tunnel` | `/tunnel` | idem |
| `/creations/site-web` | `/site-web` | idem |
| `/creations/saas` | `/saas` | idem |
| `/creations` | `/` | Ancien hub supprimé |
| `/services` | `/solutions-digitales` | Nouveau nom du pôle 3 |
| `/services/:path*` | `/solutions-digitales` | Filet de sécurité pour les sous-chemins |

**À prévoir** (non fait, dépend de l'historique réel des URL en production) :

| Source probable | Destination | Quand |
|---|---|---|
| `/audit-gratuit` | `/audit` | si l'ancienne URL existe encore |
| `/creation-site-web` | `/site-web` | idem |
| `/agence` | `/a-propos` | idem |

> ⚠️ **Point de vigilance** : l'audit de phase 1 a relevé un écart entre le dépôt et la production
> (dernier déploiement 13/11/2026 contre dernier push 10/07/2026). La liste ci-dessus doit être
> confrontée à un export des URL réellement servies avant mise en ligne. Une redirection inventée
> ne coûte rien ; une redirection manquante coûte des backlinks.

---

## 5. Navigation

### 5.1 En-tête — 6 entrées + 1 CTA

```
Consulting · Marketing digital · Solutions digitales · Méthode · Ressources · À propos   [Discutons de votre projet]
```

Règles :

- **Pas de menu déroulant.** Six entrées tiennent sur une ligne au-delà de 960 px ; en dessous, le
  menu passe en panneau plein écran. Un sous-menu serait une complexité sans bénéfice à ce nombre
  de pages.
- **L'ordre est un argument.** Consulting avant Solutions : le visiteur lit la logique de vente
  avant de lire le catalogue.
- **Un seul bouton.** Le CTA d'en-tête pointe toujours vers `/contact`. Les CTA `/audit` vivent
  dans le corps des pages, pas dans la barre — pour ne pas diluer l'action principale.
- **`À propos` est visible** plutôt que relégué au pied de page : dans une activité sans
  références clients, savoir qui parle fait partie de la décision.

### 5.2 Pied de page — 5 colonnes

| Colonne | Contenu |
|---|---|
| Marque | Nom, descripteur, phrase de raison d'être, réseaux sociaux |
| Pôles | Consulting, Marketing digital, Solutions digitales, Méthode |
| Solutions | Site web, Landing page, Tunnel, SaaS |
| Ressources | Articles, Audit marketing, Diagnostic tunnel, À propos |
| Contact | Email, WhatsApp, formulaire, mentions légales |

Le pied de page est le **plan du site lisible** : il garantit qu'aucune page n'est orpheline et
qu'un crawler atteint tout le site depuis n'importe quelle page.

### 5.3 Fil d'Ariane

Présent sur toutes les pages internes (`Breadcrumbs.astro`), avec `aria-current="page"` sur le
dernier item, et `BreadcrumbList` en JSON-LD sur les pages d'offre. Deux niveaux maximum : `Accueil
› Solutions digitales › Landing page`.

Exceptions : `/`, `/contact`, `/404` — le fil n'apporte rien au premier, et les deux autres sont
des destinations terminales.

---

## 6. Briefs de contenu par page

Chaque brief suit la même grille : **rôle → lecteur → structure → preuve → CTA → à éviter**.
Les textes sont déjà écrits ; cette section documente l'intention pour que toute réécriture future
reste dans le cadre.

---

### 6.1 Accueil — `/`

- **Rôle** : faire comprendre en dix secondes qu'il s'agit de conseil, pas d'une agence web, puis
  router vers le pôle pertinent.
- **Lecteur** : dirigeant de PME qui a déjà un site, peut-être de la publicité, et qui ne sait pas
  ce qui fonctionne.
- **Titre** : `TalentDigital — Conseil marketing et solutions digitales pour PME`
- **H1** : « Vous n'avez pas un problème d'outils. Vous avez un problème de direction. »

**Structure**

1. **Hero** — H1, sous-titre qui nomme les trois pôles en une phrase, CTA `Discutons de votre
   projet` + `Découvrir la méthode`, micro-ligne « Premier échange sans engagement · Réponse sous
   24 h ouvrées ». Panneau latéral : les trois choses obtenues *avant* de dépenser (diagnostic
   écrit, plan priorisé, périmètre et prix).
2. **Le constat** — « Le vrai problème n'est presque jamais celui qu'on croit. » Deux colonnes :
   ce que les entreprises font, ce que ça produit réellement.
3. **Les trois pôles** — trois cartes numérotées, chacune avec kicker, promesse, description et
   lien. C'est le routeur principal du site.
4. **La méthode** — les 4 étapes avec leur livrable, résumé ; lien vers `/methode`.
5. **Les segments** — trois profils (PME de services, consultants/formateurs, e-commerce) avec
   problème, déclencheur et message. Sert l'identification : « c'est moi, ça ».
6. **Périmètre** — ce qu'on fait / ce qu'on ne fait pas, en deux colonnes.
7. **FAQ** — 8 questions issues de `faqHome`, dont prix, garantie, qui exécute, hors Maroc.
8. **CTA final** — « Votre prochaine décision marketing mérite mieux qu'une intuition. »

**Preuve utilisée** : méthode, livrables nommés, périmètre écrit, statut assumé.
**À éviter** : un carrousel de logos, un compteur de projets, « +200 clients satisfaits ».

---

### 6.2 Consulting marketing — `/consulting-marketing`

- **Rôle** : vendre la décision. C'est la page qui justifie l'existence du site.
- **H1** : « Décider où investir, avant de dépenser. »
- **Structure** : problème (budget dispersé) → ce que couvre le consulting (5 lignes de la phase 2)
  → comment se déroule une mission (renvoi `/methode`) → livrables → différenciation face à une
  agence → FAQ courte → CTA.
- **CTA** : `Demander un audit` (le consulting s'achète par l'audit) et `Discutons de votre projet`.
- **À éviter** : vendre du « conseil stratégique » abstrait sans dire ce qui est remis à la fin.

---

### 6.3 Audit marketing — `/audit`

- **Rôle** : transformer l'audit en produit clair, vendable et non-anxiogène.
- **H1** : « Avant de dépenser plus, savoir ce qui produit déjà. »
- **Structure** : 6 angles analysés → 6 livrables → 4 étapes → règles de prix → formulaire →
  FAQ 8 questions.
- **Encadré « Ce que l'audit n'est pas »** : pas un rapport de 60 pages, pas un prétexte pour
  vendre une refonte, pas une promesse de leads ou de position, pas un avis sans preuve.
- **Prix** : forfait annoncé **après** le premier échange, jamais avant, jamais affiché en chiffres.
  Quatre règles écrites : forfait, montant connu avant démarrage, aucun pourcentage sur le budget
  publicitaire, exécution séparée.
- **Formulaire** : `prenom, nom, email, tel?, service, budget?, message` + honeypot `website` →
  `POST /api/contact`. Le champ `budget` collecte un **ordre de grandeur déclaratif**
  (`non-defini`, `<500`, `500-1500`, `1500-3000`, `>3000`), ce n'est pas un tarif publié.
- **Événement** : `generate_lead` avec `form: 'audit'`.

> **Décision de cohérence** : ce sont les seules valeurs numériques monétaires du site, et elles
> sont dans un formulaire, pas dans une grille tarifaire. Si l'on veut une cohérence absolue
> « zéro chiffre », il suffit de remplacer les libellés par des qualificatifs (« budget serré »,
> « budget intermédiaire », « budget confortable ») — voir §15.1.

---

### 6.4 Marketing digital — `/marketing-digital`

- **Rôle** : montrer qu'on sait exécuter les canaux, sans redevenir une agence média.
- **H1** : « Choisir les bons canaux, puis les piloter. »
- **Structure** : le problème du « tout canal » → les 5 familles (SEO, publicité, contenu, email,
  CRO) avec pour chacune *ce qu'elle règle* et *ce qu'elle ne règle pas* → tableau de bord →
  renvoi audit → CTA.
- **Point clé de voix** : ne jamais promettre un volume de leads. Formuler les canaux comme des
  hypothèses à tester, avec un critère d'arrêt.
- **CTA secondaire** : `/audit` (« Avant de dépenser plus, vérifions ce qui fonctionne déjà »).

---

### 6.5 Solutions digitales — `/solutions-digitales`

- **Rôle** : hub des quatre offres d'exécution ; capter les requêtes « site », « tunnel »,
  « landing » et les renvoyer vers la bonne page.
- **H1** : « Construire des supports qui travaillent. »
- **Structure** : les 4 offres en cartes → galerie de 13 maquettes sectorielles → périmètre →
  FAQ → CTA.
- **Règle de preuve, non négociable** : la galerie est légendée **« exemples de direction
  artistique »**. Jamais « nos réalisations », jamais « nos clients », jamais un résultat associé à
  une image. La mention figure aussi dans `mentions-legales#propriete`.
- **CTA** : `Discutons de votre projet`.

---

### 6.6 Site web — `/site-web`

- **H1** : « Un site qui explique, et qui convertit. »
- **Structure** : ce qu'un site doit faire (expliquer, rassurer, convertir) → cadrage → design →
  intégration → SEO technique → mesure → prise en main → vous gardez les accès.
- **Argument de différenciation** : le site est la **conséquence** d'une décision, pas le point de
  départ. Renvoi vers `/audit`.
- **Propriété** : écrire noir sur blanc que le code, le domaine et les accès restent au client.

---

### 6.7 Landing page — `/landing-page`

- **H1** : « Une page, un objectif, un seul appel à l'action. »
- **Structure** : pourquoi une page dédiée bat une page de site → structure argumentative →
  objections → formulaire et tracking → ce qui est livré.
- **CTA secondaire** : `/audit-tunnel` — une landing est le premier maillon d'un tunnel, le test
  gratuit est une suite logique.

---

### 6.8 Tunnel de vente — `/tunnel`

- **H1** : « Un parcours qui accompagne au lieu de laisser partir. »
- **Structure** : les 5 étapes d'un tunnel (capture, offre, commande, relance, mesure) → ce qui est
  mesuré à chaque étape → erreurs fréquentes → `/audit-tunnel` en CTA secondaire → CTA principal.
- **Cohérence** : les 5 étapes de cette page et les 6 zones de `/audit-tunnel` doivent rester
  alignées. Si l'une évolue, l'autre suit.

---

### 6.9 Auto-diagnostic tunnel — `/audit-tunnel`

- **Rôle** : capter un lead qualifié en échange d'une valeur immédiate, sans friction.
- **H1** : « Où votre tunnel laisse-t-il partir les visiteurs ? »
- **Mécanique** : 15 questions réparties en 6 zones (offre, capture, page de vente, commande,
  relance, mesure). Score immédiat `/15`, verdict en 4 paliers, tags par zone faible.
- **Friction** : **aucun email requis pour voir le score.** L'email n'est demandé qu'après, pour
  recevoir la synthèse écrite. C'est le point de différenciation face aux quiz qui bloquent le
  résultat.
- **Événements** : `quiz_complete` (score, max, nombre de zones faibles) puis `generate_lead`
  (`form: 'audit-tunnel'`).
- **Cadrage honnête** : la page dit explicitement qu'un test d'auto-perception ne remplace pas une
  analyse de données.
- **Après le test** : trois suites possibles — corriger seul, faire analyser une zone, reconstruire
  si justifié. L'ordre est délibéré : reconstruire en dernier.

---

### 6.10 SaaS / outils sur mesure — `/saas`

- **H1** : « Construire l'outil qui manque, sans construire trop. »
- **Structure** : le problème du sur-développement → cadrage fonctionnel → architecture →
  première version utilisable → tests et documentation → transfert du code.
- **Argument** : la première version sert à apprendre, pas à tout prévoir. Périmètre court, puis
  itérations décidées sur l'usage réel.
- **Voix** : c'est la page la plus technique du site. Garder les mots français quand ils existent
  (« outil », « première version ») plutôt que « MVP », « onboarding », « scalable ».

---

### 6.11 Méthode — `/methode`

- **Rôle** : page de réassurance, celle qu'on envoie après un premier échange.
- **H1** : « Quatre étapes, aucune zone d'ombre. »
- **Structure** : les 4 étapes (Diagnostiquer → Décider → Déployer → Mesurer), chacune avec
  description et **livrable nommé** ; puis ce que la méthode n'est pas ; puis ce qui est attendu du
  client à chaque étape.
- **Détail qui crédibilise** : nommer explicitement les obligations du client (accès, disponibilité
  pour les entretiens, validation). Une méthode qui ne demande rien au client est une méthode qui
  ne s'applique pas.

---

### 6.12 À propos — `/a-propos`

- **Rôle** : répondre à « à qui je parle ? » sans inventer un passé.
- **H1** : « Un cabinet qui dit ce qu'il fait, et ce qu'il ne fait pas. »
- **Contenu autorisé** : activité indépendante, non immatriculée comme société à ce jour, une seule
  personne qui conseille et exécute, partenaires ponctuels possibles sous responsabilité et avec
  accord, refus explicites.
- **Contenu interdit** : années d'expérience non vérifiables, nombre de projets, noms de clients,
  diplômes non fournis, « notre équipe de 12 experts ».
- **Pourquoi cette page existe** : dans une activité sans références publiques, l'honnêteté sur le
  statut est un actif de conversion. Elle évite la découverte tardive en fin de négociation.

---

### 6.13 Blog — `/blog` + 3 articles

- **Rôle** : prouver l'expertise par la démonstration, pas par l'affirmation.
- **H1 index** : « Écrit pour être utilisé, pas pour remplir. »

| Article | Fonction | Page d'offre liée |
|---|---|---|
| Audit marketing : ce qu'il doit contenir | Article pilier, structure de référence | `/audit` |
| SEO ou publicité : comment choisir | Comparatif, arbitrage budgétaire | `/marketing-digital` |
| Refaire son site ne règle pas un problème de conversion | Contrarian, cas fréquent | `/site-web` |

Règles éditoriales :

- Chaque article contient **au moins un critère de décision** réutilisable (tableau, seuil, ordre
  de priorité), pas seulement des principes.
- Chaque article se termine par un lien vers **une** page d'offre, pas trois.
- Pas de date de « mise à jour » artificielle pour simuler la fraîcheur. La date affichée est la
  date réelle.
- Un article qui ne peut pas être relié à une offre n'est pas publié.

---

### 6.14 Contact — `/contact`

- **H1** : « Parlons de ce qui bloque. »
- **Champs** : `prenom, email, message` requis, `tel` facultatif, sujet et consentement.
  Le sujet est **replié dans le message** côté API (`/api/contact-general` ne stocke que
  `prenom, email, tel, message`). Décision assumée : le contrat d'API reste simple, le contexte
  reste lisible dans le corps du message.
- **Micro-copie** : « Réponse sous 24 heures ouvrées », « premier échange sans engagement ».
  Aucune promesse de délai de livraison de projet.
- **Événement** : `generate_lead` (`form: 'contact'`).

---

### 6.15 Mentions légales — `/mentions-legales`

Sept sections ancrées : éditeur, hébergement, propriété intellectuelle, données personnelles,
cookies, sécurité, droit applicable.

Points qui ne sont pas de la décoration :

- **Statut** : « activité indépendante, non immatriculée comme société à ce jour », publié
  volontairement, avec la mention que la page sera mise à jour à l'immatriculation.
- **Sous-traitants nommés** : Supabase, Resend, Vercel, Google Analytics 4.
- **Durées** : 36 mois pour les demandes, 14 mois pour la mesure, consentement local jusqu'au
  retrait.
- **`#confidentialite` et `#cookies`** sont des ancres utilisées par les formulaires du site. Les
  renommer casserait les liens.
- **Bouton `#reset-consent`** : efface `td-consent` et recharge la page pour réafficher le bandeau.

---

### 6.16 404 — `/404`

Six liens vers les pages principales, avec une phrase décrivant chacune. Le ton reste utile, pas
ludique. Aucun CTA `/audit` — la personne est déjà perdue, on ne lui vend rien.

---

## 7. Parcours de conversion

### 7.1 PME de services — parcours principal

```
Accueil → constat → Consulting marketing → Méthode → /audit → formulaire → premier échange
```

Le parcours par défaut. L'accueil route vers le pôle consulting, qui route vers l'audit, qui est la
seule offre avec un prix cadré et une sortie sans engagement.

### 7.2 Visiteur « je veux un site »

```
Recherche → /site-web ou /landing-page → argument « le site vient après la décision »
→ /audit → formulaire
```

C'est le parcours le plus fragile : il vient avec une demande d'exécution et on lui répond par un
diagnostic. La page ne doit jamais donner l'impression de refuser le projet — elle explique
pourquoi le cadrage précède le devis. Le CTA reste `Discutons de votre projet`, pas « remplissez un
audit ».

### 7.3 E-commerçant — parcours outil

```
/blog/refaire-son-site… (ou recherche) → /audit-tunnel → score → email → synthèse
→ /tunnel ou /audit
```

Le seul parcours où l'email est collecté avant tout contact humain. La valeur (score + lecture par
zone) est délivrée avant la demande d'email — c'est ce qui rend la capture défendable.

### 7.4 Règles communes

- **Un CTA principal par page.** Les CTA secondaires sont toujours visuellement plus faibles.
- **Jamais deux formulaires concurrents sur la même page.** `/audit` a un formulaire ;
  `/audit-tunnel` a un quiz puis un formulaire d'envoi, jamais les deux visibles simultanément.
- **Le premier échange est gratuit partout.** C'est la seule promesse de délai/prix répétée sur le
  site, et elle est tenable.

---

## 8. Maillage interne

### 8.1 Sens des liens

| Depuis | Vers | Ancre type |
|---|---|---|
| `/` | les 3 pôles, `/methode`, `/audit`, `/blog` | nom du pôle |
| `/consulting-marketing` | `/audit`, `/methode`, `/marketing-digital` | « demander un audit » |
| `/audit` | `/consulting-marketing`, `/methode`, `/solutions-digitales` | « voir la méthode » |
| `/marketing-digital` | `/audit`, `/consulting-marketing`, `/blog/seo-ou-publicite…` | « vérifier ce qui fonctionne » |
| `/solutions-digitales` | les 4 offres, `/methode` | nom de l'offre |
| `/site-web` | `/audit`, `/solutions-digitales`, `/marketing-digital` (SEO technique) | « auditer l'existant » |
| `/landing-page` | `/tunnel`, `/audit-tunnel` | « tester votre tunnel » |
| `/tunnel` | `/audit-tunnel`, `/landing-page` | « auto-diagnostic » |
| `/audit-tunnel` | `/tunnel`, `/audit`, `/contact` | « voir ce qu'un tunnel implique » |
| `/saas` | `/solutions-digitales`, `/methode` | « cadrer le projet » |
| `/methode` | `/audit`, les 3 pôles | « commencer par un audit » |
| `/a-propos` | `/methode`, `/contact` | « voir la méthode » |
| Articles | **une** page d'offre + 2 articles liés | descriptive, jamais « cliquez ici » |

### 8.2 Règles

- **Aucun lien sortant sans `rel="noopener"`** quand `target="_blank"`.
- **Pas de lien vers `/audit` depuis la 404.**
- **Les ancres décrivent la destination.** « Demander un audit », pas « en savoir plus ».
- **Pas de lien croisé entre `/audit` et `/audit-tunnel`** en CTA principal : les deux adressent des
  besoins différents et se cannibaliseraient. Le lien existe, mais en note de bas de page.
- **Chaque article reçoit au moins un lien entrant** depuis une page d'offre ou depuis un autre
  article. Trois articles, trois liens entrants minimum.

---

## 9. Données structurées

| Portée | Type | Où | Statut |
|---|---|---|---|
| Site | `ProfessionalService` avec `@id`, `sameAs`, `areaServed`, `knowsAbout` | `BaseLayout` — toutes les pages | en place |
| Fil d'Ariane | `BreadcrumbList` | toutes les pages sauf `/` et `/404` | en place |
| FAQ | `FAQPage` (émis par `Faq.astro`, `jsonLd` par défaut à `true`) | 11 pages : `/`, `/a-propos`, `/audit`, `/consulting-marketing`, `/landing-page`, `/marketing-digital`, `/methode`, `/saas`, `/site-web`, `/solutions-digitales`, `/tunnel` | en place |
| Offre | `Service` | 9 pages d'offre | en place |
| Catalogue | `Offer` / `OfferCatalog` | `/audit`, `/consulting-marketing`, `/marketing-digital`, `/solutions-digitales` | en place |
| Article | `BlogPosting` | 3 articles + `/blog` | en place |
| Processus | `HowTo` + `HowToStep` | `/methode` | en place — **type obsolète, à retirer** |
| Page | `AboutPage`, `ContactPage`, `WebPage`, `Blog` | selon la page | en place |

**Sur `FAQPage`** : le balisage est présent, mais depuis les mises à jour Google de 2023-2024 les
résultats enrichis FAQ ne s'affichent plus pour la majorité des sites commerciaux. Il ne produit
donc aucun bénéfice visible et crée un risque de divergence entre le texte de la page et le JSON-LD.
Deux options : le retirer (passer `jsonLd={false}`), ou le garder pour les moteurs génératifs qui
lisent encore ce balisage. **Recommandation** : le garder, mais vérifier qu'aucune réponse du
JSON-LD ne contredit le texte affiché — c'est le seul vrai risque.

**Sur `HowTo`** : Google a supprimé les résultats enrichis HowTo en 2023. Le balisage sur `/methode`
n'apporte rien et décrit un processus interne, pas une procédure que l'internaute peut suivre seul.
**À retirer.**

**Cohérence obligatoire** : le `@id` de l'organisation (`https://talentdigital.net/#organization`)
doit rester identique partout, sinon Google traite plusieurs entités distinctes. `Service.provider`
duplique aujourd'hui l'organisation au lieu de la référencer par `@id` — à corriger.

---

## 10. SEO, AEO et GEO

### 10.1 Méta-données

- Toutes les pages ont un `<title>` unique et une `description` unique, rédigés à la main.
  Aucune génération automatique par concaténation.
- Le suffixe `— TalentDigital` est ajouté par `BaseLayout` **sauf** si le titre contient déjà le
  nom de marque (cas de l'accueil). Cela évite `TalentDigital … — TalentDigital`.
- Longueur cible : titre ≤ 60 caractères avant suffixe, description 140-160 caractères.
- Canonical absolu sur chaque page, construit depuis `Astro.site`.

### 10.2 Sitemap et robots

- `@astrojs/sitemap` génère `sitemap-index.xml`. `404` est exclue automatiquement (pas de route
  indexable).
- `robots.txt` autorise l'exploration complète et déclare le sitemap. Aucune page en `noindex`
  actuellement — l'option existe dans `BaseLayout` si besoin.

### 10.3 AEO — réponses directes

- Chaque page d'offre commence par une phrase qui répond à « qu'est-ce que c'est » en une ligne,
  avant tout argumentaire.
- Les FAQ utilisent des questions formulées comme on les tape (« Combien coûte un
  accompagnement ? »), pas comme un titre marketing.
- Les H2 sont des phrases complètes, pas des mots-clés isolés.

### 10.4 GEO — visibilité dans les réponses génératives

- `public/llms.txt` décrit l'activité, les trois pôles, les pages principales, le statut et les
  limites, dans un format lisible par un agent.
- Les affirmations sont **vérifiables ou absentes**. Un modèle qui cite le site ne doit jamais
  citer un chiffre que le site ne peut pas prouver.
- Les entités sont nommées de façon stable : « TalentDigital », « conseil marketing », « solutions
  digitales », les villes et pays desservis.
- Pas de contenu caché pour les robots : ce qui est dans `llms.txt` existe aussi dans les pages.

### 10.5 Ce qu'on ne fait pas

- Pas de pages « villes » dupliquées (`/consultant-marketing-casablanca`, `/…-rabat`) tant qu'il
  n'y a pas de contenu réel différenciant.
- Pas de texte généré en masse pour occuper des requêtes.
- Pas de netlinking acheté.

---

## 11. Plan de mesure

### 11.1 Événements GA4

GA4 n'est chargé **qu'après consentement** (`localStorage['td-consent'] === 'granted'`).
`window.tdTrack` ne fait rien tant que le consentement n'est pas donné.

| Événement | Déclencheur | Paramètres | Statut |
|---|---|---|---|
| `generate_lead` | envoi réussi d'un formulaire | `form` (`audit` / `contact` / `audit-tunnel`), `service`, `subject`, `score` | en place |
| `quiz_complete` | score calculé sur `/audit-tunnel` | `score`, `max`, `weak_zones` | en place |
| `cta_click` | clic sur un lien vers `/contact` ou `/audit` | `cta`, `page`, `target` | en place |
| `pdf_download` | clic sur un fichier `.pdf` | `file`, `page` | en place |

**Conversion principale** : `generate_lead`. Les trois autres sont des événements de diagnostic.

### 11.2 Indicateurs

| Axe | Indicateur | Cible phase 2 | Où le lire |
|---|---|---|---|
| Conversion | `generate_lead` / mois | 4 à 8 | GA4 |
| Conversion | Taux de complétion des formulaires | > 60 % | GA4 (`form_start` à ajouter) |
| Acquisition | Pages indexées | 15 à 20 | Search Console |
| Acquisition | Requêtes « consulting / consultant marketing » | suivi dès M+2 | Search Console |
| Engagement | Complétion du quiz | > 50 % des arrivées | GA4 |
| Visibilité IA | Citations dans les réponses génératives | revue qualitative mensuelle | manuel |

### 11.3 Manque connu

- **Pas de `form_start`.** On mesure l'envoi, pas l'abandon. À ajouter : un événement au premier
  focus sur un champ de formulaire. Sans lui, le taux de complétion n'est pas calculable.
- **Pas de mesure des liens sortants** (WhatsApp, email). `cta_click` ne couvre que `/contact` et
  `/audit`. WhatsApp est un canal de conversion réel au Maroc — il devrait être suivi.
- **Pas de UTM capturés** dans les formulaires. Impossible de savoir quelle page a produit un lead
  au-delà de la session GA4.

---

## 12. Performance et accessibilité

### 12.1 Budget

| Métrique | Cible | État |
|---|---|---|
| Polices | auto-hébergées, `font-display: swap`, sous-ensembles latin + latin-ext | fait (18 woff2) |
| CSS bloquant | un seul bundle, pas d'`@import` | fait |
| JavaScript | scripts inline, pas de framework client | fait |
| Images de galerie | 13 mockups, formats optimisés | à vérifier au cas par cas |
| LCP | < 2,5 s sur mobile 4G | non mesuré |
| CLS | < 0,1 | non mesuré |

> Aucun chiffre de performance n'est publié sur le site (« PageSpeed 90+ » a été retiré). Le budget
> est un objectif interne, pas un argument commercial.

### 12.2 Accessibilité

- Contrastes : `--muted` à `#909099` (6,09:1) et `--txt` à `#C6C6C0` sur fond sombre. Le lime
  `--lime` n'est pas utilisé pour du texte courant, seulement pour des accents et des bordures.
- Navigation clavier : accordéons avec `aria-expanded`, liens avec `:focus-visible`, champ honeypot
  en `tabindex="-1"`.
- Formulaires : `label` explicite pour chaque champ, erreurs en `role="alert"` / `aria-live`, focus
  déplacé sur le premier champ invalide.
- Mouvement : `prefers-reduced-motion` désactive les révélations au scroll.

---

## 13. Conformité

| Sujet | Traitement |
|---|---|
| Consentement | Bandeau, choix explicite, aucun script de mesure avant acceptation |
| Retrait | Bouton `#reset-consent` sur `/mentions-legales#cookies` |
| Données collectées | 3 formulaires, finalités écrites, base légale écrite |
| Sous-traitants | Supabase, Resend, Vercel, Google Analytics 4 — nommés |
| Transferts hors UE | Mentionnés, garanties contractuelles citées |
| Durées | 36 mois / 14 mois / consentement local |
| Droits | Accès, rectification, effacement, limitation, opposition, portabilité ; CNDP + CNIL |
| Statut | Activité indépendante non immatriculée, publiée volontairement |
| Sécurité | HTTPS, honeypot, validation serveur, limitation d'envoi, CSP |

**Risque résiduel** : l'absence d'immatriculation est un frein réel pour certains acheteurs
institutionnels. La page légale le dit, ce qui est la seule option honnête. À revisiter dès qu'une
structure est enregistrée.

---

## 14. Checklist de lancement

### 14.1 Technique

- [ ] `npm run build` sans erreur — **OK (19 pages)**
- [ ] `npm test` vert — **OK (14 tests)**
- [x] `sitemap-index.xml` / `sitemap-0.xml` contient 18 URL — **vérifié**
- [x] Aucun lien interne mort — **vérifié via `node tools/check-links.mjs`**
- [ ] Vérifier chaque redirection 301 en production (`/creations/*`, `/services/*`)
- [ ] Comparer la liste des URL servies en production avec §4
- [ ] Vérifier les en-têtes de sécurité sur une URL réelle (CSP, HSTS si activé)
- [ ] Tester les 3 formulaires de bout en bout (Supabase + Resend)
- [ ] Tester le rate limiting des fonctions API

### 14.2 Contenu

- [ ] Aucun témoignage, aucun logo client, aucun chiffre non sourcé
- [ ] Galerie légendée « exemples de direction artistique » sur `/solutions-digitales`
- [ ] Aucun prix numérique affiché hors champ `budget` du formulaire
- [ ] Toutes les pages internes ont un fil d'Ariane (sauf exceptions §5.3)
- [ ] Aucun lien interne mort (vérification automatisée + clic manuel) — **automatique OK**
- [ ] `og:image` spécifique par page — **actuellement `og-default.png` partout**
- [ ] Titres ≤ 62 caractères, descriptions 140-165 — **15 titres et 13 descriptions hors cible**
- [ ] `llms.txt` à jour avec les 18 URL

### 14.3 Mesure

- [ ] Bandeau de consentement visible, aucune requête GA4 avant acceptation (onglet réseau)
- [ ] `generate_lead` visible dans GA4 DebugView sur les 3 formulaires
- [ ] `quiz_complete` visible sur `/audit-tunnel`
- [ ] `cta_click` et `pdf_download` visibles
- [ ] Search Console : sitemap soumis, propriété vérifiée
- [ ] Ajouter `form_start` (voir §11.3)

### 14.4 Légal

- [ ] Mention de statut exacte et à jour
- [ ] Sous-traitants à jour si un outil change
- [ ] Ancres `#confidentialite`, `#cookies`, `#reset-consent` fonctionnelles
- [ ] Bouton de retrait du consentement testé

### 14.5 Après mise en ligne

- [ ] Surveiller les 404 dans Search Console pendant 30 jours
- [ ] Vérifier l'indexation des 18 URL à J+14
- [ ] Relever les premières requêtes à M+1
- [ ] Revue des leads à M+1 : origine, qualité, adéquation avec l'offre

---

## 15. Décisions ouvertes et dette connue

### 15.1 Prix : zéro chiffre, ou fourchettes ?

**Décision actuelle** : aucun prix numérique affiché sur le site. Les pages disent « forfait
annoncé après le premier échange » et « fourchette donnée dès le premier échange ».

**Ce qui reste incohérent** : le menu `budget` de `/audit` contient cinq tranches en euros
(`<500` à `>3000`). C'est un champ de qualification, pas une grille tarifaire, mais un visiteur
attentif peut le lire comme un barème implicite.

**Deux options**

| Option | Avantage | Inconvénient |
|---|---|---|
| A. Garder les tranches | Qualifie le budget dès la demande, évite les échanges inutiles | Contredit le « aucun prix affiché » |
| B. Remplacer par des qualificatifs | Cohérence absolue | Perd une donnée de qualification utile |

**Recommandation** : A, en assumant que le formulaire n'est pas une page de tarifs. Le dire
explicitement dans une note de bas de formulaire si l'ambiguïté gêne.

### 15.2 Ouverture d'une structure juridique

L'absence d'immatriculation est documentée et assumée, mais elle plafonne la taille des missions
acceptables. À traiter hors périmètre web.

### 15.3 Canal de déploiement

L'audit a relevé un écart entre le dépôt et la production. Tant que ce canal n'est pas clarifié,
toute correction de contenu peut être écrasée au déploiement suivant. **À résoudre avant la mise en
ligne**, sinon la refonte n'est pas réellement livrée.

### 15.4 Stratégie de contenu à 6 mois

Trois articles ne suffisent pas à installer une autorité. Prochaines cibles éditoriales, dans
l'ordre : coût d'un site au Maroc, comment choisir un consultant marketing, structure d'un plan
d'action marketing. Chacune reliée à une page d'offre existante.

### 15.5 Vidéo / réseaux

Le site ne présente pas la chaîne YouTube ni les réseaux comme des preuves, seulement comme des
liens de pied de page. Choix assumé tant que le contenu social n'est pas aligné avec le
positionnement de conseil.

### 15.6 Dette technique mineure

Mesurée sur le build du 15/11/2026 (`node tools/audit-pages.mjs`) :

| Constat | Portée | Effet |
|---|---|---|
| `og:image` = `og-default.png` sur **toutes** les pages | 19 pages | 9 images OG dédiées (`og-audit`, `og-site-web`, `og-tunnel`…) existent dans `public/` mais ne sont jamais câblées : aucun partage social n'a d'aperçu spécifique |
| `<title>` > 62 caractères | 15 pages | troncature probable dans les résultats Google ; le suffixe `— TalentDigital` consomme 15 caractères |
| `meta description` > 165 caractères | 13 pages | troncature en SERP |
| `HowTo` sur `/methode` | 1 page | type obsolète, aucun rich result |
| `FAQPage` sur 11 pages | 11 pages | sans rich result depuis 2023 ; garder seulement si le texte reste aligné |
| `404` sans `meta robots noindex` | 1 page | dépend du statut HTTP servi par Vercel |
| `contact.astro` duplique localement les styles de formulaire présents dans `v2.css` | — | sans effet visuel |
| `Service.provider` duplique l'organisation au lieu de référencer son `@id` | 9 pages | risque de duplication d'entité |
| Pas de `form_start` | 3 formulaires | taux de complétion non calculable |

Aucun de ces points ne bloque la mise en ligne ; les deux premiers sont ceux qui coûtent le plus en
visibilité, parce qu'ils touchent chaque page.

---

## 16. Hors périmètre

Ce document ne couvre pas :

- la production des visuels et des maquettes sectorielles ;
- la rédaction des articles au-delà des trois publiés ;
- la configuration DNS, l'email professionnel et le déploiement ;
- le cadre contractuel (CGV, contrat de mission) ;
- les campagnes publicitaires payantes ;
- la vidéo de présentation (piste Reel, traitée séparément).

---

*Fin du livrable de phase 3. Les sections §15 listent ce qui doit être tranché par le client avant
que la refonte soit considérée comme livrée.*
