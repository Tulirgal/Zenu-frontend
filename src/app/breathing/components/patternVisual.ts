/**
 * Derive a card motif from DB `steps` timing — never from technique names.
 */
export type PatternMotif = 'balanced' | 'longExhale' | 'wave' | 'generic';

export function derivePatternMotif(steps: number[]): PatternMotif {
  if (!steps.length) return 'generic';
  if (steps.length >= 2 && steps.every((s) => s === steps[0])) return 'balanced';
  const inhale = steps[0] ?? 0;
  const exhale = steps[Math.min(2, steps.length - 1)] ?? 0;
  if (exhale > inhale * 1.15) return 'longExhale';
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
