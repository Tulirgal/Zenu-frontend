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
            <g id="sakura">
              <circle cx="0" cy="0" r="14" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
              <circle cx="0" cy="-5" r="4" fill="#f472b6" />
              <circle cx="4.7" cy="-1.5" r="4" fill="#f472b6" />
              <circle cx="2.9" cy="4" r="4" fill="#f472b6" />
              <circle cx="-2.9" cy="4" r="4" fill="#f472b6" />
              <circle cx="-4.7" cy="-1.5" r="4" fill="#f472b6" />
              <circle cx="0" cy="0" r="2" fill="#fdf2f8" />
            </g>
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
              const x = 75 + (i % 3) * 35 + (i % 2) * 10;
              const y = 215 - Math.floor(i / 3) * 28 - (i % 2) * 8;
              const rot = ((i * 37) % 60) - 30;
              return (
                <motion.use
                  key={i}
                  href="#sakura"
                  x={x}
                  y={y}
                  animate={
                    busy && !reducedMotion
                      ? { y: [y, y - 6, y], rotate: [rot, rot + 15, rot] }
                      : { y, rotate: rot }
                  }
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 1.8,
                          delay: i * 0.08,
                          repeat: busy ? Infinity : 0,
                          repeatType: 'mirror',
                          ease: 'easeInOut',
                        }
                  }
                  style={{ transformOrigin: `${x}px ${y}px` }}
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

          {/* Notification Badge */}
          {entryCount > 0 && (
            <motion.g 
              transform="translate(170, 35)"
              initial={false}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              key={entryCount} // Triggers animation on count change
            >
              <circle cx="0" cy="0" r="16" fill="#fb7185" />
              <text x="0" y="5" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="ui-sans-serif, system-ui, sans-serif" textAnchor="middle">
                {entryCount > 99 ? '99+' : entryCount}
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </motion.div>
  );
});
