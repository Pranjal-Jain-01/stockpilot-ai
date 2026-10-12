import type { DemoState, MockDataset } from '../types';
import { mockDataset } from './data';

// A local asynchronous fixture loader, deliberately independent of any API URL.
export function loadDataset(mode: DemoState, signal: AbortSignal): Promise<MockDataset> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      if (mode === 'error') reject(new Error('The sample dataset could not be loaded.'));
      else
        resolve(
          mode === 'empty'
            ? { ...mockDataset, inventory: [], risks: [], recommendations: [], history: [] }
            : mockDataset,
        );
    }, 250);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}
