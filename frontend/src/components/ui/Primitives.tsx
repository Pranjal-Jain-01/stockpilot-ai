import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'destructive' }) {
  return (
    <button
      className={`btn ${variant === 'primary' ? 'btn-primary' : variant === 'destructive' ? 'btn-destructive' : 'btn-secondary'} ${className}`}
      {...props}
    />
  );
}

export type BadgeTone = 'blue' | 'green' | 'red' | 'amber' | 'neutral';
const tones: Record<BadgeTone, string> = {
  blue: 'bg-blue-50 text-blue-800 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  red: 'bg-red-50 text-red-800 ring-red-100',
  amber: 'bg-amber-50 text-amber-900 ring-amber-100',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
};
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action && <div className="pt-5">{action}</div>}
    </div>
  );
}
export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span
          className={`rounded-lg p-2 ${accent ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
