'use client';

import { motion } from 'framer-motion';
import { Panda } from '@/components/panda/Panda';
import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function ThoughtCloud({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute -right-0.5 top-0.5 flex items-end gap-0.5 md:-right-1 md:top-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full bg-white/65"
          style={{
            width: 3 + i * 1.5,
            height: 3 + i * 1.5,
            marginBottom: i === 0 ? 1 : i === 1 ? 4 : 7,
          }}
          animate={
            reducedMotion
              ? { opacity: 0.5 }
              : { opacity: [0.3, 0.7, 0.3] }
          }
          transition={
            reducedMotion
              ? { duration: 0.15 }
              : {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.18,
                }
          }
        />
      ))}
    </motion.div>
  );
}

/**
 * Primary Seviyan companion — document flow, tight above composer (no borders/cards).
 */
export function SeviyanCompanion({
  emotion,
  animation,
  showThoughtCloud,
  className,
}: {
  emotion: PandaEmotion;
  animation: PandaAnimation;
  showThoughtCloud?: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const resolvedAnimation =
    reducedMotion && (animation === 'breathe' || animation === 'idle')
      ? 'idle'
      : reducedMotion && animation === 'tilt'
        ? 'attentive'
        : animation;

  return (
    <div
      className={cn(
        'relative flex w-full shrink-0 items-end justify-center',
        'h-[64px] pb-0 md:h-[88px]',
        className,
      )}
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft ground glow — presence without a card */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-6 w-16 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(147,197,253,0.35)_0%,transparent_70%)] blur-md md:h-7 md:w-20"
          aria-hidden="true"
        />
        <Panda
          emotion={emotion}
          activity={
            emotion === 'listening'
              ? 'listening'
              : animation === 'breathe'
                ? 'breathing'
                : null
          }
          animation={resolvedAnimation}
          mode="responsive"
          size={64}
          className="relative z-[1] md:!h-[84px] md:!w-[84px]"
          animated={!reducedMotion}
          label={`Seviyan is ${emotion}`}
        />
        {showThoughtCloud ? <ThoughtCloud reducedMotion={reducedMotion} /> : null}
      </div>
    </div>
  );
}
