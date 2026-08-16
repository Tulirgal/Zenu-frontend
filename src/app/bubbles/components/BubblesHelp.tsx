'use client';

import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ZenSheet,
  ZenSheetContent,
  ZenSheetHeader,
  ZenSheetTitle,
} from '@/components/zen';

export function BubblesHelp({
  className,
  fadeHint = true,
}: {
  className?: string;
  /** Auto-fade the compact hint after a few seconds; help button stays. */
  fadeHint?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    if (!fadeHint) return;
    const t = window.setTimeout(() => setHintVisible(false), 5000);
    return () => window.clearTimeout(t);
  }, [fadeHint]);

  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-3 z-20 flex flex-col items-center gap-2 md:top-4',
          className,
        )}
      >
        <p
          className={cn(
            'rounded-zen-full border border-white/15 bg-black/35 px-3 py-1.5 font-ui text-[0.75rem] text-white/85 backdrop-blur-md md:text-[0.8125rem]',
            'transition-opacity duration-700',
            hintVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="md:hidden">Tap to spawn · Drag to play</span>
          <span className="hidden md:inline">
            Tap to spawn · Drag to play · Space for clusters · Enter to pop all
          </span>
        </p>

        <button
          type="button"
          className={cn(
            'pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-zen-full',
            'border border-white/15 bg-black/30 text-white/80 backdrop-blur-md',
            'hover:bg-black/45 hover:text-white active:scale-[0.97]',
            'focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2',
            // After hint fades, park help at the top-right so it stays findable.
            !hintVisible &&
              'absolute right-3 top-0 md:right-4',
          )}
          aria-label="How to play"
          onClick={() => setOpen(true)}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ZenSheet open={open} onOpenChange={setOpen}>
        <ZenSheetContent side="bottom" className="rounded-t-zen-2xl max-h-[70dvh]">
          <ZenSheetHeader>
            <ZenSheetTitle className="font-ui text-base">How to play</ZenSheetTitle>
          </ZenSheetHeader>
          <ul className="mt-3 space-y-2 pb-6 font-ui text-sm text-zen-fg">
            <li>Tap empty space to spawn bubbles.</li>
            <li>Tap a bubble to pop it.</li>
            <li>Drag to leave a playful trail.</li>
            <li className="text-zen-fg-muted">Desktop: Space for clusters · Enter to pop all.</li>
          </ul>
        </ZenSheetContent>
      </ZenSheet>
    </>
  );
}
