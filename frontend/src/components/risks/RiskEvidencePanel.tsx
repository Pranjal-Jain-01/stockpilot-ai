import { EvidenceList } from '../ui/EvidenceList';
import type { RiskAlert } from '../../types';

export function RiskEvidencePanel({ risk }: { risk: RiskAlert }) {
  return (
    <div className="border-t border-slate-100 bg-slate-50/70 p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Supporting evidence
      </h3>
      <EvidenceList items={risk.evidence} />
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Synthetic evidence at the fixture snapshot. Missing values are marked unavailable.
      </p>
    </div>
  );
}
