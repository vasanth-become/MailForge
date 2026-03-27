"use client";

import { useMailStore } from "@/lib/store/useMailStore";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function ContentEditor() {
  const { content, setContent, activeTemplateId } = useMailStore();

  const isDiscount = activeTemplateId === "discount";
  const isNewsletter = activeTemplateId === "newsletter";

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
        label={isNewsletter ? "Article Body" : "Body Text"}
        value={content.bodyText}
        onChange={(e) => setContent({ bodyText: e.target.value })}
        placeholder="Main body copy..."
        rows={4}
      />

      {/* Image */}
      <Input
        label="Image URL"
        value={content.imageUrl}
        onChange={(e) => setContent({ imageUrl: e.target.value })}
        placeholder="https://example.com/image.jpg"
        hint="Recommended: 600×280px for hero, 200×140px for inline"
      />
      <Input
        label="Image Alt Text"
        value={content.imageAlt}
        onChange={(e) => setContent({ imageAlt: e.target.value })}
        placeholder="Descriptive alt text"
      />

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Button Text"
          value={content.ctaText}
          onChange={(e) => setContent({ ctaText: e.target.value })}
          placeholder="Shop Now"
        />
        <Input
          label="Button Link"
          value={content.ctaLink}
          onChange={(e) => setContent({ ctaLink: e.target.value })}
          placeholder="https://"
        />
      </div>

      {/* Discount-specific fields */}
      {isDiscount && (
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <SectionHeader title="Promo Details" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Discount Amount"
              value={content.discountAmount || ""}
              onChange={(e) => setContent({ discountAmount: e.target.value })}
              placeholder="20% OFF"
            />
            <Input
              label="Promo Code"
              value={content.discountCode || ""}
              onChange={(e) => setContent({ discountCode: e.target.value })}
              placeholder="SAVE20"
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

      {/* Newsletter-specific fields */}
      {isNewsletter && (
        <div className="pt-2 border-t border-slate-100 space-y-4">
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
            placeholder="Article content..."
            rows={3}
          />
          <Input
            label="Article Image URL"
            value={content.articleImageUrl || ""}
            onChange={(e) => setContent({ articleImageUrl: e.target.value })}
            placeholder="https://example.com/article.jpg"
          />
        </div>
      )}
    </div>
  );
}
