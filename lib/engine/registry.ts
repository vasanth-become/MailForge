/**
 * Template Registry
 *
 * Single source of truth for all 12 email templates.
 * Each entry defines metadata + a render function reference.
 * The UI reads this registry to build the template picker.
 */

import type { BrandSettings, TemplateContent } from "@/lib/store/useMailStore";
import { renderPlHero, renderPlMinimal, renderPlFeatures, renderPlDark } from "./templates/productLaunch";
import { renderDcCode, renderDcFlash, renderDcWelcome, renderDcSeasonal } from "./templates/discount";
import { renderNlEditorial, renderNlDigest, renderNlAnnouncement, renderNlProductUpdate } from "./templates/newsletter";

export type TemplateCategory = "product-launch" | "discount" | "newsletter";
export type TemplateLayout =
  | "hero" | "minimal" | "feature-list" | "dark"
  | "promo-code" | "flash-sale" | "welcome" | "seasonal"
  | "editorial" | "digest" | "announcement" | "product-update";

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  layout: TemplateLayout;
  /** Real-world use case hint shown in the UI */
  useCase: string;
  /** Default content that makes sense for this template's structure */
  defaultContent: Partial<TemplateContent>;
  render: (brand: BrandSettings, content: TemplateContent) => string;
}

/* ─── Default content per template ────────────────────────────────────────
   Each template ships with content that matches its layout and use case.
   When a user switches templates, their edited content is preserved;
   these defaults only apply when a template is first selected.
────────────────────────────────────────────────────────────────────────── */

const plDefaults: Partial<TemplateContent> = {
  heading: "Introducing Our Latest Product",
  subtext: "We've been working hard to bring you something amazing. Today, that something is here.",
  bodyText: "Designed for teams that move fast without breaking things. Built on the feedback of thousands of users, every detail has been refined to help you do your best work.",
  imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  imageAlt: "Product showcase",
  ctaText: "Get Early Access",
  ctaLink: "https://example.com",
};

const dcDefaults: Partial<TemplateContent> = {
  heading: "Shop Our Best Deals",
  subtext: "For a limited time, enjoy exclusive savings on everything in our store.",
  bodyText: "Whether you've been eyeing something for months or just browsing, there's no better time to buy. Every purchase comes with free shipping and our 30-day guarantee.",
  imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  imageAlt: "Products on sale",
  ctaText: "Shop the Sale",
  ctaLink: "https://example.com",
  discountAmount: "30% OFF",
  discountCode: "SAVE30",
  expiryDate: "December 31, 2025",
  articleHeading: "More Styles, More Savings",
  articleText: "Browse our extended collection for even more discounted items.",
};

const nlDefaults: Partial<TemplateContent> = {
  heading: "Your Monthly Update from Our Team",
  subtext: "Here's what we've been up to, what's new, and what's coming next.",
  bodyText: "This month we shipped 14 improvements, onboarded 200 new customers, and hit a milestone we've been working toward for two years. We're grateful for every one of you who made this possible.",
  imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
  imageAlt: "Newsletter header image",
  ctaText: "Read on the Web",
  ctaLink: "https://example.com",
  articleHeading: "Industry Trends Worth Watching",
  articleText: "Three shifts happening right now that will define how teams operate over the next decade — and what you can do to stay ahead.",
  articleImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
};

