import { Lightbulb } from 'lucide-react';
import type { InventoryItem, Recommendation } from '../../types';
import { Badge, Card, Button } from '../ui/Primitives';
import { EvidenceList } from '../ui/EvidenceList';
import { OptionComparison } from './OptionComparison';
import { approveRecommendation, rejectRecommendation } from '../../utils/api';
import { useState } from 'react';

export function RecommendationCard({
  recommendation,
  item,
}: {
  recommendation: Recommendation;
  item?: InventoryItem;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  // Determine if we should use API (not in test mode)
  const USE_API_RECOMMENDATIONS =
    import.meta.env.VITE_USE_API_RECOMMENDATIONS === 'true' && !import.meta.env.VITEST;

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this recommendation? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await approveRecommendation(
        recommendation.id,
        'StockPilot AI Demo User',
        'Approved via StockPilot AI interface'
      );
      setDecision('approved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this recommendation? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await rejectRecommendation(
        recommendation.id,
        'StockPilot AI Demo User',
        'Rejected via StockPilot AI interface'
      );
      setDecision('rejected');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        {!USE_API_RECOMMENDATIONS ? (
          <Badge tone="amber">Pending review</Badge>
        ) : decision === 'approved' ? (
          <Badge tone="green">Approved</Badge>
        ) : decision === 'rejected' ? (
          <Badge tone="red">Rejected</Badge>
        ) : (
          <Badge tone="amber">Pending review</Badge>
        )}
      </div>

      {USE_API_RECOMMENDATIONS && !decision && (
        <div className="mb-4 flex gap-3">
          <Button
            variant="secondary"
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      )}

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
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
          Error: {error}
        </p>
      )}
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        Costs cover different components; they are not equivalent landed-cost estimates.
        {!USE_API_RECOMMENDATIONS ?
          'This preview does not submit a decision.' :
          decision ?
            `This recommendation has been ${decision === 'approved' ? 'approved' : 'rejected'}.` :
            'Submit a decision to proceed.'}
      </p>
    </Card>
  );
}
