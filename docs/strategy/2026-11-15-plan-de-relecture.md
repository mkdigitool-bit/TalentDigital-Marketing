# TalentDigital — Plan de relecture des pages

> Document de travail, créé le 15 novembre 2026 pour la relecture page par page du site v2.
> À ouvrir en parallèle du site en prévisualisation.

---

## 1. Lancer la prévisualisation

Le site se lit sur le build de production, pas sur le serveur de développement : ce que tu vois
est exactement ce qui sera déployé.

```powershell
cd C:\Users\lenovo\Desktop\TD-AA\TalentDigital-Marketing
npm run preview -- --port 4321
```

Puis ouvrir **http://localhost:4321**.

Après une correction, il faut reconstruire avant de recharger :

```powershell
npm run build
```

Le serveur de prévisualisation sert le dossier `dist/` : sans rebuild, il affiche l'ancienne
version.

---

## 2. Ordre de lecture

L'ordre suit le parcours d'un visiteur réel : entrée → décision → exécution → demande.

### Parcours d'entrée

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 1 | Accueil | `/` | La thèse tient-elle en un écran ? Le mot « conseil » arrive-t-il avant le vocabulaire de production ? Les 3 pôles sont-ils lisibles sans scroller ? |
| 2 | Consulting marketing | `/consulting-marketing` | La page vend-elle une décision, pas un livrable ? Le CTA mène-t-il à `/audit` ? |
| 3 | Méthode | `/methode` | Les 4 livrables sont-ils nommés et concrets ? Les obligations du client sont-elles dites ? |
| 4 | À propos | `/a-propos` | Le statut est-il assumé sans gêne ? Les refus sont-ils crédibles ou défensifs ? |

### Pôle acquisition

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 5 | Marketing digital | `/marketing-digital` | Chaque canal dit-il ce qu'il règle **et** ce qu'il ne règle pas ? Aucune promesse de volume ? |

### Pôle exécution

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 6 | Solutions digitales | `/solutions-digitales` | **La légende « exemples de direction artistique » doit être visible**, pas en bas de page en petits caractères. Aucune image ne doit ressembler à une référence client. |
| 7 | Site web | `/site-web` | Le message « le site vient après la décision » passe-t-il sans donner l'impression de refuser le projet ? |
| 8 | Landing page | `/landing-page` | Une seule promesse, un seul CTA. Le lien vers `/audit-tunnel` est-il pertinent, pas parasite ? |
| 9 | Tunnel de vente | `/tunnel` | Les 5 étapes de cette page sont-elles alignées avec les 6 zones de `/audit-tunnel` ? |
| 10 | SaaS sur mesure | `/saas` | Page la plus technique : le vocabulaire reste-t-il français et compréhensible ? |

### Offres d'entrée

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 11 | Audit marketing | `/audit` | 6 axes, 6 livrables, 4 étapes, règles de prix. L'encadré « ce que l'audit n'est pas » doit rassurer, pas inquiéter. |
| 12 | Auto-diagnostic | `/audit-tunnel` | **Aucun email demandé avant le score.** Le score s'affiche immédiatement après la 15ᵉ réponse. |
| 13 | Checklist PDF | `/checklist-tunnel.pdf` | Le PDF s'ouvre-t-il et correspond-il encore au contenu de la page ? |

### Éditorial

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 14 | Ressources | `/blog` | Les 3 articles sont-ils présentés avec une promesse claire, pas juste une date ? |
| 15 | Audit marketing | `/blog/audit-marketing-ce-quil-doit-contenir` | Contient-il un critère de décision réutilisable ? Se termine-t-il sur **une** page d'offre ? |
| 16 | SEO ou publicité | `/blog/seo-ou-publicite-comment-choisir` | Le comparatif tranche-t-il vraiment, ou reste-t-il neutre ? |
| 17 | Refaire son site | `/blog/refaire-son-site-probleme-de-conversion` | L'argument contrarian est-il démontré, pas seulement affirmé ? |

### Fin de parcours

| # | Page | URL | Ce qu'il faut regarder |
|---|---|---|---|
| 18 | Contact | `/contact` | Le formulaire demande-t-il le minimum ? La mention « réponse sous 24 h ouvrées » est-elle tenable ? |
| 19 | Mentions légales | `/mentions-legales` | Statut, sous-traitants, durées, cookies. Rien qui contredise une autre page. |
| 20 | 404 | `/page-qui-nexiste-pas` | Les 6 liens sont-ils les bons ? Ton utile, pas ludique. |

---

## 3. Tests à faire pendant la relecture

### 3.1 Les trois formulaires

| Formulaire | Page | Champs attendus | API |
|---|---|---|---|
| Audit | `/audit#demande` | prénom, nom, email, téléphone (facultatif), sujet, budget, message, consentement | `POST /api/contact` |
| Contact | `/contact` | prénom, email, téléphone (facultatif), sujet, message, consentement | `POST /api/contact-general` |
| Diagnostic | `/audit-tunnel` (après le score) | prénom, email | `POST /api/contact-general` |

