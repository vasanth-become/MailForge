"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useMailStore, type PreviewMode } from "@/lib/store/useMailStore";
import { renderEmail } from "@/lib/engine/renderEmail";

const MODES: { id: PreviewMode; label: string; title: string }[] = [
  { id: "desktop", label: "🖥 Desktop", title: "600px centered — standard email width" },
  { id: "mobile", label: "📱 Mobile", title: "375px phone frame" },
  { id: "gmail", label: "📧 Gmail", title: "Gmail client simulation" },
  { id: "code", label: "⌨ HTML", title: "Raw generated HTML source" },
];

export default function PreviewPanel() {
  const {
    brand,
    activeTemplateId,
    content,
    previewMode,
    setPreviewMode,
    isDarkPreview,
    toggleDarkPreview,
  } = useMailStore();

  // Gate the entire panel on the client side.
  // Server renders a neutral placeholder → no text/attribute mismatch possible.
  // This covers: Zustand localStorage state, new Date() locale differences,
  // and any window references inside renderEmail or child components.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const html = useMemo(
    () => renderEmail(activeTemplateId, brand, content),
    [activeTemplateId, brand, content]
  );

  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = html;
      ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, [html]);

  // Server render: empty placeholder — nothing to mismatch against
  if (!isMounted) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-10 border-b border-slate-200 bg-white flex-shrink-0" />
        <div className="flex-1 bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setPreviewMode(m.id)}
              title={m.title}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                previewMode === m.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {previewMode !== "code" && (
            <button
              onClick={toggleDarkPreview}
              title={isDarkPreview ? "Light canvas" : "Dark canvas"}
              className={`h-7 px-2.5 rounded-md border text-xs font-medium transition ${
                isDarkPreview
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {isDarkPreview ? "🌙 Dark" : "☀️ Light"}
            </button>
          )}

          {previewMode === "code" && (
            <button
              onClick={handleCopyCode}
              className={`h-7 px-3 rounded-md border text-xs font-semibold transition ${
                codeCopied
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {codeCopied ? "✓ Copied" : "Copy HTML"}
            </button>
          )}

          <span className="text-xs text-slate-400 tabular-nums">
            {(html.length / 1000).toFixed(1)} kb
          </span>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        className={`flex-1 overflow-auto transition-colors duration-200 ${
          previewMode === "code"
            ? "bg-slate-950"
            : isDarkPreview
            ? "bg-slate-900"
            : "bg-slate-100"
        }`}
        style={{ minHeight: 0 }}
      >
        {/* Code view */}
        {previewMode === "code" && (
          <div className="h-full p-4">
            <pre
              className="text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap break-all select-all"
              style={{ fontFamily: "'Menlo','Monaco','Courier New',monospace" }}
            >
              <code>{html}</code>
            </pre>
          </div>
        )}

        {/* Desktop — 600px email standard */}
        {previewMode === "desktop" && (
          <div className="flex justify-center py-8 px-4 min-h-full">
            <div className="w-full" style={{ maxWidth: "660px" }}>
              <div className="bg-slate-200 rounded-t-xl px-4 py-2.5 flex items-center gap-3 border border-b-0 border-slate-300">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md h-5 flex items-center px-2">
                  <span className="text-xs text-slate-400">email preview — 600px</span>
                </div>
              </div>
              <div className="rounded-b-xl overflow-hidden border border-slate-300 bg-white shadow-lg">
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  title="Desktop Preview"
                  style={{ width: "100%", minHeight: "680px", border: "none", display: "block" }}
                />
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">
                Email content width: 600px
              </p>
            </div>
          </div>
        )}

        {/* Mobile — 375px phone frame */}
        {previewMode === "mobile" && (
          <div className="flex justify-center items-start py-8 px-4 min-h-full">
            <div
              className="rounded-[2.5rem] border-[5px] border-slate-700 shadow-2xl overflow-hidden bg-white flex-shrink-0"
              style={{ width: "375px" }}
            >
              <div className="h-9 bg-slate-700 flex items-center justify-center flex-shrink-0">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
              <div style={{ height: "640px", overflowY: "auto" }}>
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  title="Mobile Preview"
                  style={{ width: "375px", height: "1000px", border: "none", display: "block" }}
                />
              </div>
              <div className="h-6 bg-slate-700 flex items-center justify-center flex-shrink-0">
                <div className="w-24 h-1 bg-slate-500 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Gmail simulation */}
        {previewMode === "gmail" && (
          <div className="flex justify-center py-8 px-4 min-h-full">
            <div className="w-full" style={{ maxWidth: "680px" }}>
              <div className="bg-white rounded-t-xl border border-b-0 border-slate-300 shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div className="flex-1 h-7 rounded-full bg-slate-100 flex items-center px-3">
                    <span className="text-xs text-slate-400">Search mail</span>
                  </div>
                </div>
                <div className="px-5 py-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {brand.name}
                        </span>
                        {/* Static — no new Date() to avoid any remaining SSR mismatch */}
                        <span className="text-xs text-slate-400 flex-shrink-0">Today</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        to me &lt;me@example.com&gt;
                      </p>
                      <p className="text-sm font-medium text-slate-700 mt-1 truncate">
                        {content.heading}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="border border-t-0 border-b-0 border-slate-300"
                style={{ backgroundColor: "#f6f6f6" }}
              >
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  title="Gmail Preview"
                  style={{ width: "100%", minHeight: "600px", border: "none", display: "block" }}
                />
              </div>

              <div className="bg-white rounded-b-xl border border-t-0 border-slate-300 px-5 py-3 flex items-center gap-3">
                <div className="h-8 w-20 rounded bg-slate-100" />
                <div className="h-8 w-20 rounded bg-slate-100" />
                <div className="ml-auto h-8 w-16 rounded bg-slate-100" />
              </div>

              <p className="text-center text-xs text-slate-400 mt-2">
                Simulated Gmail view — actual rendering varies by client version
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
