import { Link } from 'react-router';
import { Card, PageHeader } from '../components/ui/Primitives';
import { EmptyState } from '../components/ui/States';

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="This page isn’t part of the StockPilot workspace."
      />
      <Card>
        <EmptyState
          title="Let’s get you back to your inventory"
          description="Use the sidebar or return to the dashboard."
          action={
            <Link className="btn btn-primary" to="/">
              Back to Dashboard
            </Link>
          }
        />
      </Card>
    </>
  );
}
