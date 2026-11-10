/** Pure GPS trigger engine. No Expo dependencies; usable in automated tests. */
import { distanceMeters, Point } from './geo';

export type Fix = Point & { accuracyMeters: number | null; timestamp: number };
export type GPSStop = Point & { id: string; radiusMeters: number };
export type TriggerState = { candidateId: string | null; count: number; lastTimestamp: number };
export type TriggerOutcome = {
  state: TriggerState;
  triggered: boolean;
  reason: 'ok'|'inaccurate'|'stale'|'outside'|'first-fix'|'too-soon';
  distance: number;
};
export const emptyTriggerState = (): TriggerState => ({ candidateId: null, count: 0, lastTimestamp: 0 });

/** Require two DISTINCT, reasonably accurate fixes at least 700ms apart.
 * Reject old/out-of-order fixes, including simulator or phone cached positions.
 * Only the next unfinished stop is passed in, preventing adjacent-place collisions.
 */
export function evaluateTrigger(
  prior: TriggerState, fix: Fix, next: GPSStop,
  now: number = Date.now(),
): TriggerOutcome {
  const distance = distanceMeters(fix, next);
  const empty = emptyTriggerState();
  if (!Number.isFinite(fix.latitude) || !Number.isFinite(fix.longitude) ||
      !Number.isFinite(fix.timestamp) || fix.timestamp > now + 5000 ||
      now - fix.timestamp > 15000) {
    return { state: empty, triggered: false, reason: 'stale', distance };
  }
  if (fix.accuracyMeters === null || !Number.isFinite(fix.accuracyMeters) ||
      fix.accuracyMeters < 0 || fix.accuracyMeters > 30) {
    return { state: empty, triggered: false, reason: 'inaccurate', distance };
  }
  if (distance > next.radiusMeters) {
    return { state: empty, triggered: false, reason: 'outside', distance };
  }
  if (prior.candidateId !== next.id) {
    return { state: { candidateId: next.id, count: 1, lastTimestamp: fix.timestamp }, triggered: false, reason: 'first-fix', distance };
  }
  if (fix.timestamp - prior.lastTimestamp < 700) {
    return { state: prior, triggered: false, reason: 'too-soon', distance };
  }
  return { state: empty, triggered: true, reason: 'ok', distance };
}
