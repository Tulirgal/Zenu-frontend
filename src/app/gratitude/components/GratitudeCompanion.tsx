'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Panda } from '@/components/panda/Panda';
import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import '@/components/panda/panda.css';

export type GratitudeWhisper = 'saved' | 'found' | 'empty' | 'choosing' | null;

/** Local stage — Panda stays in the corner; motion is lean/offer toward the jar. */
export type CompanionStage = 'rest' | 'reach' | 'offer';

const LINES: Record<Exclude<GratitudeWhisper, null>, string> = {
  saved: "That's worth keeping.",
  found: 'I chose this one for you.',
  empty: 'The jar is waiting.',
  choosing: 'Let me pick one…',
};

/**
 * Corner companion (same dock as other modules).
 * Reach = lean toward the jar; offer = present the chosen memory above Panda.
 */
export function GratitudeCompanion({
  whisper,
  visible,
  emotion = 'calm',
  animation = 'idle',
  stage = 'rest',
  className,
  children,
}: {
  whisper: GratitudeWhisper;
  visible: boolean;
  emotion?: PandaEmotion;
  animation?: PandaAnimation;
  stage?: CompanionStage;
  className?: string;
  children?: ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible || !whisper) {
      setShow(false);
      return;
    }
    setShow(true);
    const hold = whisper === 'choosing' ? 2200 : 1800;
    const t = setTimeout(() => setShow(false), hold);
    return () => clearTimeout(t);
  }, [visible, whisper]);

  if (!visible) return null;

  const shell =
    stage === 'reach'
      ? { x: reducedMotion ? 0 : -56, y: reducedMotion ? 0 : -28, scale: 1.06 }
      : stage === 'offer'
        ? { x: reducedMotion ? 0 : -10, y: reducedMotion ? 0 : -8, scale: 1.03 }
        : { x: 0, y: 0, scale: 1 };

  return (
    <div
      className={cn('relative z-[45] flex flex-col items-center gap-2', className)}
      aria-live="polite"
    >
      <AnimatePresence>
        {children ? (
          <motion.div
            key="offer-card"
            className="pointer-events-auto absolute bottom-full mb-4 w-[min(calc(100vw-1.5rem),22rem)] origin-bottom"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 280, damping: 26 }
            }
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none flex flex-col items-center gap-1.5"
        animate={shell}
        transition={
          reducedMotion
            ? { duration: 0.12 }
            : { type: 'spring', stiffness: 220, damping: 22, mass: 0.85 }
        }
      >
        <div className="zenu-panda-companion__stage">
          <Panda
            emotion={emotion}
            activity={stage === 'offer' ? 'gratitude' : null}
            animation={animation}
            mode="responsive"
            size={200}
            label="Panda companion"
          />
        </div>
        <AnimatePresence>
          {show && whisper ? (
            <motion.p
              key={whisper}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
              className="max-w-[11rem] text-center font-ui text-xs text-[hsl(28_45%_42%)] drop-shadow-sm"
            >
              {LINES[whisper]}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