/* ─── Registry ─────────────────────────────────────────────────────────── */

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  // ── Product Launch ──────────────────────────────────────────────────────
  {
    id: "pl-hero",
    name: "Hero Showcase",
    category: "product-launch",
    layout: "hero",
    description: "Full hero image with stacked feature highlights",
    useCase: "Major product launch, SaaS release",
    defaultContent: plDefaults,
    render: renderPlHero,
  },
  {
    id: "pl-minimal",
    name: "Clean Announcement",
    category: "product-launch",
    layout: "minimal",
    description: "Typography-focused, no image required, accent quote block",
    useCase: "API release, SDK update, policy change",
    defaultContent: plDefaults,
    render: renderPlMinimal,
  },
  {
    id: "pl-features",
    name: "Feature Spotlight",
    category: "product-launch",
    layout: "feature-list",
    description: "Numbered feature blocks with alternating background rows",
    useCase: "Multi-feature update, app version release",
    defaultContent: plDefaults,
    render: renderPlFeatures,
  },
  {
    id: "pl-dark",
    name: "Dark Launch",
    category: "product-launch",
    layout: "dark",
    description: "Full dark theme with glowing accent details",
    useCase: "Gaming, dev tools, premium product reveal",
    defaultContent: plDefaults,
    render: renderPlDark,
  },

  // ── Discount Promo ──────────────────────────────────────────────────────
  {
    id: "dc-code",
    name: "Promo Code",
    category: "discount",
    layout: "promo-code",
    description: "Big discount badge, dashed code box, product image",
    useCase: "Newsletter coupon, standard discount campaign",
    defaultContent: dcDefaults,
    render: renderDcCode,
  },
  {
    id: "dc-flash",
    name: "Flash Sale",
    category: "discount",
    layout: "flash-sale",
    description: "High-urgency red banner, bold stat row, expiry bar",
    useCase: "24-hour flash sale, Black Friday, limited stock",
    defaultContent: { ...dcDefaults, discountAmount: "50% OFF", discountCode: "FLASH50" },
    render: renderDcFlash,
  },
  {
    id: "dc-welcome",
    name: "Welcome Offer",
    category: "discount",
    layout: "welcome",
    description: "Warm onboarding tone with value props + code box",
    useCase: "First purchase incentive, welcome email series",
    defaultContent: { ...dcDefaults, discountAmount: "15% OFF", discountCode: "WELCOME15" },
    render: renderDcWelcome,
  },
  {
    id: "dc-seasonal",
    name: "Seasonal Sale",
    category: "discount",
    layout: "seasonal",
    description: "Multi-section layout with product showcase + secondary article",
    useCase: "Holiday, Summer, Back-to-School campaigns",
    defaultContent: { ...dcDefaults, discountAmount: "Up to 40% OFF", discountCode: "SEASON40" },
    render: renderDcSeasonal,
  },

  // ── Newsletter ──────────────────────────────────────────────────────────
  {
    id: "nl-editorial",
    name: "Editorial",
    category: "newsletter",
    layout: "editorial",
    description: "Lead article with image + secondary article section",
    useCase: "Weekly roundup, brand storytelling, company blog",
    defaultContent: nlDefaults,
    render: renderNlEditorial,
  },
  {
    id: "nl-digest",
    name: "Weekly Digest",
    category: "newsletter",
    layout: "digest",
    description: "4 numbered article teasers with tags and excerpts",
    useCase: "Content digest, curated links, industry roundup",
    defaultContent: nlDefaults,
    render: renderNlDigest,
  },
  {
    id: "nl-announcement",
    name: "Company Update",
    category: "newsletter",
    layout: "announcement",
    description: "Founder-tone letter with 3 key update rows",
    useCase: "Company milestone, investor update, team memo",
    defaultContent: nlDefaults,
    render: renderNlAnnouncement,
  },
  {
    id: "nl-product-update",
    name: "Product Update",
    category: "newsletter",
    layout: "product-update",
    description: "Versioned changelog with numbered & tagged update items",
    useCase: "SaaS release notes, app update, feature ship",
    defaultContent: nlDefaults,
    render: renderNlProductUpdate,
  },
];

/* ─── Helpers ──────────────────────────────────────────────────────────── */

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) ?? TEMPLATE_REGISTRY[0];
}

export function getTemplatesByCategory(category: TemplateCategory): TemplateDefinition[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}

export function renderEmail(
  templateId: string,
  brand: BrandSettings,
  content: TemplateContent
): string {
  const tpl = getTemplate(templateId);
  return tpl.render(brand, content);
}
