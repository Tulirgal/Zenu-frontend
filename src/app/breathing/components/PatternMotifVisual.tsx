'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { derivePatternMotif } from './patternVisual';

const CX = 56;
const CY = 56;
const R_OUTER = 40;
const R_MID = 28;
const R_CORE = 14;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(r: number, startDeg: number, endDeg: number) {
  const start = polar(CX, CY, r, startDeg);
  const end = polar(CX, CY, r, endDeg);
  const sweep = endDeg - startDeg;
  const large = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

/**
 * Deliberate breathing motif from DB `steps` — never technique names.
 * Phase arcs are proportional to each step duration.
 */
export function PatternMotifVisual({
  steps,
  active = false,
  className,
}: {
  steps: number[];
  active?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const reducedMotion = usePrefersReducedMotion();
  const motif = derivePatternMotif(steps);
  const safeSteps = steps.length ? steps : [4, 4];
  const total = safeSteps.reduce((a, b) => a + b, 0) || 1;

  let cursor = 0;
  const segments = safeSteps.map((sec, i) => {
    const span = (sec / total) * 360;
    const start = cursor;
    const end = cursor + Math.max(span - 2.5, 4);
    cursor += span;
    const weight = sec / Math.max(...safeSteps);
    return { i, start, end, weight, sec };
  });

  const glowId = `breath-glow-${uid}`;
  const coreId = `breath-core-${uid}`;

  return (
    <div
      className={cn('relative mx-auto flex h-28 w-28 items-center justify-center', className)}
      aria-hidden="true"
      data-motif={motif}
    >
      <div
        className={cn(
          'absolute inset-1 rounded-full transition-shadow duration-300',
          'bg-[hsl(220_45%_95%)]',
          'shadow-[inset_0_0_0_1px_hsl(221_70%_52%/0.14)]',
          'group-hover:shadow-[0_0_24px_-4px_hsl(221_70%_52%/0.4),inset_0_0_0_1px_hsl(221_70%_52%/0.22)]',
        )}
        style={
          active
            ? { boxShadow: '0 0 28px -6px hsl(262 48% 58% / 0.45), inset 0 0 0 1px hsl(221 70% 52% / 0.2)' }
            : undefined
        }
      />

      <motion.svg
        viewBox="0 0 112 112"
        className="relative z-[1] h-[6.5rem] w-[6.5rem] overflow-visible"
        animate={
          reducedMotion
            ? { scale: 1 }
            : active
              ? { scale: [1, 1.045, 1] }
              : { scale: 1 }
        }
        whileHover={reducedMotion ? undefined : { scale: 1.04 }}
        transition={
          active && !reducedMotion
            ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', bounce: 0, duration: 0.35 }
        }
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="hsl(210 80% 70%)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="hsl(262 48% 65%)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(221 70% 52%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={coreId} cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="hsl(210 90% 96%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(210 70% 68%)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(262 48% 58%)" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={50} fill={`url(#${glowId})`} />

        <circle
          cx={CX}
          cy={CY}
          r={R_OUTER + 4}
          fill="none"
          stroke="hsl(221 70% 52%)"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R_MID}
          fill="none"
          stroke="hsl(262 48% 58%)"
          strokeOpacity="0.22"
          strokeWidth="1.25"
          strokeDasharray={motif === 'wave' ? '3 5' : undefined}
        />

        {segments.map((seg) => {
          const strokeW = 3.5 + seg.weight * 3.5;
          const opacity = 0.5 + seg.weight * 0.45;
          const color =
            seg.i === 0
              ? 'hsl(210 70% 55%)'
              : seg.i === segments.length - 1
                ? 'hsl(262 48% 58%)'
                : 'hsl(200 55% 55%)';
          return (
            <path
              key={seg.i}
              d={arcPath(R_OUTER, seg.start, seg.end)}
              fill="none"
              stroke={color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeOpacity={opacity}
            />
          );
        })}

        {motif === 'longExhale' ? (
          <path
            d={`M ${CX - 34} ${CY + 2} Q ${CX} ${CY + 14} ${CX + 34} ${CY + 2}`}
            fill="none"
            stroke="hsl(262 48% 58%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        ) : null}

        <circle cx={CX} cy={CY} r={R_CORE + 6} fill="hsl(210 70% 52%)" fillOpacity="0.14" />
        <circle cx={CX} cy={CY} r={R_CORE} fill={`url(#${coreId})`} />
        <circle cx={CX - 3} cy={CY - 4} r={3.5} fill="white" fillOpacity="0.55" />

        {segments.map((seg) => {
          const mid = (seg.start + seg.end) / 2;
          const p = polar(CX, CY, R_OUTER + 1, mid);
          return (
            <circle
              key={`dot-${seg.i}`}
              cx={p.x}
              cy={p.y}
              r={2.2 + seg.weight}
              fill="hsl(221 70% 45%)"
              fillOpacity={0.55 + seg.weight * 0.35}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}
