"use client";

import { useMailStore } from "@/lib/store/useMailStore";
import { getTemplate } from "@/lib/engine/registry";

export default function Header() {
  const { brand, activeTemplateId } = useMailStore();
  const tpl = getTemplate(activeTemplateId);

  return (
    <header className="h-12 flex items-center px-5 border-b border-slate-200 bg-white flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-800">{brand.name}</span>
        <span className="text-slate-300">/</span>
        <span>{tpl.name}</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Live preview
        </span>
      </div>
    </header>
  );
}
