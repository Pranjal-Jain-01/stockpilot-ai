import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { loadDataset } from '../mocks/loadDataset';
import type { DemoState, MockDataset } from '../types';

type LoadResult =
  | { status: 'loading'; data: null }
  | { status: 'error'; data: null }
  | { status: 'ready'; data: MockDataset };
interface DatasetContext {
  result: LoadResult;
  mode: DemoState;
  setMode: (mode: DemoState) => void;
  retry: () => void;
}
const Context = createContext<DatasetContext | null>(null);

export function MockDatasetProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const requestedMode = params.get('state');
  const mode: DemoState =
    requestedMode === 'loading' || requestedMode === 'empty' || requestedMode === 'error'
      ? requestedMode
      : 'ready';
  const [result, setResult] = useState<LoadResult>({ status: 'loading', data: null });
  const [loadedMode, setLoadedMode] = useState<DemoState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    if (mode !== 'loading') {
      loadDataset(mode, controller.signal).then(
        (data) => {
          setResult({ status: 'ready', data });
          setLoadedMode(mode);
        },
        () => {
          if (!controller.signal.aborted) {
            setResult({ status: 'error', data: null });
            setLoadedMode(mode);
          }
        },
      );
    }
    return () => controller.abort();
  }, [mode, attempt]);

  const setMode = (next: DemoState) => {
    const nextParams = new URLSearchParams(params);
    if (next === 'ready') nextParams.delete('state');
    else nextParams.set('state', next);
    setParams(nextParams);
  };
  const retry = () => {
    setLoadedMode(null);
    setMode('ready');
    setAttempt((value) => value + 1);
  };
  const visibleResult: LoadResult =
    mode === 'loading' || loadedMode !== mode ? { status: 'loading', data: null } : result;
  return (
    <Context.Provider value={{ result: visibleResult, mode, setMode, retry }}>
      {children}
    </Context.Provider>
  );
}

export function useMockDataset() {
  const context = useContext(Context);
  if (!context) throw new Error('useMockDataset must be used inside MockDatasetProvider.');
  return context;
}
