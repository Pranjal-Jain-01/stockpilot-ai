import { Route, Routes } from 'react-router';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../pages/DashboardPage';
import { InventoryPage } from '../pages/InventoryPage';
import { RisksPage } from '../pages/RisksPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MockDatasetProvider } from '../hooks/useMockDataset';

export function AppRoutes() {
  return (
    <MockDatasetProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="risks" element={<RisksPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MockDatasetProvider>
  );
}
