"use client";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export default function Input({ label, hint, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        className={`w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 h-9 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
