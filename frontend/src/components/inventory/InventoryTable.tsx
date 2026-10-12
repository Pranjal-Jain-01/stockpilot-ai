import type { InventoryItem } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { EvidenceList } from '../ui/EvidenceList';
import { number } from '../../utils/format';

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table min-w-[820px]">
        <caption className="sr-only">Inventory quantities and supplied stock coverage</caption>
        <thead>
          <tr>
            <th scope="col">Product / SKU</th>
            <th scope="col">Location</th>
            <th scope="col" className="text-right">
              On hand
            </th>
            <th scope="col" className="text-right">
              Reserved
            </th>
            <th scope="col">Coverage</th>
            <th scope="col">Status</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <p className="font-medium text-slate-800">{item.productName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.sku} · {item.category}
                </p>
              </td>
              <td>{item.storeName}</td>
              <td className="text-right tabular-nums">
                {number(item.onHandQuantity)} <span className="text-xs text-slate-500">units</span>
              </td>
              <td className="text-right tabular-nums">
                {number(item.reservedQuantity)}{' '}
                <span className="text-xs text-slate-500">units</span>
              </td>
              <td>
                {item.coverageDays === null ? (
                  <span className="text-slate-500">Unavailable</span>
                ) : (
                  `${item.coverageDays} days`
                )}
              </td>
              <td>
                <RiskBadge status={item.riskStatus} />
              </td>
              <td>
                <details className="max-w-60">
                  <summary
                    className="text-sm font-medium text-blue-700"
                    aria-label={`Details for ${item.productName}`}
                  >
                    View
                  </summary>
                  <div className="mt-3 min-w-44 rounded-lg bg-slate-50 p-3">
                    <EvidenceList
                      items={[
                        {
                          label: 'Daily demand',
                          value:
                            item.averageDailyDemand === null
                              ? null
                              : `${item.averageDailyDemand} units / day`,
                        },
                      ]}
                    />
                    {item.averageDailyDemand === null && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Demand history is missing in this fixture; coverage is unavailable.
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">Synthetic record · {item.id}</p>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
