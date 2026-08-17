'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { BurstPhase } from './BurstCompanion';

/** Deterministic pop shards — no Math.random in render. */
function shard(i: number, bubbleSize: number) {
  const angle = (i / 20) * Math.PI * 2;
  const startR = bubbleSize / 2;
  const endR = startR + 36 + ((i * 17) % 50);
  const size = 3 + (i % 5);
  return {
    size,
    sx: Math.cos(angle) * startR,
    sy: Math.sin(angle) * startR,
    ex: Math.cos(angle) * endR,
    ey: Math.sin(angle) * endR + 24 + ((i * 13) % 40),
    dur: 0.28 + (i % 5) * 0.04,
  };
}

export function BurstBubble({
  phase,
  size,
  thought,
  className,
}: {
  phase: BurstPhase;
  size: number;
  thought: string;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const showBubble = phase !== 'affirming';
  const showThought = phase === 'traveling' || phase === 'expanding';

  return (
    <motion.div
      layout
      className={cn(
        'relative flex w-full items-center justify-center',
        phase !== 'affirming' ? 'min-h-[240px] md:min-h-[280px]' : 'min-h-0 h-0 overflow-hidden',
        className,
      )}
    >
      <AnimatePresence>
        {showBubble ? (
          <motion.div
            key="bubble"
            className="relative flex items-center justify-center"
            animate={
              phase === 'popping'
                ? { scale: reducedMotion ? 1 : 1.08, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={
              phase === 'popping'
                ? { duration: reducedMotion ? 0.12 : 0.1, ease: 'easeOut' }
                : { type: 'spring', bounce: 0, duration: 0.4 }
            }
          >
            <motion.svg
              width={size}
              height={size}
              viewBox="0 0 200 200"
              animate={{ width: size, height: size }}
              transition={
                reducedMotion
                  ? { duration: 0.2 }
                  : { type: 'spring', bounce: 0.12, duration: 0.45 }
              }
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="burstBubbleGrad" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.92" />
                  <stop offset="42%" stopColor="hsl(262 48% 72%)" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="hsl(262 55% 48%)" stopOpacity="0.28" />
                </radialGradient>
                <linearGradient id="burstBubbleStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--zen-secondary))" />
                  <stop offset="55%" stopColor="hsl(var(--zen-primary))" />
                  <stop offset="100%" stopColor="hsl(var(--zen-accent))" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="url(#burstBubbleGrad)"
                stroke="hsl(var(--zen-secondary))"
                strokeWidth="2"
                strokeOpacity="0.45"
              />
              <ellipse
                cx="70"
                cy="60"
                rx="18"
                ry="10"
                fill="white"
                opacity="0.5"
                transform="rotate(-30 70 60)"
              />
              <circle
                cx="100"
                cy="100"
                r="93"
                fill="none"
                stroke="url(#burstBubbleStroke)"
                strokeWidth="2.5"
                opacity="0.35"
              />
            </motion.svg>

            <AnimatePresence>
              {showThought && thought ? (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center px-5"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
                  animate={
                    phase === 'traveling'
                      ? { opacity: 1, y: 8, scale: 0.78 }
                      : { opacity: 0.7, y: 0, scale: 0.55 }
                  }
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="max-w-[78%] break-words text-center font-ui text-sm font-medium leading-snug text-white md:text-base">
                    {thought.length > 90 ? `${thought.slice(0, 90)}…` : thought}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'popping' ? (
          <>
            <motion.div
              className="absolute rounded-full border-2 border-violet-300/35"
              style={{ width: size, height: size }}
              initial={{ scale: 1, opacity: 0.65 }}
              animate={{ scale: reducedMotion ? 1.05 : 1.18, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              aria-hidden="true"
            />
            {!reducedMotion
              ? Array.from({ length: 20 }, (_, i) => {
                  const s = shard(i, size);
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-violet-300"
                      style={{ width: s.size, height: s.size }}
                      initial={{ x: s.sx, y: s.sy, scale: 1, opacity: 0.9 }}
                      animate={{ x: s.ex, y: s.ey, scale: 0, opacity: 0 }}
                      transition={{ duration: s.dur, ease: 'easeOut' }}
                      aria-hidden="true"
                    />
                  );
                })
              : null}
          </>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
