import type { RiskStatus, Severity } from '../../types';
import { Badge, type BadgeTone } from './Primitives';

export const riskLabels: Record<RiskStatus, string> = {
  healthy: 'Healthy',
  low: 'Low stock',
  critical: 'Critical',
  excess: 'Excess',
  unknown: 'Unknown',
};
export const riskTones: Record<RiskStatus, BadgeTone> = {
  healthy: 'green',
  low: 'amber',
  critical: 'red',
  excess: 'blue',
  unknown: 'neutral',
};
export function RiskBadge({ status }: { status: RiskStatus }) {
  return <Badge tone={riskTones[status]}>{riskLabels[status]}</Badge>;
}
export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge tone={severity === 'high' ? 'red' : severity === 'medium' ? 'amber' : 'neutral'}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)} priority
    </Badge>
  );
}
