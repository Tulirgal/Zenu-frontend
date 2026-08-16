'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { PrimaryEmotion } from './emotionData';
import {
  PRIMARY_LABEL,
  PRIMARY_ORDER,
  primaryCssVar,
  primaryGlowCss,
  primarySoftCssVar,
} from './emotionTokens';
import { mapPrimaryToPanda } from './pandaMap';

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function sectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const o1 = polar(cx, cy, outerR, startAngle);
  const o2 = polar(cx, cy, outerR, endAngle);
  const i2 = polar(cx, cy, innerR, endAngle);
  const i1 = polar(cx, cy, innerR, startAngle);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');
}

export function EmotionWheel({
  selected,
  preview,
  onSelect,
  onPreviewChange,
  className,
}: {
  selected: PrimaryEmotion | null;
  /** Temporary preview while hovering (does not commit). */
  preview?: PrimaryEmotion | null;
  onSelect: (emotion: PrimaryEmotion) => void;
  onPreviewChange?: (emotion: PrimaryEmotion | null) => void;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const labelId = useId();
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [hovered, setHovered] = useState<PrimaryEmotion | null>(null);
  const [pressed, setPressed] = useState<PrimaryEmotion | null>(null);

  const activeForPanda = selected ?? preview ?? hovered;
  const panda = mapPrimaryToPanda(activeForPanda);

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 148;
  const innerR = 72;
  const slice = 360 / PRIMARY_ORDER.length;

  const focusIndex = useCallback((index: number) => {
    const n = PRIMARY_ORDER.length;
    const i = ((index % n) + n) % n;
    pathRefs.current[i]?.focus();
  }, []);

  const setHover = (emotion: PrimaryEmotion | null) => {
    setHovered(emotion);
    onPreviewChange?.(emotion);
  };

  return (
    <div
      className={cn('relative mx-auto w-full max-w-[19.5rem] sm:max-w-[22rem]', className)}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Primary emotion wheel
      </span>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {PRIMARY_ORDER.map((emotion) => (
            <filter
              key={`glow-${emotion}`}
              id={`compass-glow-${emotion}`}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="6"
                floodColor={primaryCssVar(emotion)}
                floodOpacity="0.55"
              />
            </filter>
          ))}
        </defs>

        {PRIMARY_ORDER.map((emotion, i) => {
          const start = i * slice;
          const end = start + slice;
          const mid = start + slice / 2;
          const isSelected = selected === emotion;
          const isHovered = hovered === emotion;
          const isPressed = pressed === emotion;
          const emphasize = isSelected || isHovered || isPressed;
          const dimmed = Boolean(selected) && !isSelected && !isHovered;

          const labelPos = polar(cx, cy, (innerR + outerR) / 2, mid);
          const lift = polar(cx, cy, emphasize && !reducedMotion ? 3 : 0, mid);
          const dx = lift.x - cx;
          const dy = lift.y - cy;

          let opacity = 0.68;
          if (dimmed) opacity = 0.34;
          if (isHovered && !isSelected) opacity = 0.92;
          if (isPressed) opacity = 0.96;
          if (isSelected) opacity = 1;

          return (
            <g
              key={emotion}
              style={{
                transform: reducedMotion
                  ? undefined
                  : `translate(${dx}px, ${dy}px) scale(${isPressed && !reducedMotion ? 0.985 : 1})`,
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'transform 160ms ease-out, opacity 180ms ease-out',
                cursor: 'pointer',
              }}
            >
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={sectorPath(cx, cy, innerR, outerR, start, end)}
                fill={primaryCssVar(emotion)}
                opacity={opacity}
                stroke={
                  isSelected
                    ? primaryCssVar(emotion)
                    : isHovered
                      ? primaryGlowCss(emotion, 0.85)
                      : 'hsl(var(--zen-surface))'
                }
                strokeWidth={isSelected ? 3.25 : isHovered ? 2.75 : 2.25}
                filter={
                  emphasize ? `url(#compass-glow-${emotion})` : undefined
                }
                role="button"
                tabIndex={0}
                aria-label={PRIMARY_LABEL[emotion]}
                aria-pressed={isSelected}
                className="outline-none focus-visible:stroke-[3.5]"
                style={{
                  transition: 'opacity 180ms ease-out, stroke-width 160ms ease-out',
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'touch') return;
                  setHover(emotion);
                }}
                onPointerLeave={() => {
                  setHover(null);
                  setPressed((p) => (p === emotion ? null : p));
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                  setPressed(emotion);
                  setHover(emotion);
                }}
                onPointerUp={() => {
                  setPressed(null);
                }}
                onPointerCancel={() => {
                  setPressed(null);
                  setHover(null);
                }}
                onClick={() => onSelect(emotion)}
                onFocus={() => setHover(emotion)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(emotion);
                  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusIndex(i + 1);
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusIndex(i - 1);
                  }
                }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fill={
                  emphasize || !selected
                    ? 'hsl(var(--zen-fg))'
                    : 'hsl(var(--zen-fg-muted))'
                }
                fontSize={emphasize ? 12 : 11}
                fontFamily="var(--zen-font-ui)"
                fontWeight={emphasize ? 650 : 500}
                opacity={emphasize ? 1 : dimmed ? 0.55 : 0.88}
                style={{ transition: 'font-size 160ms ease-out, opacity 160ms ease-out' }}
              >
                {PRIMARY_LABEL[emotion]}
              </text>
            </g>
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r={innerR - 4}
          fill="hsl(var(--zen-surface))"
          stroke="hsl(var(--zen-border-soft))"
          strokeWidth={1}
          className="pointer-events-none"
        />
      </svg>

      {/* Center Panda + emotion atmosphere */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[5.5rem] w-[5.5rem] items-end justify-center sm:h-24 sm:w-24">
          <div
            className="absolute inset-0 -m-3 rounded-full blur-2xl transition-[background,opacity] duration-300 ease-out"
            style={{
              background: activeForPanda
                ? primarySoftCssVar(activeForPanda)
                : 'hsl(var(--zen-secondary-soft))',
              opacity: activeForPanda ? 0.85 : 0.45,
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-2 rounded-full blur-xl transition-[background,opacity] duration-300 ease-out"
            style={{
              background: activeForPanda
                ? primaryGlowCss(activeForPanda, 0.35)
                : 'hsl(var(--zen-secondary) / 0.18)',
              opacity: 0.9,
            }}
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeForPanda ?? 'idle'}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.28 }}
              className="relative"
            >
              <Panda
                emotion={panda.emotion}
                activity={null}
                animation={panda.animation}
                mode="responsive"
                size={88}
                label="Panda reflecting your feeling"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
