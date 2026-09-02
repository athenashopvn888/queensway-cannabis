export interface TierSeoData {
  h1: string;
  seoTitle: string;
  seoIntro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const sharedBody =
  "Use the product information shown with each item to compare this collection. You can also explore the other Queensway Cannabis Dispensary Weed flower collections before choosing what interests you.";

function tierContent(label: string): TierSeoData {
  return {
    h1: `${label} & Cannabis Flower in Etobicoke`,
    seoTitle: `${label} & Cannabis Flower Etobicoke | Queensway Cannabis Dispensary`,
    seoIntro: `Queensway Cannabis Dispensary organizes Cannabis Flower across five Weed collections for shoppers exploring flower in Etobicoke. Browse this ${label} collection, review the information presented with individual products, and compare it with other Queensway Cannabis Dispensary flower collections that interest you.`,
    sections: [
      {
        heading: `Compare the ${label} collection`,
        body: sharedBody,
      },
    ],
    faqs: [],
  };
}

export const TIER_SEO: Record<string, TierSeoData> = {
  EXOTIC: tierContent("Exotic Weed"),
  PREMIUM: tierContent("Premium Weed"),
  "AAA+": tierContent("AAA+ Weed"),
  AA: tierContent("AA Weed"),
  BUDGET: tierContent("Budget Weed"),
};
