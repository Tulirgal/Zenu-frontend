'use client';

import { cn } from '@/lib/utils';

export function ScribbleHeader({ className }: { className?: string }) {
  return (
    <header className={cn('shrink-0 px-0.5 pb-2.5 md:pb-3.5', className)}>
      <h1 className="font-display text-[1.5rem] md:text-[1.85rem] font-semibold tracking-tight text-zen-fg leading-[1.15]">
        Scribble Pad
      </h1>
      <p className="font-ui text-[0.8125rem] md:text-sm text-zen-fg-muted mt-1 leading-snug">
        Let the line wander.
      </p>
    </header>
  );
}
