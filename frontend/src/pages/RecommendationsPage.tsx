import { useState, useEffect } from 'react';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { PageHeader } from '../components/ui/Primitives';
import { LoadingState, ErrorState, EmptyState, DatasetView } from '../components/ui/States';
import type { MockDataset, Recommendation, InventoryItem } from '../types';
import { fetchRecommendations, fetchInventoryEnriched } from '../utils/api';

// API usage flags
const USE_API_RECOMMENDATIONS =
  import.meta.env.VITE_USE_API_RECOMMENDATIONS === 'true' && !import.meta.env.VITEST;

export function RecommendationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence-backed next steps"
        title="Recommendations"
        description="Explore sample replenishment alternatives, their timing, feasibility, and rationale."
      />
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
        <strong className="font-semibold">Phase 1 preview.</strong> These comparisons are read-only.
        Approval, rejection, and decision persistence will be added after the backend contract is
        agreed.
      </div>
      {/* API-based recommendations content */}
      {USE_API_RECOMMENDATIONS ? (
        <RecommendationsApiContent />
      ) : (
        // Fallback to mock data for testing and development
        <DatasetView>
          {(data) => (
            <div className="space-y-6">
              {data.recommendations.length ? (
                data.recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    item={data.inventory.find((item) => item.id === recommendation.inventoryId)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No recommendations yet"
                  description="Recommendations will appear here when sample options are available."
                />
              )}
            </div>
          )}
        </DatasetView>
      )}
    </>
  );
}

function RecommendationsApiContent() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch recommendations and inventory data in parallel
        const [recommendationsData, inventoryData] = await Promise.all([
          fetchRecommendations(),
          fetchInventoryEnriched()
        ]);

        if (!cancelled) {
          setRecommendations(recommendationsData);
          setInventory(inventoryData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      {recommendations.length ? (
        recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            item={inventory.find((item) => item.id === recommendation.inventoryId)}
          />
        ))
      ) : (
        <EmptyState
          title="No recommendations yet"
          description="Recommendations will appear here when sample options are available."
        />
      )}
    </div>
  );
}