'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type JarPhase = 'idle' | 'absorb' | 'resonate';

export type GratitudeJarHandle = {
  getMouthElement: () => HTMLElement | null;
};

/**
 * Visual vessel only — no CTAs.
 * `mouthRef` marks the visible jar opening (not the container center).
 */
export const GratitudeJar = forwardRef<
  GratitudeJarHandle,
  {
    entryCount: number;
    active?: boolean;
    phase?: JarPhase;
    className?: string;
  }
>(function GratitudeJar(
  { entryCount, active = false, phase = 'idle', className },
  ref,
) {
  const reducedMotion = usePrefersReducedMotion();
  const mouthRef = useRef<HTMLSpanElement>(null);
  const fill = Math.min(1, entryCount / 12);
  const fillHeight = 28 + fill * 95;
  const paperCount = Math.min(8, entryCount);

  const busy = phase === 'absorb' || phase === 'resonate' || active;
  const lidY = busy && !reducedMotion ? -18 : 0;
  const lidRotate = busy && !reducedMotion ? -12 : 0;
  const glowOpacity =
    phase === 'absorb' ? 0.7 : phase === 'resonate' ? 0.6 : active ? 0.55 : 0.22;

  useImperativeHandle(ref, () => ({
    getMouthElement: () => mouthRef.current,
  }));

  return (
    <motion.div
      className={cn('relative mx-auto flex w-full max-w-sm flex-col items-center', className)}
      aria-hidden="true"
      animate={
        phase === 'absorb' && !reducedMotion
          ? { scale: [1, 1.07, 1] }
          : phase === 'resonate' && !reducedMotion
            ? { scale: [1, 1.03, 1] }
            : { scale: 1 }
      }
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : phase === 'absorb' || phase === 'resonate'
            ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
            : { type: 'spring', stiffness: 200, damping: 20, mass: 0.75 }
      }
    >
      <motion.div
        className="pointer-events-none absolute inset-x-8 top-8 h-48 rounded-full blur-3xl"
        animate={{ opacity: glowOpacity }}
        transition={
          reducedMotion
            ? { duration: 0.15 }
            : { type: 'spring', stiffness: 120, damping: 22 }
        }
        style={{
          background:
            'radial-gradient(circle, hsl(32 70% 62% / 0.45) 0%, hsl(28 50% 88% / 0.2) 45%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-[220px]">
        {/* Exact mouth / opening marker — under lid, at neck */}
        <span
          ref={mouthRef}
          className="pointer-events-none absolute left-1/2 z-10 h-2 w-2 -translate-x-1/2"
          style={{ top: '22%' }}
          data-jar-mouth
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 220 280"
          className="relative z-[1] h-auto w-full drop-shadow-[0_18px_40px_rgba(240,150,50,0.15)]"
          role="img"
          aria-label={`Gratitude jar with ${entryCount} moments`}
        >
          <defs>
            <linearGradient id="jarGlass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(40 40% 90% / 0.15)" />
              <stop offset="45%" stopColor="hsl(35 30% 92% / 0.05)" />
              <stop offset="100%" stopColor="hsl(28 25% 86% / 0.1)" />
            </linearGradient>
            <linearGradient id="jarFill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(32 85% 60% / 0.75)" />
              <stop offset="100%" stopColor="hsl(38 90% 70% / 0.45)" />
            </linearGradient>
            <clipPath id="jarClip">
              <path d="M58 78 C58 78 52 118 52 160 C52 210 68 248 110 248 C152 248 168 210 168 160 C168 118 162 78 162 78 Z" />
            </clipPath>
          </defs>

          <motion.g
            animate={{ y: lidY, rotate: lidRotate }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 180, damping: 20 }
            }
            style={{ transformOrigin: '110px 62px' }}
          >
            <ellipse cx="110" cy="58" rx="48" ry="10" fill="hsl(28 35% 42%)" />
            <rect x="68" y="48" width="84" height="14" rx="4" fill="hsl(28 40% 38%)" />
            <ellipse cx="110" cy="48" rx="42" ry="8" fill="hsl(32 45% 48%)" />
          </motion.g>

          <path
            d="M78 68 L78 78 L142 78 L142 68 Z"
            fill="hsl(40 30% 94% / 0.1)"
            stroke="hsl(28 25% 70% / 0.2)"
            strokeWidth="1.5"
          />

          <path
            d="M58 78 C58 78 52 118 52 160 C52 210 68 248 110 248 C152 248 168 210 168 160 C168 118 162 78 162 78 Z"
            fill="url(#jarGlass)"
            stroke="hsl(28 30% 65% / 0.35)"
            strokeWidth="2"
          />

          <g clipPath="url(#jarClip)">
            <motion.rect
              x="52"
              width="116"
              animate={{ y: 248 - fillHeight, height: fillHeight }}
              initial={false}
              transition={
                reducedMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', stiffness: 140, damping: 24 }
              }
              fill="url(#jarFill)"
            />
            {Array.from({ length: paperCount }).map((_, i) => {
              const x = 70 + (i % 4) * 18 + (i % 2) * 4;
              const y = 230 - Math.floor(i / 4) * 22 - (i % 3) * 6;
              const rot = ((i * 17) % 40) - 20;
              const hue = 28 + (i % 5) * 8;
              return (
                <motion.rect
                  key={i}
                  x={x}
                  y={y}
                  width={22}
                  height={14}
                  rx={2}
                  fill={`hsl(${hue} 55% ${88 - (i % 3) * 4}%)`}
                  stroke={`hsl(${hue} 35% 70% / 0.4)`}
                  strokeWidth={0.8}
                  animate={
                    busy && !reducedMotion
                      ? { y: [y, y - 4, y], rotate: [rot, rot + 3, rot] }
                      : { y, rotate: rot }
                  }
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 1.4,
                          delay: i * 0.04,
                          repeat: busy ? Infinity : 0,
                          repeatType: 'mirror',
                          ease: 'easeInOut',
                        }
                  }
                  style={{ transformOrigin: `${x + 11}px ${y + 7}px` }}
                />
              );
            })}
          </g>

          <path
            d="M70 100 C68 140 70 190 78 220"
            fill="none"
            stroke="hsl(0 0% 100% / 0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="mt-4 font-ui text-xs text-white/60">
        {entryCount === 0
          ? 'Empty for now'
          : entryCount === 1
            ? '1 moment kept'
            : `${entryCount} moments kept`}
      </p>
    </motion.div>
  );
});
