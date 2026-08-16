'use client';

import { cn } from '@/lib/utils';
import { derivePatternMotif } from './patternVisual';

/** Small CSS motif for technique cards — driven by steps shape, not names. */
export function PatternMotifVisual({
  steps,
  active = false,
  className,
}: {
  steps: number[];
  active?: boolean;
  className?: string;
}) {
  const motif = derivePatternMotif(steps);

  return (
    <div
      className={cn('relative mx-auto flex h-28 w-28 items-center justify-center', className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-70',
        )}
        style={{
          background:
            motif === 'longExhale'
              ? 'radial-gradient(circle at 40% 40%, hsl(var(--zen-secondary) / 0.35), hsl(var(--zen-primary) / 0.08) 55%, transparent 70%)'
              : motif === 'balanced'
                ? 'radial-gradient(circle at 50% 50%, hsl(var(--zen-primary) / 0.28), hsl(var(--zen-secondary) / 0.1) 50%, transparent 72%)'
                : 'radial-gradient(circle at 45% 45%, hsl(200 60% 70% / 0.3), hsl(var(--zen-secondary) / 0.12) 55%, transparent 72%)',
        }}
      />
      {motif === 'balanced' ? (
        <div
          className={cn(
            'relative h-14 w-14 rounded-[1.1rem] border-2 border-zen-primary/35 bg-white/40',
            active && 'animate-[pulse_4s_ease-in-out_infinite]',
          )}
        />
      ) : motif === 'longExhale' ? (
        <div className="relative h-12 w-20">
          <div
            className={cn(
              'absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-zen-secondary/40',
              active && 'animate-[pulse_5s_ease-in-out_infinite]',
            )}
          />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zen-primary/30 bg-zen-primary/10" />
        </div>
      ) : (
        <div
          className={cn(
            'relative h-16 w-16 rounded-full border-2 border-zen-primary/30 bg-zen-primary/10',
            active && 'animate-[pulse_4.5s_ease-in-out_infinite]',
          )}
        />
      )}
    </div>
  );
}
