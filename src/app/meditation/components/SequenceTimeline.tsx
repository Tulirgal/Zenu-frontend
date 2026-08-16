'use client';

import { cn } from '@/lib/utils';
import { JPMR_STEPS } from './practiceContent';

export function SequenceTimeline({ className }: { className?: string }) {
  return (
    <section className={cn('min-w-0', className)}>
      <h2 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-zen-fg md:text-[1.5rem]">
        Guided sequence
      </h2>
      <p className="mt-1 font-ui text-[0.875rem] text-zen-fg-muted md:text-[0.9375rem]">
        Muscle groups in this practice
      </p>

      <ol className="mt-6 space-y-0">
        {JPMR_STEPS.map((step, i) => {
          const isLast = i === JPMR_STEPS.length - 1;
          const num = String(i + 1).padStart(2, '0');
          return (
            <li key={step.muscle} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[1.05rem] top-8 bottom-0 w-px bg-zen-border-soft"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zen-border-soft bg-white font-ui text-[0.75rem] font-medium text-zen-secondary">
                {num}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="font-ui text-[0.9375rem] font-medium text-zen-fg md:text-[1rem]">
                  <span className="text-zen-fg-subtle" aria-hidden="true">
                    ──{' '}
                  </span>
                  {step.muscle}
                </p>
                <p className="mt-1 font-ui text-[0.875rem] leading-relaxed text-zen-fg-muted md:text-[0.9375rem]">
                  {step.instruction}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
