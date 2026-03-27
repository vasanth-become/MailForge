"use client";

import { useMemo, useState } from "react";
import { useMailStore } from "@/lib/store/useMailStore";
import { renderEmail } from "@/lib/engine/renderEmail";

export default function ExportPanel() {
  const { brand, activeTemplateId, content } = useMailStore();
  const [copied, setCopied] = useState(false);

  const html = useMemo(
    () => renderEmail(activeTemplateId, brand, content),
    [activeTemplateId, brand, content]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS or unsupported browsers
      const ta = document.createElement("textarea");
      ta.value = html;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = brand.name.toLowerCase().replace(/\s+/g, "-");
    a.href = url;
    a.download = `${slug}-${activeTemplateId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const lineCount = html.split("\n").length;
  const charCount = html.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Export</p>
        <span className="text-xs text-slate-400">{lineCount} lines · {(charCount / 1000).toFixed(1)}kb</span>
      </div>

      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 h-9 text-sm font-semibold rounded-lg border transition-all duration-150 ${
          copied
            ? "bg-green-50 border-green-400 text-green-700"
            : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        {copied ? (
          <>
            <span>✓</span> Copied!
          </>
        ) : (
          <>
            <span>📋</span> Copy HTML
          </>
        )}
      </button>

      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 h-9 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-150"
      >
        <span>⬇</span> Download .html
      </button>
    </div>
  );
}
