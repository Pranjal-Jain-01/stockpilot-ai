import { Component, type ReactNode } from 'react';
import { Button, Card } from './Primitives';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="mx-auto max-w-xl p-6 pt-20">
          <Card className="p-8">
            <div role="alert">
              <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The workspace couldn’t render. Reload to restart the sample frontend.
              </p>
            </div>
            <Button className="mt-5" onClick={() => window.location.reload()}>
              Reload workspace
            </Button>
          </Card>
        </main>
      );
    return this.props.children;
  }
}
