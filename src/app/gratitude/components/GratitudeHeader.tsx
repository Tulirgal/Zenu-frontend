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
    <header className={cn('relative text-center', className)}>
      <div className="min-w-0">
        <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-amber-300 md:text-[0.75rem]">
          Hello {greetingName}
        </p>
        <h1
          className={cn(
            'mt-2 font-display font-medium text-white',
            'text-[1.75rem] leading-[1.15] tracking-[-0.02em]',
            'sm:text-[2.25rem] md:text-[2.75rem]',
          )}
        >
          Moments worth keeping.
        </h1>
        <p className="mx-auto mt-2 max-w-md font-ui text-[0.9375rem] leading-relaxed text-amber-100/80 md:text-[1.0625rem]">
          Save a note. Ask Panda to choose one when you need it.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
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
            className="min-h-12 text-white hover:bg-white/10"
            onClick={onPick}
            loading={picking}
            disabled={!canPick || picking}
          >
            {picking ? 'Panda is choosing…' : 'Ask Panda to pick'}
          </ZenButton>
        </div>
      </div>
    </header>
  );
}
