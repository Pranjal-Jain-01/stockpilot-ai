import { useState, useEffect } from 'react';
import { Badge, Card, PageHeader } from '../components/ui/Primitives';
import { LoadingState, ErrorState, EmptyState, DatasetView } from '../components/ui/States';
import { dateTime } from '../utils/format';
import type { MockDataset, DecisionRecord, InventoryItem } from '../types';
import { fetchHistory, fetchInventoryEnriched } from '../utils/api';

// API usage flags
const USE_API_HISTORY =
  import.meta.env.VITE_USE_API_HISTORY === 'true' && !import.meta.env.VITEST;

export function HistoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Decision audit trail"
        title="Decision History"
        description="Review seeded examples of human decisions and the reasoning behind them."
      />
      <div className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
        Sample history only. These records were prefilled for the demo; this frontend does not save
        new decisions.
      </div>
      {/* API-based history content */}
      {USE_API_HISTORY ? (
        <HistoryApiContent />
      ) : (
        // Fallback to mock data for testing and development
        <DatasetView>
          {(data) => (
            <Card>
              <div className="flex items-center justify-between px-5 py-5">
                <h2 className="font-semibold text-slate-900">Recent decisions</h2>
                <Badge>{data.history.length} sample records</Badge>
              </div>
              {data.history.length ? (
                <div className="table-wrap">
                  <table className="data-table min-w-[850px]">
                    <caption className="sr-only">
                      Seeded simulated decision history. All timestamps are in IST.
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Simulated action</th>
                        <th scope="col">Decision</th>
                        <th scope="col">Decided at (IST)</th>
                        <th scope="col">Reviewed by / rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.history.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <p className="font-medium text-slate-800">{record.productName}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {record.sku} · {record.storeName}
                            </p>
                          </td>
                          <td>
                            <p>{record.actionLabel}</p>
                            <p className="mt-1 text-xs text-slate-500">{record.id}</p>
                          </td>
                          <td>
                            <Badge tone={record.decision === 'approved' ? 'green' : 'neutral'}>
                              {record.decision === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap">{dateTime(record.decidedAt)}</td>
                          <td className="max-w-80">
                            <p className="font-medium text-slate-700">{record.actorLabel}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {record.rationale}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No decisions recorded"
                  description="The sample audit trail is empty."
                />
              )}
            </Card>
          )}
        </DatasetView>
      )}
    </>
  );
}

function HistoryApiContent() {
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch history and inventory data in parallel
        const [historyData, inventoryData] = await Promise.all([
          fetchHistory(),
          fetchInventoryEnriched()
        ]);

        if (!cancelled) {
          setHistory(historyData);
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
    <Card>
      <div className="flex items-center justify-between px-5 py-5">
        <h2 className="font-semibold text-slate-900">Recent decisions</h2>
        <Badge>{history.length} sample records</Badge>
      </div>
      {history.length ? (
        <div className="table-wrap">
          <table className="data-table min-w-[850px]">
            <caption className="sr-only">
              Seeded simulated decision history. All timestamps are in IST.
            </caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Simulated action</th>
                <th scope="col">Decision</th>
                <th scope="col">Decided at (IST)</th>
                <th scope="col">Reviewed by / rationale</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>
                    <p className="font-medium text-slate-800">{record.productName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {record.sku} · {record.storeName}
                    </p>
                  </td>
                  <td>
                    <p>{record.actionLabel}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.id}</p>
                  </td>
                  <td>
                    <Badge tone={record.decision === 'approved' ? 'green' : 'neutral'}>
                      {record.decision === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap">{dateTime(record.decidedAt)}</td>
                  <td className="max-w-80">
                    <p className="font-medium text-slate-700">{record.actorLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {record.rationale}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No decisions recorded"
          description="The sample audit trail is empty."
        />
      )}
    </Card>
  );
}