import { ArrowLeftRight, Truck } from 'lucide-react';
import type { Recommendation } from '../../types';
import { Badge } from '../ui/Primitives';
import { money } from '../../utils/format';

export function OptionComparison({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recommendation.options.map((option) => {
        const preferred = recommendation.preferredOptionId === option.id;
        const Icon = option.type === 'transfer' ? ArrowLeftRight : Truck;
        return (
          <section
            key={option.id}
            aria-label={`${option.type} option from ${option.sourceLabel}`}
            className={`rounded-lg border p-5 ${preferred ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white'}`}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Icon size={18} className="text-slate-500" aria-hidden="true" />
                {option.type === 'transfer' ? 'Inter-store transfer' : 'Supplier purchase'}
              </h3>
              <Badge tone={preferred ? 'blue' : option.feasible ? 'green' : 'neutral'}>
                {preferred
                  ? 'Recommended in fixture'
                  : option.feasible
                    ? 'Feasible in fixture'
                    : 'Not feasible'}
              </Badge>
            </div>
            <p className="mb-4 text-xs text-slate-500">{option.sourceLabel}</p>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-slate-500">Quantity</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{option.quantity} units</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Estimated total cost</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {money(option.estimatedTotalCost, option.currency)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-slate-500">Estimated arrival</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {option.arrivalLabel ?? 'Unavailable'}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-slate-200/70 pt-3 text-xs leading-5 text-slate-500">
              Cost scope: {option.costScope}
            </p>
            {option.infeasibilityReason && (
              <p className="mt-3 rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                {option.infeasibilityReason}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
