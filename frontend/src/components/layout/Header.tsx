import { FlaskConical, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { useMockDataset } from '../../hooks/useMockDataset';
import type { DemoState } from '../../types';
import { navigation } from './Sidebar';
import { Badge } from '../ui/Primitives';

export function Header({ mobileOpen, onToggle }: { mobileOpen: boolean; onToggle: () => void }) {
  const { pathname } = useLocation();
  const { mode, setMode } = useMockDataset();
  const title = navigation.find((item) => item.to === pathname)?.label ?? 'Page not found';
  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="navigation-toggle"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="primary-sidebar"
          onClick={onToggle}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <p className="text-sm text-slate-400">
          Workspace <span className="mx-3 text-slate-300">/</span>
          <span className="font-medium text-slate-700">{title}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge tone="amber">
          <FlaskConical size={13} aria-hidden="true" />
          Mock data
        </Badge>
        <div className="flex items-center gap-2">
          <label htmlFor="preview-state" className="text-xs text-slate-500">
            Preview state
          </label>
          <select
            id="preview-state"
            className="input py-1.5 text-xs"
            value={mode}
            onChange={(event) => setMode(event.target.value as DemoState)}
          >
            <option value="ready">Ready</option>
            <option value="loading">Loading</option>
            <option value="empty">Empty</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>
    </header>
  );
}
