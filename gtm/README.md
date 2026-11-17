# GTM â€” conteneur GTM-K2SDWZMF

Le site charge la balise Google **statiquement dans le `<head>`** (snippet officiel
`gtm.js?id=GTM-K2SDWZMF`), pour que Google la dÃ©tecte. La mesure est bridÃ©e par
**Consent Mode v2** : `analytics_storage` et `ad_storage` sont Ã  `denied` par dÃ©faut,
et passent Ã  `granted` uniquement aprÃ¨s acceptation du bandeau.

Le site pousse dÃ©jÃ  deux Ã©vÃ©nements dans `window.dataLayer` via `window.tdTrack`
(seulement si le consentement est accordÃ©) :

| Ã‰vÃ©nement | ParamÃ¨tres | DÃ©clencheur cÃ´tÃ© site |
| --- | --- | --- |
| `cta_click` | `cta`, `page`, `target` (`contact` ou `audit`) | clic sur un lien interne vers `/contact` ou `/audit` |
| `pdf_download` | `file`, `page` | clic sur un lien `.pdf` |

## 1. Import du conteneur (1 clic)

Fichier : `gtm/GTM-K2SDWZMF-container.json`

1. Ouvrir <https://tagmanager.google.com> â†’ conteneur **GTM-K2SDWZMF**.
2. **Admin â†’ Import Container**.
3. Choisir le fichier JSON, workspace Â« Default Â», option **Merge â†’ Overwrite conflicting tags, triggers and variables**.
4. Confirmer, puis **Submit** â†’ version Â« GA4 + Ã©vÃ©nements site Â».

Contenu importÃ© :

- **Balise** `GA4 â€” Configuration` (type Google Tag, `G-57HZ8RC104`, page vue activÃ©e).
- **Balise** `GA4 â€” Ã‰vÃ©nement cta_click`.
- **Balise** `GA4 â€” Ã‰vÃ©nement pdf_download`.
- **DÃ©clencheurs** `CE â€” cta_click` et `CE â€” pdf_download` (Ã©vÃ©nements personnalisÃ©s).
- **Variables** `DLV - cta`, `DLV - page`, `DLV - target`, `DLV - file`.

> L'ID de mesure `G-57HZ8RC104` est repris dans la balise GA4, Ã  modifier si tu utilises
> un nouveau flux de donnÃ©es.

## 2. Import manuel (si l'import JSON est refusÃ©)

**Balise GA4 Configuration** â€” type Â« Google Tag Â», ID `G-57HZ8RC104`, dÃ©clencheur Â« All Pages Â».

**DÃ©clencheur `CE â€” cta_click`** â€” type Â« Ã‰vÃ©nement personnalisÃ© Â», nom d'Ã©vÃ©nement
correspondant Ã  `cta_click`. Idem pour `CE â€” pdf_download` avec `pdf_download`.

**Balise `GA4 â€” Ã‰vÃ©nement cta_click`** â€” type Â« Ã‰vÃ©nement Google Analytics : GA4 Â»,
nom d'Ã©vÃ©nement `cta_click`, paramÃ¨tres `cta` â†’ `{{DLV - cta}}`, `page` â†’ `{{DLV - page}}`,
`target` â†’ `{{DLV - target}}`, dÃ©clencheur `CE â€” cta_click`.

**Balise `GA4 â€” Ã‰vÃ©nement pdf_download`** â€” nom d'Ã©vÃ©nement `pdf_download`,
paramÃ¨tres `file` â†’ `{{DLV - file}}`, `page` â†’ `{{DLV - page}}`, dÃ©clencheur `CE â€” pdf_download`.

**Variables** â€” 4 variables Â« Data Layer Variable Â» nommÃ©es `DLV - cta`, `DLV - page`,
`DLV - target`, `DLV - file`.

## 3. VÃ©rification

1. AperÃ§u GTM sur `https://talentdigital.net`, accepter le bandeau.
2. VÃ©rifier que `GA4 â€” Configuration` se dÃ©clenche sur chaque page.
3. Cliquer un CTA vers `/contact` et un lien PDF : les deux balises d'Ã©vÃ©nement doivent apparaÃ®tre
   avec leurs paramÃ¨tres.
4. Publier, puis contrÃ´ler dans GA4 â†’ Rapports â†’ Temps rÃ©el (Ã©vÃ©nements `cta_click`, `pdf_download`).

## Rappel technique

- Snippet statique dans `src/layouts/BaseLayout.astro`, dans le `<head>`, sur les 19 pages.
- `gtag('consent','default',{...denied})` est exÃ©cutÃ© **avant** le chargement de `gtm.js`.
  Ã€ l'acceptation, `window.tdGrantConsent()` envoie `consent update` en `granted`.
  Au refus, `window.tdDenyConsent()` renvoie `denied`.
- `window.tdTrack` ne pousse un Ã©vÃ©nement que si `window.__tdConsent === 'granted'`.
- Pas de `<noscript>` : les balises ne se dÃ©clenchent que cÃ´tÃ© JS.
- La CSP (`vercel.json`) autorise `googletagmanager.com`, `google-analytics.com`,
  `*.analytics.google.com`, `doubleclick.net` en script/connect/frame.
