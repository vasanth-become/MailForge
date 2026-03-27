import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PreviewMode = "desktop" | "mobile" | "gmail" | "code";

// TemplateId is now the full template id string (e.g. "pl-hero", "dc-flash")
// kept as a string type for flexibility as the registry grows
export type TemplateId = string;

export interface BrandSettings {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  footerText: string;
}

export interface TemplateContent {
  heading: string;
  subtext: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
  bodyText: string;
  // Discount-specific
  discountCode?: string;
  discountAmount?: string;
  expiryDate?: string;
  // Newsletter / multi-article
  articleHeading?: string;
  articleText?: string;
  articleImageUrl?: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  templateId: TemplateId;
  brand: BrandSettings;
  content: TemplateContent;
  savedAt: number;
}

interface MailStoreState {
  brand: BrandSettings;
  activeTemplateId: TemplateId;
  content: TemplateContent;
  previewMode: PreviewMode;
  savedTemplates: SavedTemplate[];
  isDarkPreview: boolean;

  setBrand: (brand: Partial<BrandSettings>) => void;
  setActiveTemplate: (id: TemplateId, defaultContent?: Partial<TemplateContent>) => void;
  setContent: (content: Partial<TemplateContent>) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  toggleDarkPreview: () => void;
  saveTemplate: (name: string) => void;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  resetContent: () => void;
}

const DEFAULT_BRAND: BrandSettings = {
  name: "Acme Corp",
  primaryColor: "#6366f1",
  secondaryColor: "#f59e0b",
  logoUrl: "",
  footerText: "© 2025 Acme Corp. All rights reserved.",
};

const DEFAULT_CONTENT: TemplateContent = {
  heading: "Introducing Our Latest Product",
  subtext: "We've been working hard to bring you something amazing.",
  imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  imageAlt: "Product image",
  ctaText: "Get Early Access",
  ctaLink: "https://example.com",
  bodyText:
    "Discover how our new product can transform your workflow. Built with precision and designed for performance, this is the tool you've been waiting for.",
  discountCode: "SAVE30",
  discountAmount: "30% OFF",
  expiryDate: "December 31, 2025",
  articleHeading: "Trends You Need to Know",
  articleText:
    "Stay ahead of the curve with our curated insights. This month we're covering the biggest shifts in the industry and what they mean for you.",
  articleImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
};

export const useMailStore = create<MailStoreState>()(
  persist(
    (set) => ({
      brand: DEFAULT_BRAND,
      activeTemplateId: "pl-hero",
      content: DEFAULT_CONTENT,
      previewMode: "desktop",
      savedTemplates: [],
      isDarkPreview: false,

      setBrand: (partial) =>
        set((s) => ({ brand: { ...s.brand, ...partial } })),

      // When switching templates, merge the template's defaultContent into
      // the current content so new fields are populated but user edits survive.
      setActiveTemplate: (id, defaultContent) =>
        set((s) => ({
          activeTemplateId: id,
          content: defaultContent
            ? { ...DEFAULT_CONTENT, ...defaultContent, ...s.content }
            : s.content,
        })),

      setContent: (partial) =>
        set((s) => ({ content: { ...s.content, ...partial } })),

      setPreviewMode: (mode) => set({ previewMode: mode }),

      toggleDarkPreview: () =>
        set((s) => ({ isDarkPreview: !s.isDarkPreview })),

      saveTemplate: (name) =>
        set((s) => {
          const entry: SavedTemplate = {
            id: `tpl_${Date.now()}`,
            name,
            templateId: s.activeTemplateId,
            brand: { ...s.brand },
            content: { ...s.content },
            savedAt: Date.now(),
          };
          return { savedTemplates: [entry, ...s.savedTemplates] };
        }),

      loadTemplate: (id) =>
        set((s) => {
          const tpl = s.savedTemplates.find((t) => t.id === id);
          if (!tpl) return {};
          return {
            activeTemplateId: tpl.templateId,
            brand: { ...tpl.brand },
            content: { ...tpl.content },
          };
        }),

      deleteTemplate: (id) =>
        set((s) => ({
          savedTemplates: s.savedTemplates.filter((t) => t.id !== id),
        })),

      resetContent: () => set({ content: DEFAULT_CONTENT }),
    }),
    { name: "mailforge-store-v2" } // version bump clears old persisted TemplateId format
  )
);
