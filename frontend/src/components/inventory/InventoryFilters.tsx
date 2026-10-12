import { Search } from 'lucide-react';
import type { InventoryItem, RiskStatus } from '../../types';
import { riskLabels } from '../ui/RiskBadge';
import { Button } from '../ui/Primitives';

export interface InventoryFilterValues {
  search: string;
  store: string;
  status: string;
}
export const initialFilters: InventoryFilterValues = { search: '', store: '', status: '' };
export function InventoryFilters({
  items,
  filters,
  onChange,
}: {
  items: InventoryItem[];
  filters: InventoryFilterValues;
  onChange: (next: InventoryFilterValues) => void;
}) {
  const stores = [...new Map(items.map((item) => [item.storeId, item.storeName])).entries()];
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 p-5">
      <div className="min-w-[180px] flex-1">
        <label
          htmlFor="inventory-search"
          className="mb-1.5 block text-xs font-medium text-slate-600"
        >
          Search inventory
        </label>
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-3 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="inventory-search"
            type="search"
            placeholder="Search by product or SKU…"
            className="input w-full pl-10"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
          />
        </div>
      </div>
      <div>
        <label htmlFor="store-filter" className="mb-1.5 block text-xs font-medium text-slate-600">
          Location
        </label>
        <select
          id="store-filter"
          className="input"
          value={filters.store}
          onChange={(event) => onChange({ ...filters, store: event.target.value })}
        >
          <option value="">All locations</option>
          {stores.map(([id, name]) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status-filter" className="mb-1.5 block text-xs font-medium text-slate-600">
          Risk status
        </label>
        <select
          id="status-filter"
          className="input"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <option value="">All statuses</option>
          {(Object.keys(riskLabels) as RiskStatus[]).map((status) => (
            <option key={status} value={status}>
              {riskLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <Button
        onClick={() => onChange(initialFilters)}
        disabled={!filters.search && !filters.store && !filters.status}
      >
        Reset filters
      </Button>
    </div>
  );
}
