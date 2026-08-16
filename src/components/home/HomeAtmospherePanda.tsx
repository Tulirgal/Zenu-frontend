'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { HomePandaPresentation } from '@/components/home/HomeGreeting';

/**
 * Desktop-only atmospheric companion — sits in the page environment,
 * never inside a card surface. Mobile Panda remains in HomeGreeting.
 */
export function HomeAtmospherePanda({
  presentation,
  className,
}: {
  presentation?: HomePandaPresentation | null;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-[5] hidden md:block',
        'right-0 top-0 sm:right-1',
        'w-[10.5rem] lg:w-[12.5rem] xl:w-[13.5rem]',
        className,
      )}
      aria-hidden="true"
    >
      {/* Soft environmental glow — no card, border, or hard shadow */}
      <div
        className="absolute left-1/2 top-1/2 h-[9rem] w-[9rem] -translate-x-1/2 -translate-y-[42%] rounded-full opacity-80 blur-3xl lg:h-[11rem] lg:w-[11rem]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--zen-secondary) / 0.22) 0%, hsl(var(--zen-emotion-calm) / 0.08) 48%, transparent 72%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-2 bottom-0 h-10 rounded-[50%] opacity-40 blur-xl"
        style={{ background: 'hsl(262 35% 78% / 0.35)' }}
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={
            presentation
              ? `${presentation.emotion}-${presentation.activity ?? 'none'}`
              : 'idle'
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.28 }}
          className="relative flex justify-center pt-1"
        >
          <Panda
            emotion={presentation?.emotion ?? 'calm'}
            activity={presentation?.activity ?? null}
            animation={presentation?.animation ?? 'idle'}
            mode="responsive"
            size={168}
            label="Panda companion"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
