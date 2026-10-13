import { useState } from 'react';
import { InventoryFilters, initialFilters } from '../components/inventory/InventoryFilters';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives';
import { DatasetView, EmptyState } from '../components/ui/States';
import type { MockDataset } from '../types';

function InventoryContent({ data }: { data: MockDataset }) {
  const [filters, setFilters] = useState(initialFilters);
  const search = filters.search.trim().toLowerCase();
  const items = data.inventory.filter(
    (item) =>
      (!search || `${item.sku} ${item.productName}`.toLowerCase().includes(search)) &&
      (!filters.store || item.storeId === filters.store) &&
      (!filters.status || item.riskStatus === filters.status),
  );
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 px-5 py-5">
        <h2 className="font-semibold text-slate-900">Stock directory</h2>
        <Badge>
          {items.length} of {data.inventory.length} records
        </Badge>
      </div>
      <InventoryFilters items={data.inventory} filters={filters} onChange={setFilters} />
      {items.length ? (
        <InventoryTable items={items} />
      ) : (
        <EmptyState
          title="No matching inventory"
          description="Try another product, location, or risk status."
          action={<Button onClick={() => setFilters(initialFilters)}>Clear filters</Button>}
        />
      )}
      <p className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
        Quantities are in units. Coverage and risk status are supplied fixture values.
      </p>
    </Card>
  );
}
export function InventoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stock directory"
        title="Inventory"
        description="Browse stock across your locations and find the products that need attention."
      />
      <DatasetView>{(data) => <InventoryContent data={data} />}</DatasetView>
    </>
  );
}
