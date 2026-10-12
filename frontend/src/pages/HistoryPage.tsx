import { Badge, Card, PageHeader } from '../components/ui/Primitives';
import { DatasetView, EmptyState } from '../components/ui/States';
import { dateTime } from '../utils/format';

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
    </>
  );
}
