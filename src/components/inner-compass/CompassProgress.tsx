'use client';

import { cn } from '@/lib/utils';
import type { PrimaryEmotion } from './emotionData';
import { primaryCssVar } from './emotionTokens';

export function CompassProgress({
  step,
  accent,
  className,
}: {
  step: 1 | 2 | 3;
  /** After primary selection, fill uses the journey emotion accent. */
  accent?: PrimaryEmotion | null;
  className?: string;
}) {
  const pct = (step / 3) * 100;

  return (
    <div className={cn('w-full max-w-md', className)}>
      <p className="font-ui text-[0.75rem] md:text-[0.8125rem] font-medium tracking-[0.08em] uppercase text-zen-fg-subtle mb-2.5">
        Step {step} of 3
      </p>
      <div
        className="h-1 w-full rounded-full bg-zen-border-soft/50 overflow-hidden"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Step ${step} of 3`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width,background-color] duration-300 ease-out',
            !accent && 'bg-zen-secondary/65',
          )}
          style={{
            width: `${pct}%`,
            ...(accent ? { backgroundColor: primaryCssVar(accent) } : null),
          }}
        />
      </div>
    </div>
  );
}
