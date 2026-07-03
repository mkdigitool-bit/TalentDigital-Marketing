# TalentDigital — Restructuration de l'accueil pour la conversion

Date : 2026-07-03

## Contexte

L'accueil migré sur Astro (voir le plan [2026-07-03-astro-foundation-and-homepage](../plans/2026-07-03-astro-foundation-and-homepage.md)) reprend l'ordre de sections de l'ancien site Systeme.io tel quel. Une revue de cet ordre du point de vue conversion a révélé deux problèmes : la section d'identification de l'audience ("Pour qui") arrive trop tard (après Services et Processus), et le bandeau "outils compatibles" (logos WordPress, Shopify...) coupe l'élan juste après le CTA du hero pour un signal de confiance faible. Par ailleurs, la preuve concrète du travail livré (portfolio visuel) est absente — il n'y a que des témoignages texte.

## Nouvel ordre des sections

1. Hero
2. Pour qui *(déplacé — était en position 5, passe en position 2)*
3. Services
4. **Portfolio** *(nouvelle section)*
5. Témoignages
6. Processus *(décalé)*
7. FAQ
8. CTA final

Le bandeau "outils compatibles" (marquee WordPress/Shopify/etc.) est supprimé — signal de confiance faible pour une agence de services, et son emplacement actuel (juste après le CTA du hero) casse l'élan vers l'action.

Logique retenue : le visiteur se reconnaît d'abord (Pour qui) → découvre ce qu'on construit (Services) → voit une preuve visuelle concrète (Portfolio) → lit une preuve sociale en mots (Témoignages) → comprend comment ça se passe (Processus) → objections levées (FAQ) → action (CTA final).

## Section Portfolio (nouvelle)

**Format** : cartes façon "fenêtre d'app", cohérentes avec le composant `.console` déjà utilisé dans le hero (pur CSS/HTML, pas d'image générée ni de capture d'écran). Chaque carte : icône mono, nom du secteur, une ligne de résultat/promesse type. Fond `var(--panel)`, bordure `var(--lime)` au survol — même traitement visuel que les autres cartes du site (`.card`, `.mini`).

**Disposition** : grille 3 colonnes × 2 lignes (desktop), repliée à 2 puis 1 colonne en dessous de 880px/520px (mêmes points de rupture que le reste du site).

**Secteurs présentés (6)** :
1. Coachs & consultants
2. Formateurs & infopreneurs
3. E-commerce
4. Clinique & santé
5. Restaurant
6. Immobilier

Ces 6 secteurs couvrent à la fois la cible historique du site (coachs/formateurs/e-commerçants/infopreneurs) et l'élargissement vers les entreprises locales (santé, restauration, immobilier), décidé pendant ce brainstorm.

## Ajustement du texte du hero

Le sous-titre du hero est élargi pour ne plus exclure implicitement les secteurs locaux :

- Avant : *« Sites web, tunnels de vente et landing pages haute conversion pour coachs, formateurs, e-commerçants et infopreneurs. »*
- Après : *« Sites web, tunnels de vente et landing pages haute conversion pour entrepreneurs, professionnels et commerces qui veulent convertir plus de visiteurs en clients. »*

Aucun autre texte du hero (h1, badge, métriques) ne change.

## Hors périmètre

- Génération d'images/mockups photoréalistes pour le portfolio — remplacé par des cartes stylées en CSS, cohérentes avec l'existant.
- Ajout de vrais projets clients au portfolio — pourra remplacer les cartes génériques par secteur plus tard, si des cas clients réels deviennent disponibles.
- Réécriture du reste du contenu de chaque section (Services, Témoignages, Processus, FAQ) — seul l'ordre change, le contenu existant est conservé tel quel.
