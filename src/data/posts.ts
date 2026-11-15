/**
 * Métadonnées des articles de blog.
 * Le contenu complet vit dans src/pages/blog/*.astro ; ce fichier sert
 * uniquement à lister les articles (index, articles liés, sitemap interne).
 */

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
  related: string[];
}

export const posts: PostMeta[] = [
  {
    slug: 'audit-marketing-ce-quil-doit-contenir',
    title: 'Un audit marketing sert à décider, pas à décorer',
    seoTitle: 'Audit marketing : ce qu’il doit contenir pour servir à quelque chose',
    description:
      'Un audit marketing utile contient des constats sourcés, des causes identifiées, des priorités classées et un plan d’action avec critères d’arrêt. Voici la structure, section par section.',
    category: 'Conseil',
    date: '2026-11-15',
    readingTime: '9 min',
    lede:
      'Beaucoup d’audits marketing ressemblent à un inventaire : tout ce qui existe est listé, rien n’est tranché. Un audit qui ne permet pas de décider coûte du temps et ne change aucune décision. Voici ce qu’il doit contenir pour être utile.',
    related: ['seo-ou-publicite-comment-choisir', 'refaire-son-site-probleme-de-conversion'],
  },
  {
    slug: 'seo-ou-publicite-comment-choisir',
    title: 'SEO ou publicité : la question est mal posée',
    seoTitle: 'SEO ou publicité payante : comment choisir selon votre marché',
    description:
      'SEO et publicité ne répondent pas à la même situation. Demande existante ou à créer, budget, délai, capacité de production : les critères pour choisir, sans dogme.',
    category: 'Acquisition',
    date: '2026-11-15',
    readingTime: '8 min',
    lede:
      '« On fait du SEO ou on fait de la pub ? » La question suppose que les deux canaux sont interchangeables. Ils ne le sont pas : ils répondent à des situations différentes et ne coûtent pas la même chose dans le temps.',
    related: ['audit-marketing-ce-quil-doit-contenir', 'refaire-son-site-probleme-de-conversion'],
  },
  {
    slug: 'refaire-son-site-probleme-de-conversion',
    title: 'Refaire son site ne règle pas un problème de conversion',
    seoTitle: 'Refaire son site ne règle pas un problème de conversion',
    description:
      'Si un site reçoit du trafic sans générer de demandes, le problème est rarement visuel. Message, offre, preuve, parcours : les quatre causes réelles, et comment les diagnostiquer avant de refondre.',
    category: 'Conversion',
    date: '2026-11-15',
    readingTime: '7 min',
    lede:
      'Quand un site ne convertit pas, la réaction la plus fréquente est de le refaire. C’est souvent le projet le plus cher pour le moins de résultat, parce qu’il traite un problème de forme alors que la cause est ailleurs.',
    related: ['audit-marketing-ce-quil-doit-contenir', 'seo-ou-publicite-comment-choisir'],
  },
];

export function getPost(slug: string): PostMeta {
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`Article introuvable : ${slug}`);
  return post;
}

export function getRelated(slug: string): PostMeta[] {
  const post = getPost(slug);
  return post.related
    .map((s) => posts.find((p) => p.slug === s))
    .filter((p): p is PostMeta => Boolean(p));
}
