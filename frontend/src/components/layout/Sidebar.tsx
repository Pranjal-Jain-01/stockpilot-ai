import {
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  History,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router';

export const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/risks', label: 'Risk Center', icon: ShieldAlert },
  { to: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { to: '/history', label: 'Decision History', icon: History },
];
export function Sidebar({
  mobileOpen,
  onNavigate,
}: {
  mobileOpen: boolean;
  onNavigate: () => void;
}) {
  return (
    <aside
      id="primary-sidebar"
      className={`${mobileOpen ? 'block' : 'hidden'} bg-[#14243b] text-slate-300 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-60 lg:flex-col`}
    >
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500 text-white">
          <Boxes size={22} aria-hidden="true" />
        </div>
        <div className="text-lg font-semibold tracking-tight text-white">
          StockPilot <span className="text-blue-300">AI</span>
        </div>
      </div>
      <div className="mx-4 mb-7 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-700 text-xs font-semibold text-white">
          NR
        </div>
        <div>
          <p className="text-sm font-medium text-white">Northstar Retail</p>
          <p className="mt-0.5 text-xs text-slate-400">Sample workspace</p>
        </div>
      </div>
      <p className="mb-3 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Workspace
      </p>
      <nav aria-label="Main navigation" className="space-y-1 px-3 pb-5">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${isActive ? 'bg-blue-600 font-medium text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
            <ChevronRight
              size={14}
              className="ml-auto opacity-0 group-aria-[current=page]:opacity-70"
              aria-hidden="true"
            />
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto hidden px-4 pb-5 lg:block">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <ChartNoAxesCombined className="mb-3 text-blue-300" size={20} aria-hidden="true" />
          <p className="text-sm font-medium text-white">Better stock decisions.</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            One clear view of your inventory, risks, and next steps.
          </p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-600 text-xs font-medium text-white">
            DM
          </div>
          <div>
            <p className="text-sm font-medium text-white">Demo manager</p>
            <p className="text-xs text-slate-400">Inventory team</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
