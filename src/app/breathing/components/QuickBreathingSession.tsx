'use client';

import type { BreathingPattern } from '@/lib/types';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { PatternMotifVisual } from './PatternMotifVisual';

export function QuickBreathingSession({
  pattern,
  onStart,
  className,
}: {
  pattern: BreathingPattern;
  onStart: (pattern: BreathingPattern) => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-zen-2xl border border-zen-border-soft bg-white/80',
        'shadow-[0_12px_40px_-28px_rgba(40,30,60,0.28)]',
        className,
      )}
    >
      <div className="grid items-center gap-4 p-5 sm:p-6 md:grid-cols-[auto_1fr_auto] md:gap-6">
        <PatternMotifVisual steps={pattern.steps} active className="h-24 w-24 md:h-28 md:w-28" />

        <div className="min-w-0 text-center md:text-left">
          <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-zen-secondary">
            Quick session for you
          </p>
          <h2 className="mt-1 font-display text-[1.375rem] leading-tight tracking-[-0.01em] text-zen-fg md:text-[1.5rem]">
            {pattern.name}
          </h2>
          <p className="mt-1 font-ui text-sm text-zen-fg-muted">
            {pattern.steps.join(' · ')}
            <span className="mx-2 text-zen-border">·</span>
            {pattern.defaultMinutes} min
          </p>
        </div>

        <ZenButton
          type="button"
          size="lg"
          className="mx-auto min-h-11 w-full max-w-[12rem] md:mx-0 md:w-auto"
          onClick={() => onStart(pattern)}
        >
          Start
          <span aria-hidden="true">→</span>
        </ZenButton>
      </div>
    </section>
  );
}
