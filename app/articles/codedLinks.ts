import type { CodedArticleLink } from "../lib/fleet/articles";
import { GUIDE_REGISTRY } from "../lib/guideRegistry";

/** Coded resource URLs win a slug clash with a fleet article. */
export function codedArticleLinks(): CodedArticleLink[] {
  return [
    { slug: "weed-flower-guide", title: "Weed & Flower Guide", href: "/resources/weed-flower-guide" },
    { slug: "guides", title: "Name Guides", href: "/guides" },
    ...GUIDE_REGISTRY.map((guide) => ({
      slug: guide.slug,
      title: guide.title,
      href: `/guides/${guide.slug}`,
    })),
  ];
}
