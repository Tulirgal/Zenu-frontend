'use client';

import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';

export function GratitudeHeader({
  greetingName,
  onAdd,
  onPick,
  picking,
  canPick,
  className,
}: {
  greetingName: string;
  onAdd: () => void;
  onPick: () => void;
  picking?: boolean;
  canPick?: boolean;
  className?: string;
}) {
  return (
    <header className={cn('relative', className)}>
      <div className="min-w-0 text-center md:text-left">
        <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[hsl(28_55%_42%)] md:text-[0.75rem]">
          Hello {greetingName}
        </p>
        <h1
          className={cn(
            'mt-2 font-display font-medium text-zen-fg',
            'text-[1.875rem] leading-[1.15] tracking-[-0.02em]',
            'sm:text-[2.5rem] md:text-[3rem]',
          )}
        >
          Moments worth keeping.
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:mx-0 md:text-[1.0625rem]">
          Save a grateful note. When you need one, pick a memory from the jar.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <ZenButton
            type="button"
            variant="accent"
            size="lg"
            className="min-h-12"
            onClick={onAdd}
          >
            Add a gratitude moment
          </ZenButton>
          <ZenButton
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12"
            onClick={onPick}
            loading={picking}
            disabled={!canPick || picking}
          >
            Pick a memory
          </ZenButton>
        </div>
      </div>
    </header>
  );
}
