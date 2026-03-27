"use client";

import { useMailStore } from "@/lib/store/useMailStore";
import ColorPicker from "@/app/components/ui/ColorPicker";
import Input from "@/app/components/ui/Input";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function BrandPanel() {
  const { brand, setBrand } = useMailStore();

  return (
    <div className="space-y-4">
      <SectionHeader title="Brand" subtitle="Applied globally to all templates" />

      <Input
        label="Brand Name"
        value={brand.name}
        onChange={(e) => setBrand({ name: e.target.value })}
        placeholder="Acme Corp"
      />

      <Input
        label="Logo URL"
        value={brand.logoUrl}
        onChange={(e) => setBrand({ logoUrl: e.target.value })}
        placeholder="https://example.com/logo.png"
        hint="Leave blank to show brand name as text"
      />

      <div className="grid grid-cols-2 gap-3">
        <ColorPicker
          label="Primary Color"
          value={brand.primaryColor}
          onChange={(v) => setBrand({ primaryColor: v })}
        />
        <ColorPicker
          label="Accent Color"
          value={brand.secondaryColor}
          onChange={(v) => setBrand({ secondaryColor: v })}
        />
      </div>

      <Input
        label="Footer Text"
        value={brand.footerText}
        onChange={(e) => setBrand({ footerText: e.target.value })}
        placeholder="© 2025 Your Company"
      />
    </div>
  );
}
