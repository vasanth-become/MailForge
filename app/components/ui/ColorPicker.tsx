"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2 h-9">
        <div className="relative w-9 h-9 rounded-md overflow-hidden border border-slate-200 shadow-sm cursor-pointer flex-shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full rounded-md" style={{ backgroundColor: value }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-md px-3 h-9 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}
