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
  const paperCount = Math.min(12, entryCount);

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
  const paperCount = Math.min(12, entryCount);

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
          className="relative z-[1] h-auto w-full drop-shadow-[0_12px_24px_rgba(240,150,50,0.15)]"
          role="img"
          aria-label={`Gratitude jar with ${entryCount} moments`}
        >
          <defs>
            <clipPath id="jarClip">
              <path d="M50 85 L170 85 L170 210 Q170 240 140 240 L80 240 Q50 240 50 210 Z" />
            </clipPath>
          </defs>

          {/* Jar Neck */}
          <rect x="50" y="70" width="120" height="15" fill="#fde047" />

          {/* Jar Body Fill & Outline */}
          <path
            d="M50 85 L170 85 L170 210 Q170 240 140 240 L80 240 Q50 240 50 210 Z"
            fill="#fef08a"
            stroke="#eab308"
            strokeWidth="4"
          />

          {/* Glass Highlight */}
          <rect x="60" y="100" width="8" height="90" rx="4" fill="#ffffff" opacity="0.6" />

          {/* Inside Jar (Clipped) */}
          <g clipPath="url(#jarClip)">
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

          {/* Lid container (animated) */}
          <motion.g
            animate={{ y: lidY, rotate: lidRotate }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 180, damping: 20 }
            }
            style={{ transformOrigin: '110px 62px' }}
          >
            {/* Knob */}
            <rect x="85" y="20" width="50" height="20" rx="8" fill="#a855f7" />
            {/* Main Lid */}
            <rect x="40" y="35" width="140" height="35" rx="8" fill="#a855f7" />
            {/* Lid Highlight */}
            <rect x="50" y="42" width="30" height="6" rx="3" fill="#d8b4fe" opacity="0.5" />
            
            {/* Heart */}
            <path
              d="M 110 62 C 110 62 100 54 100 48 C 100 43 106 43 110 47 C 114 43 120 43 120 48 C 120 54 110 62 110 62 Z"
              fill="#ef4444"
            />
          </motion.g>
        </svg>
      </div>
    </motion.div>
  );
});
