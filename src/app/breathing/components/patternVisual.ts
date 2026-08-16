/**
 * Derive a card motif from DB `steps` timing — never from technique names.
 *
 * - equal phases (e.g. 4·4·4·4 or 5·5) → balanced
 * - longer final/exhale phase (e.g. 4·7·8) → longExhale
 * - two phases unequal → wave
 * - otherwise → generic (still rendered with proportional arcs)
 */
export type PatternMotif = 'balanced' | 'longExhale' | 'wave' | 'generic';

export function derivePatternMotif(steps: number[]): PatternMotif {
  if (!steps.length) return 'generic';
  if (steps.length >= 2 && steps.every((s) => s === steps[0])) return 'balanced';
  const inhale = steps[0] ?? 0;
  // Prefer true exhale index when 3+ phases; else last phase
  const exhaleIdx = steps.length >= 3 ? 2 : steps.length - 1;
  const exhale = steps[exhaleIdx] ?? 0;
  const hold = steps.length >= 2 ? steps[1] : 0;
  if (exhale > inhale * 1.15 || hold > inhale * 1.4) return 'longExhale';
  if (steps.length === 2) return 'wave';
  return 'generic';
}

export function phaseInstruction(phase: string): string {
  switch (phase) {
    case 'Inhale':
      return 'Slowly breathe in';
    case 'Exhale':
      return 'Let it go';
    case 'Hold':
      return 'Stay here';
    default:
      return 'Follow the rhythm';
  }
}

export function formatSessionTime(seconds: number) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function pickQuickPattern<T extends { defaultMinutes: number }>(
  patterns: T[],
  recommendedDurationMin?: number | null,
): T | null {
  if (!patterns.length) return null;
  if (recommendedDurationMin == null || !Number.isFinite(recommendedDurationMin)) {
    return patterns[0];
  }
  let best = patterns[0];
  let bestDist = Math.abs(best.defaultMinutes - recommendedDurationMin);
  for (let i = 1; i < patterns.length; i++) {
    const dist = Math.abs(patterns[i].defaultMinutes - recommendedDurationMin);
    if (dist < bestDist) {
      best = patterns[i];
      bestDist = dist;
    }
  }
  return best;
}
