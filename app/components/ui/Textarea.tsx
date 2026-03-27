"use client";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export default function Textarea({ label, hint, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <textarea
        className={`w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none ${className}`}
        rows={3}
        {...props}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
