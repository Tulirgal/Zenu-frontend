'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRACTICE_TIPS } from './practiceContent';

export function TipsDisclosure({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={cn(
        'rounded-zen-xl border border-zen-border-soft bg-white/70 px-4 py-3 md:px-5 md:py-4',
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          'flex w-full min-h-11 items-center justify-between gap-3 text-left',
          'active:scale-[0.99] transition-transform duration-100',
          'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2 rounded-zen-md',
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-zen-fg md:text-[1.5rem]">
          Tips for your practice
        </h2>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-zen-fg-muted transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul className="mt-3 space-y-2 border-t border-zen-border-soft pt-3 pb-1">
          {PRACTICE_TIPS.map((tip) => (
            <li
              key={tip}
              className="flex gap-2 font-ui text-[0.875rem] leading-relaxed text-zen-fg-muted md:text-[0.9375rem]"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zen-secondary/60" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
