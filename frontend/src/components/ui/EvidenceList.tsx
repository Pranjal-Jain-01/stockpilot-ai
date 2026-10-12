import type { EvidenceItem } from '../../types';

export function EvidenceList({ items }: { items: EvidenceItem[] }) {
  const columns =
    items.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : items.length === 2 ? 'sm:grid-cols-2' : '';
  return (
    <dl className={`grid gap-x-6 gap-y-4 ${columns}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-slate-500">{item.label}</dt>
          <dd
            className={`mt-1 text-sm font-medium ${item.value === null ? 'text-slate-500' : 'text-slate-800'}`}
          >
            {item.value ?? 'Unavailable'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
