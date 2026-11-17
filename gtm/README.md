# GTM — conteneur GTM-K2SDWZMF

Le site charge la balise Google **statiquement dans le `<head>`** (snippet officiel
`gtm.js?id=GTM-K2SDWZMF`), pour que Google la détecte. La mesure est bridée par
**Consent Mode v2** : `analytics_storage` et `ad_storage` sont à `denied` par défaut,
et passent à `granted` uniquement après acceptation du bandeau.

Le site pousse déjà deux événements dans `window.dataLayer` via `window.tdTrack`
(seulement si le consentement est accordé) :

| Événement | Paramètres | Déclencheur côté site |
| --- | --- | --- |
| `cta_click` | `cta`, `page`, `target` (`contact` ou `audit`) | clic sur un lien interne vers `/contact` ou `/audit` |
| `pdf_download` | `file`, `page` | clic sur un lien `.pdf` |

## 1. Import du conteneur (1 clic)

Fichier : `gtm/GTM-K2SDWZMF-container.json`

1. Ouvrir <https://tagmanager.google.com> → conteneur **GTM-K2SDWZMF**.
2. **Admin → Import Container**.
3. Choisir le fichier JSON, workspace « Default », option **Merge → Overwrite conflicting tags, triggers and variables**.
4. Confirmer, puis **Submit** → version « GA4 + événements site ».

Contenu importé :

- **Balise** `GA4 — Configuration` (type Google Tag, `G-62J5D8NLMW`, page vue activée).
- **Balise** `GA4 — Événement cta_click`.
- **Balise** `GA4 — Événement pdf_download`.
- **Déclencheurs** `CE — cta_click` et `CE — pdf_download` (événements personnalisés).
- **Variables** `DLV - cta`, `DLV - page`, `DLV - target`, `DLV - file`.

> L'ID de mesure `G-62J5D8NLMW` est repris dans la balise GA4, à modifier si tu utilises
> un nouveau flux de données.

## 2. Import manuel (si l'import JSON est refusé)

**Balise GA4 Configuration** — type « Google Tag », ID `G-62J5D8NLMW`, déclencheur « All Pages ».

**Déclencheur `CE — cta_click`** — type « Événement personnalisé », nom d'événement
correspondant à `cta_click`. Idem pour `CE — pdf_download` avec `pdf_download`.

**Balise `GA4 — Événement cta_click`** — type « Événement Google Analytics : GA4 »,
nom d'événement `cta_click`, paramètres `cta` → `{{DLV - cta}}`, `page` → `{{DLV - page}}`,
`target` → `{{DLV - target}}`, déclencheur `CE — cta_click`.

**Balise `GA4 — Événement pdf_download`** — nom d'événement `pdf_download`,
paramètres `file` → `{{DLV - file}}`, `page` → `{{DLV - page}}`, déclencheur `CE — pdf_download`.

**Variables** — 4 variables « Data Layer Variable » nommées `DLV - cta`, `DLV - page`,
`DLV - target`, `DLV - file`.

## 3. Vérification

1. Aperçu GTM sur `https://talentdigital.net`, accepter le bandeau.
2. Vérifier que `GA4 — Configuration` se déclenche sur chaque page.
3. Cliquer un CTA vers `/contact` et un lien PDF : les deux balises d'événement doivent apparaître
   avec leurs paramètres.
4. Publier, puis contrôler dans GA4 → Rapports → Temps réel (événements `cta_click`, `pdf_download`).

## Rappel technique

- Snippet statique dans `src/layouts/BaseLayout.astro`, dans le `<head>`, sur les 19 pages.
- `gtag('consent','default',{...denied})` est exécuté **avant** le chargement de `gtm.js`.
  À l'acceptation, `window.tdGrantConsent()` envoie `consent update` en `granted`.
  Au refus, `window.tdDenyConsent()` renvoie `denied`.
- `window.tdTrack` ne pousse un événement que si `window.__tdConsent === 'granted'`.
- Pas de `<noscript>` : les balises ne se déclenchent que côté JS.
- La CSP (`vercel.json`) autorise `googletagmanager.com`, `google-analytics.com`,
  `*.analytics.google.com`, `doubleclick.net` en script/connect/frame.
