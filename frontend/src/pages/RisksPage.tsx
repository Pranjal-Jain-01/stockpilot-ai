import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ChevronDown, ShieldAlert } from 'lucide-react';
import { Card, PageHeader, Button } from '../components/ui/Primitives';
import { DatasetView, EmptyState } from '../components/ui/States';
import { SeverityBadge } from '../components/ui/RiskBadge';
import { RiskEvidencePanel } from '../components/risks/RiskEvidencePanel';
import type { MockDataset, RiskType } from '../types';

function RisksContent({ data }: { data: MockDataset }) {
  const [params] = useSearchParams();
  const [openId, setOpenId] = useState<string | null>(
    params.get('risk') ?? data.risks[0]?.id ?? null,
  );
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const types: RiskType[] = ['Stockout', 'Supplier delay', 'Excess stock', 'Slow movement'];
  const risks = data.risks.filter(
    (risk) => (!type || risk.type === type) && (!severity || risk.severity === severity),
  );
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="risk-type" className="mb-1.5 block text-xs font-medium">
            Risk type
          </label>
          <select
            id="risk-type"
            className="input"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">All risk types</option>
            {types.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="risk-severity" className="mb-1.5 block text-xs font-medium">
            Priority
          </label>
          <select
            id="risk-severity"
            className="input"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <p className="ml-auto py-3 text-xs text-slate-500">
          {risks.length} of {data.risks.length} alerts
        </p>
      </div>
      <div className="space-y-4">
        {risks.map((risk) => {
          const item = data.inventory.find((entry) => entry.id === risk.inventoryId);
          const open = openId === risk.id;
          return (
            <Card key={risk.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : risk.id)}
                aria-expanded={open}
                aria-controls={`evidence-${risk.id}`}
                className="flex w-full flex-wrap items-center gap-4 p-5 text-left"
              >
                <span
                  className={`rounded-lg p-2.5 ${risk.severity === 'high' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}
                >
                  <ShieldAlert size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    {risk.type} · {item?.storeName ?? 'Unavailable location'}
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-800">
                    {item?.productName ?? 'Unavailable product'}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{risk.title}</p>
                </div>
                <SeverityBadge severity={risk.severity} />
                <ChevronDown
                  size={18}
                  className={`text-slate-400 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {open && (
                <div id={`evidence-${risk.id}`}>
                  <p className="px-5 pb-4 text-sm text-slate-600">{risk.description}</p>
                  <RiskEvidencePanel risk={risk} />
                </div>
              )}
            </Card>
          );
        })}
        {risks.length === 0 && (
          <Card>
            <EmptyState
              title="No matching risks"
              description="Try a different risk type or priority."
              action={
                <Button
                  onClick={() => {
                    setType('');
                    setSeverity('');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Card>
        )}
      </div>
    </>
  );
}
export function RisksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Investigate and prioritize"
        title="Risk Center"
        description="Understand each alert with product-level evidence before choosing a next step."
      />
      <DatasetView>{(data) => <RisksContent data={data} />}</DatasetView>
    </>
  );
}
