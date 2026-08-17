'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Panda } from '@/components/panda/Panda';
import type { PandaActivity, PandaAnimation, PandaEmotion } from '@/components/panda/types';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type BurstPhase = 'typing' | 'traveling' | 'expanding' | 'popping' | 'affirming';

type Presentation = {
  emotion: PandaEmotion;
  activity: PandaActivity | null;
  animation: PandaAnimation;
  whisper: string | null;
};

const BY_PHASE: Record<BurstPhase, Presentation> = {
  typing: {
    emotion: 'listening',
    activity: 'listening',
    animation: 'attentive',
    whisper: 'I’m here. Let it out.',
  },
  traveling: {
    emotion: 'curious',
    activity: 'release',
    animation: 'tilt',
    whisper: 'Watching it rise…',
  },
  expanding: {
    emotion: 'surprised',
    activity: 'release',
    animation: 'bounce',
    whisper: 'Whenever you’re ready.',
  },
  popping: {
    emotion: 'excited',
    activity: 'celebration',
    animation: 'bounce',
    whisper: null,
  },
  affirming: {
    emotion: 'happy',
    activity: 'release',
    animation: 'wave',
    whisper: 'That was brave.',
  },
};

/**
 * Inline Burst companion — reacts to release phases (no teleport).
 */
export function BurstCompanion({
  phase,
  className,
}: {
  phase: BurstPhase;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const { emotion, activity, animation, whisper } = BY_PHASE[phase];

  return (
    <div
      className={cn(
        'pointer-events-none flex flex-col items-center gap-1.5',
        className,
      )}
      aria-live="polite"
    >
      <motion.div
        key={`${phase}-${emotion}`}
        initial={reducedMotion ? false : { scale: 0.96, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reducedMotion
            ? { duration: 0.12 }
            : { type: 'spring', bounce: 0, duration: 0.35 }
        }
        className="relative"
      >
        <div
          className="pointer-events-none absolute inset-0 -m-3 rounded-full opacity-45 blur-2xl"
          style={{ background: 'hsl(262 48% 70% / 0.35)' }}
          aria-hidden="true"
        />
        <Panda
          emotion={emotion}
          activity={activity}
          animation={reducedMotion && animation === 'bounce' ? 'idle' : animation}
          mode="responsive"
          size={72}
          animated={!reducedMotion}
          label={`Panda companion — ${phase}`}
          className="relative z-[1]"
        />
      </motion.div>

      <div className="min-h-[1.25rem]">
        <AnimatePresence mode="wait">
          {whisper ? (
            <motion.p
              key={whisper}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
              className="max-w-[11rem] text-center font-ui text-xs text-purple-100/90"
            >
              {whisper}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
