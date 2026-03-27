"use client";

import { useState } from "react";
import BrandPanel from "@/app/components/brand/BrandPanel";
import TemplatePicker from "@/app/components/editor/TemplatePicker";
import ContentEditor from "@/app/components/editor/ContentEditor";
import SavedTemplates from "@/app/components/editor/SavedTemplates";
import ExportPanel from "@/app/components/export/ExportPanel";

type Tab = "template" | "content" | "brand" | "saved";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "template", label: "Template", icon: "🎨" },
  { id: "content", label: "Content", icon: "✏️" },
  { id: "brand", label: "Brand", icon: "🏷" },
  { id: "saved", label: "Saved", icon: "💾" },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("template");

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
      {/* Logo / Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm font-black">M</span>
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-800 leading-none tracking-tight">MailForge</h1>
          <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Email Template Builder</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 ${
              activeTab === t.id
                ? "text-indigo-600 border-b-2 border-indigo-500 bg-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-0">
        {activeTab === "template" && <TemplatePicker />}
        {activeTab === "content" && <ContentEditor />}
        {activeTab === "brand" && <BrandPanel />}
        {activeTab === "saved" && <SavedTemplates />}
      </div>

      {/* Export — always visible at bottom */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
        <ExportPanel />
      </div>
    </aside>
  );
}
