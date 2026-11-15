/**
 * Métadonnées des articles de blog.
 * Le contenu complet vit dans src/pages/blog/*.astro ; ce fichier sert
 * uniquement à lister les articles (index, articles liés, sitemap interne).
 *
 * `related` porte l'accroche propre au lien : deux articles qui se citent
 * mutuellement n'affichent donc jamais le même texte.
 */

export interface RelatedLink {
  slug: string;
  why: string;
}

export interface RelatedPost extends PostMeta {
  why: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  date: string;
  updated?: string;
  readingTime: string;
  lede: string;
  /** Texte du bandeau final, propre à chaque article. */
  ctaText: string;
  related: RelatedLink[];
}

export const posts: PostMeta[] = [
  {
    slug: 'audit-marketing-ce-quil-doit-contenir',
    title: 'Un audit marketing sert à décider, pas à décorer',
    seoTitle: 'Audit marketing : ce qu’il doit contenir',
    description:
      'Un audit marketing utile contient des constats sourcés, des causes identifiées, des priorités classées et un plan d’action avec critères d’arrêt.',
    category: 'Conseil',
    date: '2026-11-15',
    readingTime: '9 min',
    lede:
      'Beaucoup d’audits marketing ressemblent à un inventaire : tout ce qui existe est listé, rien n’est tranché. Un audit qui ne permet pas de décider coûte du temps et ne change aucune décision. Voici ce qu’il doit contenir pour être utile.',
    ctaText:
      'Si vous avez déjà un audit qui ne vous a pas aidé à décider, c’est le bon point de départ pour en parler.',
    related: [
      {
        slug: 'seo-ou-publicite-comment-choisir',
        why: 'Un audit débouche souvent sur un arbitrage entre canaux. Ce texte donne les critères.',
      },
      {
        slug: 'refaire-son-site-probleme-de-conversion',
        why: 'Quand le diagnostic pointe le site, encore faut-il savoir quoi corriger avant de le refaire.',
      },
    ],
  },
  {
    slug: 'seo-ou-publicite-comment-choisir',
    title: 'SEO ou publicité : la question est mal posée',
    seoTitle: 'SEO ou publicité : comment choisir',
    description:
      'SEO et publicité ne répondent pas à la même situation. Demande existante ou à créer, budget, délai, capacité de production : les critères pour choisir, sans dogme.',
    category: 'Acquisition',
    date: '2026-11-15',
    readingTime: '8 min',
    lede:
      '« On fait du SEO ou on fait de la pub ? » La question suppose que les deux canaux sont interchangeables. Ils ne le sont pas : ils répondent à des situations différentes et ne coûtent pas la même chose dans le temps.',
    ctaText:
      'Avant d’arbitrer entre SEO et publicité, il faut savoir quelle demande existe déjà sur votre marché. C’est ce que nous regardons d’abord.',
    related: [
      {
        slug: 'audit-marketing-ce-quil-doit-contenir',
        why: 'Choisir un canal suppose un diagnostic préalable : voici ce qu’il doit contenir pour être utilisable.',
      },
      {
        slug: 'refaire-son-site-probleme-de-conversion',
        why: 'Investir dans le trafic n’a de sens que si la page qui reçoit ce trafic convertit.',
      },
    ],
  },
  {
    slug: 'refaire-son-site-probleme-de-conversion',
    title: 'Refaire son site ne règle pas un problème de conversion',
    seoTitle: 'Refaire son site ne règle pas la conversion',
    description:
      'Si un site reçoit du trafic sans générer de demandes, le problème est rarement visuel. Message, offre, preuve, parcours : les quatre causes réelles.',
    category: 'Conversion',
    date: '2026-11-15',
    readingTime: '7 min',
    lede:
      'Quand un site ne convertit pas, la réaction la plus fréquente est de le refaire. C’est souvent le projet le plus cher pour le moins de résultat, parce qu’il traite un problème de forme alors que la cause est ailleurs.',
    ctaText:
      'Si refaire le site est la première idée qui vient, nous commençons par vérifier ce qui bloque réellement — parfois c’est ailleurs, et bien moins cher.',
    related: [
      {
        slug: 'audit-marketing-ce-quil-doit-contenir',
        why: 'Refondre est une décision coûteuse : ce texte explique comment la documenter avant de signer.',
      },
      {
        slug: 'seo-ou-publicite-comment-choisir',
        why: 'Une fois le parcours corrigé, reste à choisir comment amener du trafic — et à quel rythme.',
      },
    ],
  },
];

export function getPost(slug: string): PostMeta {
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`Article introuvable : ${slug}`);
  return post;
}

export function getRelated(slug: string): RelatedPost[] {
  const post = getPost(slug);
  return post.related
    .map(({ slug: relatedSlug, why }) => {
      const found = posts.find((p) => p.slug === relatedSlug);
      return found ? { ...found, why } : null;
    })
    .filter((p): p is RelatedPost => Boolean(p));
}
