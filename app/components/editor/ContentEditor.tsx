"use client";

import { useMailStore } from "@/lib/store/useMailStore";
import { getTemplate } from "@/lib/engine/registry";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import ImagePicker from "@/app/components/ui/ImagePicker";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function ContentEditor() {
  const { content, setContent, activeTemplateId } = useMailStore();

  // Derive category from the registry so this works with all 12 template IDs
  const tpl = getTemplate(activeTemplateId);
  const isDiscount   = tpl.category === "discount";
  const isNewsletter = tpl.category === "newsletter";
  // Templates with no dedicated image slot still accept an optional image
  const isMinimal = tpl.layout === "minimal";

  return (
    <div className="space-y-4">
      <SectionHeader title="Content" subtitle="Edit your email copy and assets" />

      <Input
        label="Heading"
        value={content.heading}
        onChange={(e) => setContent({ heading: e.target.value })}
        placeholder="Your main headline"
      />

      <Textarea
        label="Subtext"
        value={content.subtext}
        onChange={(e) => setContent({ subtext: e.target.value })}
        placeholder="A brief intro or tagline"
        rows={2}
      />

      <Textarea
        label={isNewsletter ? "Body / Lead Article" : "Body Text"}
        value={content.bodyText}
        onChange={(e) => setContent({ bodyText: e.target.value })}
        placeholder="Main body copy…"
        rows={4}
      />

      {/* ── Primary image ── */}
      <ImagePicker
        label="Primary Image"
        value={content.imageUrl}
        onChange={(v) => setContent({ imageUrl: v })}
        hint={
          isMinimal
            ? "Optional — this template works without an image"
            : "Recommended: 600 × 280 px for hero shots"
        }
      />
      <Input
        label="Image Alt Text"
        value={content.imageAlt}
        onChange={(e) => setContent({ imageAlt: e.target.value })}
        placeholder="Describe the image for screen readers"
      />

      {/* ── CTA ── */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Button Text"
          value={content.ctaText}
          onChange={(e) => setContent({ ctaText: e.target.value })}
          placeholder="Get Started"
        />
        <Input
          label="Button URL"
          value={content.ctaLink}
          onChange={(e) => setContent({ ctaLink: e.target.value })}
          placeholder="https://"
        />
      </div>

      {/* ── Discount-specific ── */}
      {isDiscount && (
        <div className="pt-3 border-t border-slate-100 space-y-4">
          <SectionHeader title="Promo Details" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Discount Amount"
              value={content.discountAmount || ""}
              onChange={(e) => setContent({ discountAmount: e.target.value })}
              placeholder="30% OFF"
            />
            <Input
              label="Promo Code"
              value={content.discountCode || ""}
              onChange={(e) => setContent({ discountCode: e.target.value })}
              placeholder="SAVE30"
            />
          </div>
          <Input
            label="Expiry Date"
            value={content.expiryDate || ""}
            onChange={(e) => setContent({ expiryDate: e.target.value })}
            placeholder="December 31, 2025"
          />
        </div>
      )}

      {/* ── Newsletter-specific ── */}
      {isNewsletter && (
        <div className="pt-3 border-t border-slate-100 space-y-4">
          <SectionHeader title="Second Article" />
          <Input
            label="Article Heading"
            value={content.articleHeading || ""}
            onChange={(e) => setContent({ articleHeading: e.target.value })}
            placeholder="Secondary article title"
          />
          <Textarea
            label="Article Text"
            value={content.articleText || ""}
            onChange={(e) => setContent({ articleText: e.target.value })}
            placeholder="Article body copy…"
            rows={3}
          />
          <ImagePicker
            label="Article Image"
            value={content.articleImageUrl || ""}
            onChange={(v) => setContent({ articleImageUrl: v })}
            hint="Optional — appears beside or above the article text"
          />
        </div>
      )}
    </div>
  );
}
