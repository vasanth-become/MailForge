"use client";

import { useRef, useState, useCallback } from "react";

interface ImagePickerProps {
  label: string;
  value: string;          // base64 data URL or https:// URL
  onChange: (value: string) => void;
  hint?: string;
}

/**
 * Compress an image file via canvas before storing as base64.
 * Resizes to max 600px wide, exports as JPEG at 82% quality.
 * Keeps the localStorage footprint well under 200 KB per image.
 */
function compressToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX_W = 600;
      const ratio = Math.min(MAX_W / img.width, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Load failed")); };
    img.src = objectUrl;
  });
}

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function ImagePicker({ label, value, onChange, hint }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const isBase64  = value?.startsWith("data:");
  const hasImage  = Boolean(value);
  // Estimate raw byte size of base64 payload (4/3 ratio)
  const b64Bytes  = isBase64 ? Math.round((value.length * 3) / 4) : 0;
  const isLarge   = b64Bytes > 180_000; // warn above ~180 KB

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF, WebP).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const b64 = await compressToBase64(file);
      onChange(b64);
    } catch {
      setError("Could not load that image — try a different file.");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    onChange(e.target.value);
  }

  function handleClear() {
    onChange("");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      {/* ── Preview or drop-zone ── */}
      <div
        className={`relative rounded-xl border-2 transition-colors duration-150 ${
          dragging
            ? "border-indigo-400 bg-indigo-50"
            : hasImage
            ? "border-slate-200 bg-white"
            : "border-dashed border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {hasImage ? (
          <>
            {/* Preview image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: "120px" }}
            />
            {/* Meta bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 rounded-b-xl px-2.5 py-1">
              <span className="text-xs text-white/70">
                {isBase64 ? `Uploaded · ${formatBytes(b64Bytes)}` : "URL"}
              </span>
              <button
                onClick={handleClear}
                className="text-white/70 hover:text-white text-xs transition"
                title="Remove image"
              >
                ✕ Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-5 gap-1.5 select-none">
            {loading ? (
              <span className="text-xs text-slate-400 animate-pulse">Processing…</span>
            ) : (
              <>
                <span className="text-2xl">🖼</span>
                <p className="text-xs text-slate-500 font-medium">Drop image here</p>
                <p className="text-xs text-slate-400">PNG, JPG, WebP, GIF</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Upload button ── */}
      <button
        type="button"
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-9 text-xs font-semibold rounded-lg border border-slate-200 bg-white
                   text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50
                   disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center
                   justify-center gap-1.5"
      >
        <span>📁</span>
        {loading ? "Processing…" : "Upload from computer"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* ── URL fallback ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400 flex-shrink-0">or paste URL</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <input
        type="url"
        value={isBase64 ? "" : (value || "")}
        onChange={handleUrlChange}
        placeholder="https://example.com/image.jpg"
        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-3 h-8
                   text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2
                   focus:ring-indigo-400 focus:border-transparent transition"
      />

      {/* ── Hints & warnings ── */}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}

      {isLarge && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5">
          ⚠ Large image ({formatBytes(b64Bytes)}). Consider using a hosted URL for production emails.
        </p>
      )}

      {isBase64 && !isLarge && (
        <p className="text-xs text-slate-400">
          Stored locally · Use a hosted URL for production sends
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
