import { ArrowRight, Boxes, Building2, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Badge, Card, PageHeader, StatCard } from '../components/ui/Primitives';
import { DatasetView, LoadingState, ErrorState } from '../components/ui/States';
import { riskLabels, SeverityBadge } from '../components/ui/RiskBadge';
import type { MockDataset, RiskStatus, RiskType, InventoryItem, RiskAlert, Recommendation, DecisionRecord } from '../types';
import { fetchInventoryEnriched, fetchRisks, fetchRecommendations, fetchHistory } from '../utils/api';
import { useEffect, useState } from 'react';

const healthColors: Record<RiskStatus, string> = {
  healthy: 'bg-emerald-500',
  low: 'bg-amber-400',
  critical: 'bg-red-400',
  excess: 'bg-blue-500',
  unknown: 'bg-slate-300',
};
const riskTypes: RiskType[] = ['Stockout', 'Supplier delay', 'Excess stock', 'Slow movement'];

// API usage flags
const USE_API_DASHBOARD =
  import.meta.env.VITE_USE_API_DASHBOARD === 'true' && !import.meta.env.VITEST;

function DashboardContent({ data }: { data: MockDataset }) {
  const highPriority = data.risks.filter((risk) => risk.severity === 'high').length;
  const healthStatuses: RiskStatus[] = ['healthy', 'low', 'critical', 'excess', 'unknown'];
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 text-blue-600">
            <ShieldAlert size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {highPriority} high-priority risks need your attention
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Start with coverage gaps, then review replenishment options.
            </p>
          </div>
        </div>
        <Link to="/risks" className="text-link">
          Go to Risk Center <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Monitored SKUs"
          value={String(new Set(data.inventory.map((item) => item.sku)).size)}
          detail={`${data.inventory.length} stock records in the sample dataset`}
          icon={Boxes}
        />
        <StatCard
          title="Active locations"
          value={String(new Set(data.inventory.map((item) => item.storeId)).size)}
          detail="Mumbai · Pune · Bengaluru"
          icon={Building2}
        />
        <StatCard
          title="Open risk alerts"
          value={String(data.risks.length)}
          detail={`${highPriority} high priority · multiple alerts per SKU possible`}
          icon={ShieldAlert}
        />
        <StatCard
          title="Awaiting review"
          value={String(data.recommendations.length)}
          detail="Sample recommendations · all pending"
          icon={Sparkles}
          accent
        />
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Inventory health</h2>
              <p className="mt-1 text-xs text-slate-500">Stock records by supplied risk status</p>
            </div>
            <Badge>All locations</Badge>
          </div>
          <div
            className="my-7 flex h-3 overflow-hidden rounded-full bg-slate-100"
            aria-hidden="true"
          >
            {healthStatuses.map((status) => (
              <div
                key={status}
                className={healthColors[status]}
                style={{
                  width: `${(data.inventory.filter((item) => item.riskStatus === status).length / data.inventory.length) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {healthStatuses.map((status) => (
              <div key={status}>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`h-2 w-2 rounded-full ${healthColors[status]}`} />
                  {riskLabels[status]}
                </div>
                <p className="mt-2 text-xl font-semibold text-slate-800">
                  {data.inventory.filter((item) => item.riskStatus === status).length}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            Unknown means demand evidence is unavailable. Classifications are supplied by the
            fixtures.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900">Risk breakdown</h2>
          <p className="mt-1 text-xs text-slate-500">A clear view of what needs investigation</p>
          <div className="mt-6 space-y-5">
            {riskTypes.map((type) => {
              const count = data.risks.filter((risk) => risk.type === type).length;
              return (
                <div key={type}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-600">{type}</span>
                    <span className="font-semibold text-slate-800">
                      {count} {count === 1 ? 'alert' : 'alerts'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(count / Math.max(data.risks.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">Priority watchlist</h2>
            <p className="mt-1 text-xs text-slate-500">
              High and medium priority alerts from the sample dataset
            </p>
          </div>
          <Link className="text-link" to="/risks">
            View all alerts <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="table-wrap">
          <table className="data-table min-w-[680px]">
            <caption className="sr-only">Priority inventory risks</caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Location</th>
                <th scope="col">Risk type</th>
                <th scope="col">Priority</th>
                <th scope="col">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.risks
                .filter((risk) => risk.severity !== 'low')
                .map((risk) => {
                  const item = data.inventory.find((entry) => entry.id === risk.inventoryId);
                  return (
                    <tr key={risk.id}>
                      <td>
                        <p className="font-medium text-slate-800">
                          {item?.productName ?? 'Unavailable product'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item?.sku ?? 'Unavailable SKU'}
                        </p>
                      </td>
                      <td>{item?.storeName ?? 'Unavailable'}</td>
                      <td>{risk.type}</td>
                      <td>
                        <SeverityBadge severity={risk.severity} />
                      </td>
                      <td>
                        <Link
                          to={`/risks?risk=${risk.id}`}
                          className="text-link"
                          aria-label={`Investigate ${item?.productName ?? risk.title}`}
                        >
                          Investigate <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <Sparkles size={21} className="text-blue-600" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Your next steps, explained</h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore {data.recommendations.length} sample recommendations and their supporting
              evidence.
            </p>
          </div>
        </div>
        <Link to="/recommendations" className="btn btn-secondary">
          Review recommendations <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-4 text-xs text-slate-500">Fixture snapshot: {data.snapshotLabel}</p>
    </>
  );
}

export function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inventory intelligence"
        title="Inventory overview"
        description="See where your stock stands. Focus on the risks that matter."
        action={
          <Link to="/inventory" className="btn btn-primary">
            Explore inventory <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      />
      {/* API-based dashboard content */}
      {USE_API_DASHBOARD ? (
        <DashboardApiContent />
      ) : (
        // Fallback to mock data for testing and development
        <DatasetView>{(data) => <DashboardContent data={data} />}</DatasetView>
      )}
    </>
  );
}

function DashboardApiContent() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch snapshot label (using a fixed value since we don't have an API endpoint for this)
  const [snapshotLabel, ] = useState('12 Oct 2026 · 09:00 IST');

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [
          inventoryData,
          risksData,
          recommendationsData,
          historyData
        ] = await Promise.all([
          fetchInventoryEnriched(),
          fetchRisks(),
          fetchRecommendations(),
          fetchHistory()
        ]);

        if (!cancelled) {
          setInventory(inventoryData);
          setRisks(risksData);
          setRecommendations(recommendationsData);
          setHistory(historyData);
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

  // Combine data into MockDataset format for DashboardContent
  const mockData: MockDataset = {
    inventory,
    risks,
    recommendations,
    history,
    snapshotLabel
  };

  return <DashboardContent data={mockData} />;
}