import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { PageHeader } from '../components/ui/Primitives';
import { DatasetView, EmptyState } from '../components/ui/States';

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
    </>
  );
}
