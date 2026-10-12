import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react';
import { Button, Card } from './Primitives';
import { useMockDataset } from '../../hooks/useMockDataset';
import type { MockDataset } from '../../types';
import type { ReactNode } from 'react';

export function LoadingState() {
  return (
    <Card className="p-12 text-center">
      <div role="status">
        <LoaderCircle
          className="mx-auto mb-4 animate-spin text-blue-600"
          size={28}
          aria-hidden="true"
        />
        <h2 className="font-semibold text-slate-800">Loading your workspace</h2>
        <p className="mt-2 text-sm text-slate-500">Preparing the sample inventory data…</p>
      </div>
      <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-4" aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    </Card>
  );
}
export function EmptyState({
  title = 'No sample data to display',
  description = 'Choose Ready in Preview state to restore the sample workspace.',
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="p-12 text-center" role="status">
      <Inbox className="mx-auto mb-4 text-slate-400" size={32} aria-hidden="true" />
      <h2 className="font-semibold text-slate-800">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="p-12 text-center">
      <div role="alert">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={32} aria-hidden="true" />
        <h2 className="font-semibold text-slate-800">We couldn’t load the sample data</h2>
        <p className="mt-2 text-sm text-slate-500">Try again to restore the demo workspace.</p>
      </div>
      <Button className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}
export function DatasetView({ children }: { children: (data: MockDataset) => ReactNode }) {
  const { result, retry } = useMockDataset();
  if (result.status === 'loading') return <LoadingState />;
  if (result.status === 'error') return <ErrorState onRetry={retry} />;
  if (result.data.inventory.length === 0)
    return (
      <Card>
        <EmptyState action={<Button onClick={retry}>Restore sample data</Button>} />
      </Card>
    );
  return children(result.data);
}
