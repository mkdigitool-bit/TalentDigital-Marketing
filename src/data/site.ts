/**
 * Source unique de vérité pour la marque, la navigation et les contenus
 * structurants du site. Toute page qui a besoin d'une de ces données
 * l'importe depuis ici plutôt que de la recopier.
 */

export const site = {
  name: 'TalentDigital',
  domain: 'https://talentdigital.net',
  email: 'info@talentdigital.net',
  phone: '+212663206266',
  phoneDisplay: '+212 6 63 20 62 66',
  whatsapp: 'https://wa.me/212663206266',
  descriptor: 'Marketing Consulting & Digital Solutions',
  signature: 'Stratégie. Marketing. Transformation digitale.',
  tagline: 'Le conseil marketing qui va jusqu’à l’exécution.',
  reason:
    'Les entreprises ne manquent pas d’outils digitaux. Elles manquent de direction.',
  promise:
    'Structurer votre marketing, gagner en visibilité et transformer votre présence digitale en acquisition régulière.',
  social: {
    facebook: 'https://web.facebook.com/profile.php?id=61591458964277',
    instagram: 'https://www.instagram.com/talentdigital_marketing/',
    youtube: 'https://www.youtube.com/channel/UC6Go6dqDfIq-xLnOyx5goTA',
    pinterest: 'https://fr.pinterest.com/TalentDigitalMarketing/',
  },
  areas: ['MA', 'FR', 'BE', 'CH', 'CA'],
} as const;

export const cta = {
  primary: { label: 'Discutons de votre projet', href: '/contact' },
  audit: { label: 'Demander un audit', href: '/audit' },
  method: { label: 'Découvrir la méthode', href: '/methode' },
} as const;

