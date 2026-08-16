'use client';

import type { BreathingPattern } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PatternMotifVisual } from './PatternMotifVisual';

export function BreathingTechniqueCard({
  pattern,
  onStart,
}: {
  pattern: BreathingPattern;
  onStart: (pattern: BreathingPattern) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onStart(pattern)}
      className={cn(
        'group flex h-full flex-col rounded-zen-2xl border border-zen-border-soft bg-white/85 p-5 text-left',
        'shadow-[0_8px_28px_-24px_rgba(40,30,60,0.35)]',
        'transition-[border-color,box-shadow] duration-200',
        'hover:border-zen-secondary/40 hover:shadow-[0_16px_40px_-28px_rgba(40,30,60,0.4)]',
        'active:scale-[0.985]',
        'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
      )}
    >
      <PatternMotifVisual
        steps={pattern.steps}
        className="mb-2 transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <h3 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-zen-fg md:text-[1.375rem]">
        {pattern.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 font-ui text-sm leading-relaxed text-zen-fg-muted">
        {pattern.description ?? 'A calm, guided rhythm to steady your breath.'}
      </p>

      <p className="mt-4 font-ui text-sm text-zen-secondary">{pattern.steps.join(' · ')}</p>

      <div className="mt-auto flex items-center justify-between pt-5 font-ui text-xs text-zen-fg-subtle">
        <span>~{pattern.defaultMinutes} min</span>
        <span className="rounded-zen-full border border-zen-border-soft bg-zen-bg-subtle px-2.5 py-1">
          {pattern.difficulty ?? 'All levels'}
        </span>
      </div>

      <span className="mt-4 inline-flex items-center gap-1 font-ui text-sm font-medium text-zen-primary opacity-80 transition-opacity group-hover:opacity-100">
        Start <span aria-hidden="true">→</span>
      </span>
    </button>
  );
}

export function BreathingTechniqueGrid({
  patterns,
  loading,
  onStart,
  className,
}: {
  patterns: BreathingPattern[];
  loading?: boolean;
  onStart: (pattern: BreathingPattern) => void;
  className?: string;
}) {
  return (
    <section className={cn('min-w-0', className)}>
      <h2 className="font-display text-[1.375rem] tracking-[-0.01em] text-zen-fg md:text-[1.625rem]">
        Choose a practice
      </h2>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-zen-2xl border border-zen-border-soft bg-white/70 p-5">
              <Skeleton className="mx-auto mb-4 h-28 w-28 rounded-full" />
              <Skeleton className="mb-2 h-6 w-2/3" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : patterns.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <BreathingTechniqueCard key={pattern.id} pattern={pattern} onStart={onStart} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-zen-2xl border border-dashed border-zen-border bg-white/50 px-6 py-12 text-center font-ui text-zen-fg-muted">
          No breathing practices are available yet. Check back soon.
        </div>
      )}
    </section>
  );
}
