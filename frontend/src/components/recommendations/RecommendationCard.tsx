import { Lightbulb } from 'lucide-react';
import type { InventoryItem, Recommendation } from '../../types';
import { Badge, Card } from '../ui/Primitives';
import { EvidenceList } from '../ui/EvidenceList';
import { OptionComparison } from './OptionComparison';

export function RecommendationCard({
  recommendation,
  item,
}: {
  recommendation: Recommendation;
  item?: InventoryItem;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            {recommendation.id} · {item?.storeName ?? 'Unavailable location'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {item?.productName ?? 'Unavailable product'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {item?.sku ?? 'Unavailable SKU'} · Sample replenishment comparison
          </p>
        </div>
        <Badge tone="amber">Pending review</Badge>
      </div>
      {recommendation.preferredOptionId === null && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          No feasible option in this fixture
        </p>
      )}
      <OptionComparison recommendation={recommendation} />
      <div className="my-5 flex items-start gap-3 rounded-lg bg-slate-50 p-4">
        <Lightbulb className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Why this recommendation?</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.explanation}</p>
        </div>
      </div>
      <EvidenceList items={recommendation.evidence} />
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        Costs cover different components; they are not equivalent landed-cost estimates. This
        preview does not submit a decision.
      </p>
    </Card>
  );
}
