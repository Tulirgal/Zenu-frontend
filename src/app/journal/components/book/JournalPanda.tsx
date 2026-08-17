'use client';

import { motion } from 'framer-motion';
import { Panda } from '@/components/panda/Panda';
import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { JournalPandaPhase } from './bookTypes';

const PRESENTATION: Record<
  JournalPandaPhase,
  { emotion: PandaEmotion; animation: PandaAnimation; x: number; y: number }
> = {
  closed: { emotion: 'calm', animation: 'breathe', x: 0, y: 0 },
  hover: { emotion: 'listening', animation: 'attentive', x: 8, y: -2 },
  opening: { emotion: 'happy', animation: 'wave', x: 28, y: -4 },
  writing: { emotion: 'listening', animation: 'attentive', x: 18, y: 0 },
  thinking: { emotion: 'thinking', animation: 'tilt', x: 18, y: 0 },
  saving: { emotion: 'happy', animation: 'idle', x: 12, y: -6 },
  reading: { emotion: 'calm', animation: 'idle', x: 16, y: 0 },
  closing: { emotion: 'calm', animation: 'breathe', x: 4, y: 0 },
};

export function JournalPanda({
  phase,
  lite,
  className,
}: {
  phase: JournalPandaPhase;
  lite?: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const preset = PRESENTATION[phase];
  const size = lite ? 72 : 96;

  return (
    <motion.div
      className={cn(
        'pointer-events-none flex flex-col items-center',
        lite ? 'absolute -bottom-2 right-2 z-20' : 'relative z-20',
        className,
      )}
      aria-hidden="true"
      initial={false}
      animate={
        reducedMotion
          ? { x: 0, y: 0, scale: 1 }
          : {
              x: lite ? 0 : preset.x,
              y: lite ? 0 : preset.y,
              scale: phase === 'opening' || phase === 'saving' ? 1.04 : 1,
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 140, damping: 20 }
      }
    >
      <div
        className="rounded-full"
        style={{
          background:
            'radial-gradient(circle, hsl(262 40% 70% / 0.14) 0%, hsl(40 40% 92% / 0.35) 45%, transparent 70%)',
        }}
      >
        <Panda
          emotion={preset.emotion}
          activity={phase === 'writing' || phase === 'thinking' ? 'writing' : null}
          animation={preset.animation}
          mode="responsive"
          size={size}
          label="Panda companion"
        />
      </div>
    </motion.div>
  );
}
