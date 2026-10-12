import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Sidebar, navigation } from './Sidebar';

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const initialPath = useRef(pathname);
  useEffect(() => {
    if (!mobileOpen) return;
    document.querySelector<HTMLAnchorElement>('#primary-sidebar nav a')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        document.getElementById('navigation-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);
  useEffect(() => {
    document.title = `${navigation.find((item) => item.to === pathname)?.label ?? 'Page not found'} · StockPilot AI`;
    if (initialPath.current !== pathname) {
      mainRef.current?.focus();
      window.scrollTo({ top: 0 });
      initialPath.current = pathname;
    }
  }, [pathname]);
  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="lg:ml-60">
        <Header mobileOpen={mobileOpen} onToggle={() => setMobileOpen((open) => !open)} />
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="mx-auto max-w-[1560px] px-5 py-7 outline-none sm:px-8 lg:py-9"
        >
          <Outlet />
          <footer className="mt-8 flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <p>StockPilot AI · Phase 1 frontend</p>
            <p>Synthetic data. Procurement and transfers are simulated.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