À vérifier sur chacun :

- [ ] soumission vide → les champs requis sont signalés, le focus va sur le premier
- [ ] email invalide → message d'erreur explicite
- [ ] envoi réussi → le formulaire est remplacé par le message de confirmation
- [ ] l'erreur réseau affiche un message qui donne une solution (email de secours)

### 3.2 Consentement

- [ ] première visite → le bandeau apparaît
- [ ] **avant acceptation**, l'onglet Réseau ne montre aucune requête vers `googletagmanager.com`
- [ ] « Tout refuser » → le site fonctionne normalement, formulaires compris
- [ ] « Accepter la mesure » → GA4 se charge
- [ ] `/mentions-legales#cookies` → « Gérer mes cookies » réaffiche le bandeau

### 3.3 Mobile

- [ ] largeur 390 px : le menu bascule en panneau plein écran (bascule à 960 px)
- [ ] les tableaux et grilles ne débordent pas horizontalement
- [ ] les zones tactiles des boutons font au moins 44 px de haut
- [ ] le quiz de `/audit-tunnel` reste utilisable (les options passent sous la question)

### 3.4 Clavier

- [ ] tabulation : tous les liens et boutons sont atteignables, le focus est visible
- [ ] accordéons FAQ : `Entrée` ouvre et ferme, l'état est annoncé
- [ ] le champ anti-robot n'est jamais atteint par tabulation

---

## 4. Points déjà connus — ne pas les signaler comme bugs

Ces éléments sont documentés dans `docs/strategy/2026-11-15-phase3-architecture-copy.md` §15.6 :

| Point | État |
|---|---|
| Aperçu social identique sur toutes les pages (`og-default.png`) | connu, à câbler |
| 15 titres > 62 caractères, 13 descriptions > 165 | connu, passe d'optimisation à faire |
| `HowTo` obsolète sur `/methode` | connu, à retirer |
| `Service.provider` dupliqué au lieu du `@id` | connu |
| Pas d'événement `form_start` | connu |
| `/404` sans `noindex` | connu, dépend du statut servi par Vercel |

---

## 5. Grille de validation

À remplir pendant la relecture. Une ligne par page.

| # | Page | OK | À corriger | Note |
|---|---|---|---|---|
| 1 | Accueil | ☐ | ☐ | |
| 2 | Consulting marketing | ☐ | ☐ | |
| 3 | Méthode | ☐ | ☐ | |
| 4 | À propos | ☐ | ☐ | |
| 5 | Marketing digital | ☐ | ☐ | |
| 6 | Solutions digitales | ☐ | ☐ | |
| 7 | Site web | ☐ | ☐ | |
| 8 | Landing page | ☐ | ☐ | |
| 9 | Tunnel de vente | ☐ | ☐ | |
| 10 | SaaS sur mesure | ☐ | ☐ | |
| 11 | Audit marketing | ☐ | ☐ | |
| 12 | Auto-diagnostic | ☐ | ☐ | |
| 13 | Checklist PDF | ☐ | ☐ | |
| 14 | Ressources | ☐ | ☐ | |
| 15 | Article — audit | ☐ | ☐ | |
| 16 | Article — SEO ou pub | ☐ | ☐ | |
| 17 | Article — refaire son site | ☐ | ☐ | |
| 18 | Contact | ☐ | ☐ | |
| 19 | Mentions légales | ☐ | ☐ | |
| 20 | 404 | ☐ | ☐ | |

---

## 6. Où sont les fichiers

| Élément | Emplacement |
|---|---|
| Site source | `TalentDigital-Marketing/src/` |
| Build local (ce qui est prévisualisé) | `TalentDigital-Marketing/dist/` |
| Contenus structurants (nav, pôles, méthode, FAQ) | `TalentDigital-Marketing/src/data/site.ts` |
| Styles partagés v2 | `TalentDigital-Marketing/src/styles/v2.css` |
| Audit phase 1 | `docs/audit/2026-11-14-phase1-audit.md` |
| Stratégie phase 2 | `docs/strategy/2026-11-14-phase2-strategy.md` |
| Architecture et copy phase 3 | `docs/strategy/2026-11-15-phase3-architecture-copy.md` |
| Relevé automatique des pages | `node tools/audit-pages.mjs` |
| Détection de liens morts | `node tools/check-links.mjs` |

---

## 7. Après validation

Quand la grille est complète :

1. corrections page par page, puis `npm run build`
2. `node tools/audit-pages.mjs` pour vérifier titres et descriptions
3. `node tools/check-links.mjs` pour vérifier le maillage
4. `npm test` pour les API de formulaire
5. commit et déploiement
