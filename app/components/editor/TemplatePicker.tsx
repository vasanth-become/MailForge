"use client";

import { useMailStore, type TemplateId } from "@/lib/store/useMailStore";

const TEMPLATES: { id: TemplateId; label: string; icon: string; desc: string }[] = [
  {
    id: "product-launch",
    label: "Product Launch",
    icon: "🚀",
    desc: "Hero image + features",
  },
  {
    id: "discount",
    label: "Discount Promo",
    icon: "🏷️",
    desc: "Promo code + urgency",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: "📰",
    desc: "Articles + editorial",
  },
];

export default function TemplatePicker() {
  const { activeTemplateId, setActiveTemplate } = useMailStore();

  return (
    <div className="space-y-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTemplate(t.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 ${
            activeTemplateId === t.id
              ? "border-indigo-500 bg-indigo-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span className="text-xl flex-shrink-0">{t.icon}</span>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold truncate ${
                activeTemplateId === t.id ? "text-indigo-700" : "text-slate-700"
              }`}
            >
              {t.label}
            </p>
            <p className="text-xs text-slate-400 truncate">{t.desc}</p>
          </div>
          {activeTemplateId === t.id && (
            <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>
      ))}
    </div>
  );
}