export const nav = [
  { label: 'Consulting', href: '/consulting-marketing' },
  { label: 'Marketing digital', href: '/marketing-digital' },
  { label: 'Solutions digitales', href: '/solutions-digitales' },
  { label: 'Méthode', href: '/methode' },
  { label: 'Ressources', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
] as const;

export const poles = [
  {
    no: '01',
    name: 'Consulting marketing',
    href: '/consulting-marketing',
    kicker: 'Ce qui se vend en premier',
    promise: 'Décider où investir, avec méthode.',
    desc: 'Un diagnostic de votre situation, une stratégie priorisée et un plan d’action que vous pouvez exécuter — avec ou sans nous.',
    items: [
      'Audit marketing et digital',
      'Stratégie marketing et plan d’action',
      'Positionnement de marque',
      'Analyse de marché et concurrence',
      'Stratégie d’acquisition clients',
    ],
  },
  {
    no: '02',
    name: 'Marketing digital',
    href: '/marketing-digital',
    kicker: 'Ce qui installe l’acquisition',
    promise: 'Choisir les bons canaux, puis les piloter.',
    desc: 'Référencement, publicité, contenu, email, conversion : les canaux sont sélectionnés selon votre marché et suivis sur des indicateurs de résultat.',
    items: [
      'Référencement naturel (SEO)',
      'Publicité digitale (Meta, Google)',
      'Stratégie de contenu',
      'Email marketing et génération de leads',
      'Optimisation des conversions (CRO)',
    ],
  },
  {
    no: '03',
    name: 'Solutions digitales',
    href: '/solutions-digitales',
    kicker: 'Ce qui rend la stratégie exécutable',
    promise: 'Construire des supports qui travaillent.',
    desc: 'Sites, pages de vente, tunnels et automatisations : des supports conçus pour convertir, mesurables, et qui restent votre propriété.',
    items: [
      'Sites web et e-commerce',
      'Landing pages et pages de vente',
      'Tunnels de vente',
      'Formulaires et capture de prospects',
      'Automatisation et intégration d’outils',
    ],
  },
] as const;

export const method = [
  {
    no: '01',
    name: 'Diagnostiquer',
    title: 'Comprendre avant d’agir',
    desc: 'Entretiens, analyse des canaux, lecture des données disponibles, revue du parcours client. On cherche ce qui bloque vraiment, pas ce qui se voit.',
    deliverable: 'Audit écrit : constats, causes, priorités',
  },
  {
    no: '02',
    name: 'Décider',
    title: 'Choisir avant de dépenser',
    desc: 'Une stratégie priorisée : quel objectif d’abord, quel canal ensuite, quel budget pour quel délai. Chaque choix est justifié et chiffré.',
    deliverable: 'Plan d’action : priorité, effort, budget, indicateur',
  },
  {
    no: '03',
    name: 'Déployer',
    title: 'Exécuter sans zone grise',
    desc: 'Site, tunnel, campagne, contenu, automatisation : ce qui doit être construit l’est dans un périmètre écrit, avec des livrables nommés.',
    deliverable: 'Supports livrés, documentés, transférés',
  },
  {
    no: '04',
    name: 'Mesurer',
    title: 'Mesurer avant de recommencer',
    desc: 'Un tableau de bord lisible, des indicateurs choisis à l’avance, et une revue régulière pour décider quoi arrêter, quoi renforcer.',
    deliverable: 'Tableau de bord et revue de performance',
  },
] as const;

export const deliverables = [
  {
    name: 'Audit marketing & digital',
    format: 'Document écrit, 20 à 40 pages selon le périmètre',
    contains:
      'Constats sourcés, analyse des canaux, parcours client, concurrence, priorités classées par impact et effort.',
  },
  {
    name: 'Plan d’action priorisé',
    format: 'Tableau de décision, une page par chantier',
    contains:
      'Objectif, action, responsable, budget indicatif, délai, indicateur de succès et critère d’arrêt.',
  },
  {
    name: 'Plateforme de marque',
    format: 'Document de cadrage, 10 à 15 pages',
    contains:
      'Positionnement, promesse, messages par segment, preuves disponibles, vocabulaire à employer et à éviter.',
  },
  {
    name: 'Architecture d’acquisition',
    format: 'Schéma + tableau des canaux',
    contains:
      'Canaux retenus, rôle de chacun, budget, indicateurs, et ce qui doit être mesuré pour décider.',
  },
  {
    name: 'Supports digitaux',
    format: 'Site, pages, tunnel, automatisations',
    contains:
      'Design, intégration, tracking, documentation de prise en main. Les accès et la propriété restent au client.',
  },
  {
    name: 'Tableau de bord',
    format: 'GA4 + Looker Studio ou équivalent',
    contains:
      'Quatre à six indicateurs utiles, pas trente. Une lecture hebdomadaire ou mensuelle, pas un rapport décoratif.',
  },
] as const;

export const scopes = {
  yes: [
    'Diagnostiquer avant de proposer',
    'Écrire le périmètre, les livrables et les limites',
    'Annoncer un prix ou une fourchette avant de commencer',
    'Choisir les outils selon le besoin du client',
    'Documenter et transférer ce qui est construit',
  ],
  no: [
    'Promettre un chiffre de résultats garanti',
    'Inventer des témoignages ou des références clients',
    'Vendre de l’exécution sans diagnostic préalable',
    'Imposer un outil ou retenir les accès du client',
    'Facturer un périmètre qui n’était pas écrit',
  ],
} as const;

export const segments = [
  {
    tag: 'Segment 01 — priorité',
    name: 'PME et entreprises de services',
    who: '5 à 50 personnes · Maroc, France, Belgique, Suisse',
    problem:
      'Présence digitale dispersée, budget marketing sans cap, dépendance au bouche-à-oreille.',
    trigger: 'Croissance qui plafonne, concurrent plus visible, site à refaire.',
    message: 'Vous investissez déjà dans le digital. La question, c’est de savoir ce qui rapporte.',
    entry: 'Audit marketing & digital',
  },
  {
    tag: 'Segment 02',
    name: 'Consultants, coachs, formateurs',
    who: 'Indépendants et petites structures de formation',
    problem:
      'Offre peu lisible, acquisition irrégulière, dépendance aux recommandations.',
    trigger: 'Lancement d’une offre, besoin de remplir un agenda ou une session.',
    message: 'Votre expertise est solide. Votre marketing ne la reflète pas encore.',
    entry: 'Audit de positionnement + plan d’acquisition',
  },
  {
    tag: 'Segment 03',
    name: 'E-commerçants et entreprises en croissance',
    who: 'Boutiques en ligne, marques émergentes',
    problem:
      'Trafic qui n’achète pas, panier moyen faible, coût d’acquisition qui grimpe.',
    trigger: 'Publicité qui ne rentabilise plus, taux de conversion en baisse.',
    message: 'Plus de trafic ne réglera pas un problème de conversion.',
    entry: 'Audit de tunnel et de parcours d’achat',
  },
] as const;

export const faqHome = [
  {
    q: 'Qu’est-ce qu’un audit marketing & digital, concrètement ?',
    a: 'C’est un diagnostic écrit de votre situation : ce que vous faites déjà, ce que ça produit, ce qui bloque et ce qu’il faut traiter en priorité. Il se termine par un plan d’action classé par impact et par effort, que vous pouvez exécuter seul ou avec nous.',
  },
  {
    q: 'Faut-il obligatoirement passer par un audit pour travailler avec vous ?',
    a: 'Pour une mission de conseil ou un projet d’exécution, oui. Nous ne proposons pas de devis sur une intuition : le périmètre et le prix se décident après avoir compris la situation. C’est aussi ce qui évite les mauvaises surprises des deux côtés.',
  },
  {
    q: 'Travaillez-vous avec des entreprises hors du Maroc ?',
    a: 'Oui. Le Maroc est notre marché d’ancrage, et nous accompagnons également des clients en France, en Belgique, en Suisse et au Canada. Le travail se fait à distance, avec des points de suivi fixés à l’avance.',
  },
  {
    q: 'Combien coûte un accompagnement ?',
    a: 'Les fourchettes sont annoncées avant de commencer, jamais après. Un audit seul, une mission de conseil et un projet d’exécution n’ont pas le même prix. Le devis précise ce qui est inclus, ce qui ne l’est pas, et à quelle échéance.',
  },
  {
    q: 'Est-ce que vous garantissez des résultats ?',
    a: 'Non. Personne ne peut garantir un nombre de leads, une position Google ou un chiffre d’affaires. Ce qui est garanti, c’est la méthode, le périmètre écrit, les livrables et le fait que vous gardez la propriété de tout ce qui est produit.',
  },
  {
    q: 'Qui exécute le travail ?',
    a: 'La personne qui vous conseille est celle qui exécute. Aucun chef de projet ne transmet votre dossier à un sous-traitant anonyme. Sur certains projets techniques, des partenaires ponctuels peuvent intervenir, toujours sous notre responsabilité et avec votre accord.',
  },
  {
    q: 'Pouvez-vous reprendre un site ou des campagnes existantes ?',
    a: 'Oui, et c’est fréquent. La première étape consiste alors à auditer l’existant : ce qui fonctionne est conservé, ce qui coûte sans produire est arrêté ou corrigé. On ne repart pas de zéro par principe.',
  },
  {
    q: 'En quoi êtes-vous différents d’une agence web ?',
    a: 'Une agence web vend un livrable. Nous vendons d’abord une décision : où mettre votre budget et pourquoi. Le site, le tunnel ou la campagne viennent ensuite, comme conséquence de cette décision — pas comme point de départ.',
  },
] as const;
