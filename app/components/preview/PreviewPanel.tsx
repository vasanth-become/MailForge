"use client";

import { useMemo, useState, useEffect } from "react";
import { useMailStore, type PreviewMode } from "@/lib/store/useMailStore";
import { renderEmail } from "@/lib/engine/renderEmail";

const PREVIEW_WIDTHS: Record<PreviewMode, string> = {
  desktop: "100%",
  mobile: "375px",
  gmail: "600px",
};

const MODE_LABELS: { id: PreviewMode; label: string; icon: string }[] = [
  { id: "desktop", label: "Desktop", icon: "🖥" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "gmail", label: "Gmail", icon: "📧" },
];

export default function PreviewPanel() {
  const { brand, activeTemplateId, content, previewMode, setPreviewMode, isDarkPreview, toggleDarkPreview } =
    useMailStore();

  const html = useMemo(
    () => renderEmail(activeTemplateId, brand, content),
    [activeTemplateId, brand, content]
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
        {/* Mode switcher */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {MODE_LABELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setPreviewMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
                previewMode === m.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkPreview}
            title="Toggle dark preview background"
            className={`w-7 h-7 rounded-md border text-xs transition ${
              isDarkPreview
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {isDarkPreview ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className={`flex-1 overflow-auto p-6 flex justify-center transition-colors duration-200 ${
          isDarkPreview ? "bg-slate-900" : "bg-slate-100"
        }`}
        style={{ minHeight: 0 }}
      >
        {/* Gmail chrome */}
        {previewMode === "gmail" && (
          <div className="w-full max-w-3xl">
            <div className="rounded-t-lg bg-white border border-b-0 border-slate-300 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 h-5 rounded bg-slate-100" />
              </div>
              <div className="border-b border-slate-100 pb-2 mb-2">
                <div className="h-3.5 w-48 rounded bg-slate-200 mb-1" />
                <div className="h-3 w-36 rounded bg-slate-100" />
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="h-3 w-32 rounded bg-slate-200 mb-1" />
                  <div className="h-2.5 w-24 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            width: PREVIEW_WIDTHS[previewMode],
            maxWidth: previewMode === "mobile" ? "375px" : previewMode === "gmail" ? "600px" : "900px",
            transition: "width 0.3s ease",
          }}
          className={previewMode === "gmail" ? "mt-0" : ""}
        >
          {previewMode === "mobile" && (
            <div className="mx-auto w-[375px] rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden bg-white">
              {/* Phone notch */}
              <div className="h-8 bg-slate-700 flex items-center justify-center">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
              <div className="h-[620px] overflow-auto">
                {isMounted && (
                  <iframe
                    srcDoc={html}
                    sandbox="allow-same-origin"
                    style={{ width: "375px", height: "100%", border: "none", display: "block" }}
                    title="Mobile Preview"
                  />
                )}
              </div>
              <div className="h-6 bg-slate-700" />
            </div>
          )}

          {previewMode === "gmail" && (
            <div className="border border-t-0 border-slate-300 bg-white rounded-b-lg overflow-hidden">
              {isMounted && (
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  style={{ width: "100%", minHeight: "700px", border: "none", display: "block" }}
                  title="Gmail Preview"
                />
              )}
            </div>
          )}

          {previewMode === "desktop" && (
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
              {isMounted && (
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  style={{ width: "100%", minHeight: "700px", border: "none", display: "block" }}
                  title="Desktop Preview"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
