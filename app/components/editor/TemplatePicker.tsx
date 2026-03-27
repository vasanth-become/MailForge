"use client";

import { useState } from "react";
import { useMailStore } from "@/lib/store/useMailStore";
import { TEMPLATE_REGISTRY, getTemplatesByCategory, type TemplateCategory, type TemplateDefinition } from "@/lib/engine/registry";
import SectionHeader from "@/app/components/ui/SectionHeader";

/* ─── Category metadata ─────────────────────────────────────────────────── */

const CATEGORIES: { id: TemplateCategory; label: string; icon: string; desc: string }[] = [
  { id: "product-launch", label: "Product Launch", icon: "🚀", desc: "Announce, reveal, ship" },
  { id: "discount",       label: "Discount Promo", icon: "🏷️", desc: "Deals, codes, flash sales" },
  { id: "newsletter",     label: "Newsletter",     icon: "📰", desc: "Updates, digest, changelog" },
];

/* ─── Layout thumbnail visuals ──────────────────────────────────────────── */

const LAYOUT_THUMBNAILS: Record<string, React.ReactNode> = {
  "hero": (
    <div className="space-y-1">
      <div className="h-10 rounded bg-slate-300" />
      <div className="h-2 rounded bg-slate-200 w-4/5" />
      <div className="h-2 rounded bg-slate-200 w-3/5" />
      <div className="h-5 rounded bg-indigo-200 w-1/2 mx-auto mt-2" />
    </div>
  ),
  "minimal": (
    <div className="space-y-1.5">
      <div className="h-1 rounded" style={{ background: "linear-gradient(to right, #6366f1, #f59e0b)" }} />
      <div className="h-3 rounded bg-slate-800 w-4/5" />
      <div className="h-2 rounded bg-slate-300 w-full" />
      <div className="h-2 rounded bg-slate-200 w-full" />
      <div className="h-4 rounded bg-indigo-200 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "feature-list": (
    <div className="space-y-1">
      <div className="h-2.5 rounded bg-slate-700 w-2/3" />
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-indigo-200 flex-shrink-0" />
          <div className="h-2 rounded bg-slate-200 flex-1" />
        </div>
      ))}
      <div className="h-4 rounded bg-indigo-200 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "dark": (
    <div className="space-y-1 bg-slate-900 rounded p-1.5">
      <div className="h-6 rounded bg-slate-700" />
      <div className="h-2 rounded bg-slate-600 w-3/4" />
      <div className="h-2 rounded bg-slate-700 w-full" />
      <div className="h-4 rounded bg-indigo-500 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "promo-code": (
    <div className="space-y-1">
      <div className="h-8 rounded" style={{ background: "#f59e0b" }} />
      <div className="h-5 rounded border-2 border-dashed border-slate-400 flex items-center justify-center">
        <div className="h-1.5 w-16 rounded bg-slate-400" />
      </div>
      <div className="h-2 rounded bg-slate-200 w-4/5" />
      <div className="h-4 rounded bg-amber-300 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "flash-sale": (
    <div className="space-y-1">
      <div className="h-3 rounded bg-red-500" />
      <div className="h-7 rounded bg-indigo-400 flex items-center justify-center">
        <span className="text-white text-xs font-black">50% OFF</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="h-5 rounded bg-slate-800" />
        <div className="h-5 rounded bg-slate-800" />
        <div className="h-5 rounded bg-slate-800" />
      </div>
      <div className="h-4 rounded bg-indigo-300 w-1/2 mx-auto" />
    </div>
  ),
  "welcome": (
    <div className="space-y-1">
      <div className="h-2.5 rounded bg-slate-700 w-3/4" />
      <div className="h-2 rounded bg-slate-200 w-full" />
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-300 flex-shrink-0" />
          <div className="h-1.5 rounded bg-slate-200 flex-1" />
        </div>
      ))}
      <div className="h-4 rounded bg-indigo-200 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "seasonal": (
    <div className="space-y-1">
      <div className="h-8 rounded" style={{ background: "#f59e0b" }} />
      <div className="h-3 rounded bg-slate-800" />
      <div className="h-6 rounded bg-slate-200" />
      <div className="flex gap-1 mt-1">
        <div className="flex-1 h-6 rounded bg-amber-100" />
        <div className="w-10 h-6 rounded bg-slate-200" />
      </div>
      <div className="h-4 rounded bg-amber-400 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "editorial": (
    <div className="space-y-1">
      <div className="h-1 rounded" style={{ background: "linear-gradient(to right, #6366f1, #f59e0b)" }} />
      <div className="h-2.5 rounded bg-slate-700 w-2/3" />
      <div className="h-5 rounded bg-slate-200" />
      <div className="h-2 rounded bg-slate-200 w-4/5" />
      <div className="h-2 rounded bg-slate-200 w-3/4" />
      <div className="h-4 rounded bg-indigo-200 w-1/2 mx-auto mt-1" />
    </div>
  ),
  "digest": (
    <div className="space-y-1.5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="w-5 h-5 rounded bg-indigo-300 flex-shrink-0" />
          <div className="flex-1 space-y-0.5">
            <div className="h-1.5 rounded bg-slate-600 w-3/4" />
            <div className="h-1 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  ),
  "announcement": (
    <div className="space-y-1">
      <div className="h-2 rounded bg-slate-400 w-1/2" />
      <div className="h-3 rounded bg-slate-700 w-4/5" />
      <div className="h-2 rounded bg-slate-200 w-full" />
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-1">
          <div className="w-1 rounded bg-indigo-400" />
          <div className="h-3 rounded bg-slate-100 flex-1" />
        </div>
      ))}
    </div>
  ),
  "product-update": (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="h-2 rounded bg-slate-700 w-1/2" />
        <div className="h-3 rounded-full bg-indigo-100 w-12" />
      </div>
      {[
        { tag: "bg-indigo-400" }, { tag: "bg-amber-400" },
        { tag: "bg-green-400" }, { tag: "bg-purple-400" }
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className={`w-5 h-5 rounded border-2 ${item.tag.replace("bg-", "border-")} flex-shrink-0`} />
          <div className="flex-1">
            <div className={`h-2 w-8 rounded ${item.tag} mb-0.5`} />
            <div className="h-1.5 rounded bg-slate-200 w-full" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ─── Template card ─────────────────────────────────────────────────────── */

function TemplateCard({
  template,
  isActive,
  onSelect,
}: {
  template: TemplateDefinition;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-150 group ${
        isActive
          ? "border-indigo-500 shadow-md shadow-indigo-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`px-3 pt-3 pb-2 ${isActive ? "bg-indigo-50" : "bg-slate-50 group-hover:bg-slate-100"} transition-colors`}
      >
        <div className="rounded-lg bg-white border border-slate-200 p-2 shadow-sm" style={{ minHeight: "80px" }}>
          {LAYOUT_THUMBNAILS[template.layout] ?? (
            <div className="h-16 rounded bg-slate-200" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className={`px-3 pb-3 ${isActive ? "bg-indigo-50" : "bg-white"} transition-colors`}>
        <div className="flex items-start justify-between gap-1 mt-2">
          <p className={`text-xs font-bold leading-tight ${isActive ? "text-indigo-700" : "text-slate-800"}`}>
            {template.name}
          </p>
          {isActive && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-0.5" />}
        </div>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{template.description}</p>
        <p className={`text-xs mt-1.5 font-medium ${isActive ? "text-indigo-500" : "text-slate-400"}`}>
          {template.useCase}
        </p>
      </div>
    </button>
  );
}

/* ─── Main picker ───────────────────────────────────────────────────────── */

export default function TemplatePicker() {
  const { activeTemplateId, setActiveTemplate } = useMailStore();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("product-launch");

  const templates = getTemplatesByCategory(activeCategory);

  function handleSelect(template: TemplateDefinition) {
    setActiveTemplate(template.id, template.defaultContent);
    // Also jump to the template's category if coming from saved templates
  }

  // Sync active category to match current template
  const activeTpl = TEMPLATE_REGISTRY.find(t => t.id === activeTemplateId);

  return (
    <div className="space-y-4">
      <SectionHeader title="Template" subtitle="12 layouts across 3 categories" />

      {/* Category tabs */}
      <div className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => {
          const count = TEMPLATE_REGISTRY.filter(t => t.category === cat.id).length;
          const hasActive = activeTpl?.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                activeCategory === cat.id
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${activeCategory === cat.id ? "text-indigo-700" : "text-slate-700"}`}>
                  {cat.label}
                </p>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                  activeCategory === cat.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Template cards grid */}
      <div className="grid grid-cols-2 gap-2">
        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            isActive={activeTemplateId === tpl.id}
            onSelect={() => handleSelect(tpl)}
          />
        ))}
      </div>

      {/* Current selection indicator */}
      {activeTpl && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-xs text-slate-500">
            Active: <span className="font-semibold text-slate-700">{activeTpl.name}</span>
          </p>
        </div>
      )}
    </div>
  );
}
