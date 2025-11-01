import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: number | string;
  icon?: ReactNode;
  helperText?: string;
}

export function KpiCard({ label, value, icon, helperText }: Props) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      {helperText ? <span className="mt-1 text-xs text-slate-500">{helperText}</span> : null}
    </div>
  );
}
