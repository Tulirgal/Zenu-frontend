'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import type {
  PandaActivity,
  PandaAnimation,
  PandaEmotion,
} from '@/components/panda/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export type HomePandaPresentation = {
  emotion: PandaEmotion;
  activity: PandaActivity | null;
  animation: PandaAnimation;
};

/**
 * One mobile composition: greeting copy + Panda in shared atmosphere.
 * Desktop stays text-only (hero Panda lives in recommendation).
 */
export function HomeGreeting({
  displayName,
  panda,
  className,
}: {
  displayName: string;
  panda?: HomePandaPresentation | null;
  className?: string;
}) {
  const greeting = useMemo(() => timeGreeting(), []);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'zen-home-section relative overflow-visible',
        className,
      )}
    >
      {/* Shared soft field — ties text + Panda into one environment */}
      <div
        className="pointer-events-none absolute -right-6 -top-4 h-36 w-44 md:hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 60% 55%, hsl(var(--zen-secondary) / 0.14) 0%, hsl(var(--zen-emotion-calm) / 0.06) 42%, transparent 72%)',
          }}
        />
        <div
          className="absolute right-2 bottom-2 h-20 w-28 rounded-[40%_60%_55%_45%] opacity-50 blur-2xl"
          style={{ background: 'hsl(var(--zen-secondary) / 0.12)' }}
        />
      </div>

      <div className="relative grid grid-cols-[minmax(0,1fr)_6.25rem] items-end gap-0 md:grid-cols-1">
        <div className="min-w-0 relative z-10 pb-0.5 pr-1">
          <p className="font-ui text-[0.8125rem] font-medium tracking-tight text-zen-secondary mb-2.5 md:zen-eyebrow md:mb-3">
            {greeting}, {displayName}
          </p>
          <h1 className="font-display text-[1.55rem] leading-[1.16] tracking-[-0.03em] font-semibold text-zen-fg md:zen-home-display md:text-[2.35rem]">
            You&apos;re safe here.
          </h1>
          <p className="font-ui text-[0.875rem] leading-relaxed text-zen-fg-muted mt-2.5 max-w-[15.5rem] md:max-w-xl md:zen-body md:mt-3">
            Let&apos;s take a gentle step today.
          </p>
        </div>

        <div className="relative z-[1] md:hidden h-[6.5rem] -mb-1 -mr-1 justify-self-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={panda ? `${panda.emotion}-${panda.activity ?? 'none'}` : 'idle'}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.3 }}
              className="flex h-full items-end justify-center"
            >
              <Panda
                emotion={panda?.emotion ?? 'calm'}
                activity={panda?.activity ?? null}
                animation={panda?.animation ?? 'idle'}
                mode="responsive"
                size={100}
                label="Panda companion"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
