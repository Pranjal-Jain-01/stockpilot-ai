import { BrowserRouter } from 'react-router';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { AppRoutes } from './router';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
