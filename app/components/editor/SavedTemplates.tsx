"use client";

import { useState } from "react";
import { useMailStore } from "@/lib/store/useMailStore";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function SavedTemplates() {
  const { savedTemplates, saveTemplate, loadTemplate, deleteTemplate } = useMailStore();
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);

  function handleSave() {
    const name = saveName.trim() || `Template ${new Date().toLocaleDateString()}`;
    saveTemplate(name);
    setSaveName("");
    setShowSave(false);
  }

  return (
    <div className="space-y-3">
      <SectionHeader title="Saved" subtitle="Your stored templates" />

      {/* Save current */}
      {!showSave ? (
        <button
          onClick={() => setShowSave(true)}
          className="w-full flex items-center justify-center gap-1.5 h-8 text-xs font-semibold text-indigo-600 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition"
        >
          <span>+</span> Save current
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            autoFocus
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-md px-2 h-8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Template name…"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setShowSave(false);
            }}
          />
          <button
            onClick={handleSave}
            className="px-3 h-8 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Save
          </button>
          <button
            onClick={() => setShowSave(false)}
            className="px-2 h-8 text-xs text-slate-500 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* List */}
      {savedTemplates.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-3">No saved templates yet</p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {savedTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-100 bg-white hover:border-slate-200 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{tpl.name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(tpl.savedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => loadTemplate(tpl.id)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition"
              >
                Load
              </button>
              <button
                onClick={() => deleteTemplate(tpl.id)}
                className="text-xs text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
