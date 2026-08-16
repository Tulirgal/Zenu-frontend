'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

export interface ParticleCanvasProps {
  pattern: number[];
  cycleDuration: number;
  isPaused: boolean;
  speed: number;
  onCycleComplete?: () => void;
  /** Fires when phase label changes (full phase length in seconds). */
  onPhaseChange?: (phase: string, seconds: number) => void;
  /** Fires each frame with remaining whole seconds in the active phase. */
  onPhaseTick?: (phase: string, remainingSeconds: number, phaseProgress: number) => void;
  /** Hide built-in phase label (player renders its own). */
  hideLabels?: boolean;
  className?: string;
}

const DEFAULT_COLORS = {
  primary: 'hsl(210, 70%, 58%)',
  accent: 'hsl(262, 45%, 62%)',
  secondary: 'hsl(200, 55%, 62%)',
} as const;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function stepLabelsFor(length: number): string[] {
  if (length === 4) return ['Inhale', 'Hold', 'Exhale', 'Hold'];
  if (length === 3) return ['Inhale', 'Hold', 'Exhale'];
  if (length === 2) return ['Inhale', 'Exhale'];
  return Array.from({ length }, (_, i) => (i === 0 ? 'Inhale' : i === length - 1 ? 'Exhale' : 'Hold'));
}

export const ParticleCanvas = ({
  pattern,
  cycleDuration,
  isPaused,
  speed,
  onCycleComplete,
  onPhaseChange,
  onPhaseTick,
  hideLabels = false,
  className,
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);
  const cycleCounterRef = useRef<number>(0);
  const lastPhaseRef = useRef<string>('');
  const lastRemainingRef = useRef<number>(-1);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onPhaseTickRef = useRef(onPhaseTick);
  const onCycleCompleteRef = useRef(onCycleComplete);
  onPhaseChangeRef.current = onPhaseChange;
  onPhaseTickRef.current = onPhaseTick;
  onCycleCompleteRef.current = onCycleComplete;
  const prefersReducedMotion = useRef(false);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const getParticleCount = useCallback(() => {
    if (typeof window === 'undefined') return 24;
    const width = window.innerWidth;
    if (prefersReducedMotion.current) return 8;
    if (width < 768) return 18;
    if (width < 1024) return 28;
    return 36;
  }, []);

  const getCSSColor = useCallback((varName: string, fallback: string): string => {
    try {
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue(varName).trim();
      if (!value) return fallback;
      if (value.startsWith('hsl') || value.startsWith('rgb') || value.startsWith('#')) return value;
      const [h, s, l] = value.split(' ').map((segment) => parseFloat(segment.replace('%', '')));
      if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) return fallback;
      return `hsl(${h}, ${s}%, ${l}%)`;
    } catch {
      return fallback;
    }
  }, []);

  const colors = useMemo(
    () => [
      getCSSColor('--zen-primary', DEFAULT_COLORS.primary),
      getCSSColor('--zen-secondary', DEFAULT_COLORS.accent),
      getCSSColor('--zen-accent', DEFAULT_COLORS.secondary),
    ],
    [getCSSColor],
  );

  const patternTotal = useMemo(
    () => pattern.reduce((total, value) => total + value, 0) || 1,
    [pattern],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.offsetWidth || 1;
      const cssH = canvas.offsetHeight || 1;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particles: Particle[] = [];
      const particleCount = getParticleCount();
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.4;
        const distance = 70 + Math.random() * 120;
        const x = cssW / 2 + Math.cos(angle) * distance;
        const y = cssH / 2 + Math.sin(angle) * distance;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: 1 + Math.random() * 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 0.06,
          speedY: (Math.random() - 0.5) * 0.06,
        });
      }
      particlesRef.current = particles;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [colors, getParticleCount]);

  useEffect(() => {
    if (isPaused) {
      pausedTimeRef.current = Date.now();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    if (pausedTimeRef.current > 0) {
      startTimeRef.current += Date.now() - pausedTimeRef.current;
      pausedTimeRef.current = 0;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const labels = stepLabelsFor(pattern.length);

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) * speed;
      const adjustedCycleDuration = Math.max(1, cycleDuration) * 1000;
      const cycleProgress = (elapsed % adjustedCycleDuration) / adjustedCycleDuration;
      const cycleIndex = Math.floor(elapsed / adjustedCycleDuration);

      if (cycleIndex !== cycleCounterRef.current) {
        cycleCounterRef.current = cycleIndex;
        onCycleCompleteRef.current?.();
      }

      let cumulativeTime = 0;
      let currentStepIndex = 0;
      for (let i = 0; i < pattern.length; i++) {
        const stepDuration = pattern[i] / patternTotal;
        if (cycleProgress < cumulativeTime + stepDuration) {
          currentStepIndex = i;
          break;
        }
        cumulativeTime += stepDuration;
        if (i === pattern.length - 1) currentStepIndex = i;
      }

      const phaseLabel = labels[currentStepIndex] ?? 'Inhale';
      const phaseSeconds = pattern[currentStepIndex] ?? 0;
      const stepFrac = pattern[currentStepIndex] / patternTotal;
      const phaseProgress = stepFrac > 0 ? (cycleProgress - cumulativeTime) / stepFrac : 0;
      const remainingSeconds = Math.max(0, Math.ceil(phaseSeconds * (1 - Math.min(1, phaseProgress))));

      if (phaseLabel !== lastPhaseRef.current) {
        lastPhaseRef.current = phaseLabel;
        onPhaseChangeRef.current?.(phaseLabel, phaseSeconds);
        if (labelRef.current) labelRef.current.textContent = phaseLabel;
      }

      if (remainingSeconds !== lastRemainingRef.current) {
        lastRemainingRef.current = remainingSeconds;
        onPhaseTickRef.current?.(phaseLabel, remainingSeconds, phaseProgress);
      } else {
        onPhaseTickRef.current?.(phaseLabel, remainingSeconds, phaseProgress);
      }

      // Expansion: inhale expand, first hold expanded, exhale contract, post-exhale hold contracted
      let breathExpansion = 0;
      if (currentStepIndex === 0) {
        breathExpansion = easeInOutCubic(Math.min(1, phaseProgress));
      } else if (pattern.length >= 3 && currentStepIndex === 2) {
        breathExpansion = 1 - easeInOutCubic(Math.min(1, phaseProgress));
      } else if (currentStepIndex === 1) {
        breathExpansion = 1;
      } else {
        // Second hold (or other): stay contracted with tiny pulse
        breathExpansion = 0.04 * Math.sin(phaseProgress * Math.PI * 2);
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Soft atmospheric wash
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      bg.addColorStop(0, 'hsla(210, 60%, 70%, 0.12)');
      bg.addColorStop(0.45, 'hsla(262, 40%, 75%, 0.08)');
      bg.addColorStop(1, 'hsla(40, 40%, 99%, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const baseR = Math.min(w, h) * 0.16;
      const orbR = baseR * (0.85 + breathExpansion * 0.35);

      if (!prefersReducedMotion.current) {
        ctx.globalCompositeOperation = 'lighter';
        const scale = 0.92 + breathExpansion * 0.2;
        particlesRef.current.forEach((particle) => {
          const dx = particle.baseX - cx;
          const dy = particle.baseY - cy;
          particle.x = cx + dx * scale + particle.speedX * breathExpansion * 8;
          particle.y = cy + dy * scale + particle.speedY * breathExpansion * 8;
          const particleSize = particle.size * (1 + breathExpansion * 0.8);
          ctx.globalAlpha = 0.2 + breathExpansion * 0.25;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
        ctx.globalCompositeOperation = 'source-over';
      }

      // Outer glow ring
      const glow = ctx.createRadialGradient(cx, cy, orbR * 0.2, cx, cy, orbR * 1.8);
      glow.addColorStop(0, `hsla(210, 70%, 65%, ${0.35 + breathExpansion * 0.25})`);
      glow.addColorStop(0.45, `hsla(262, 45%, 68%, ${0.18 + breathExpansion * 0.12})`);
      glow.addColorStop(1, 'hsla(210, 50%, 70%, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, orbR * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Core orb
      const core = ctx.createRadialGradient(
        cx - orbR * 0.25,
        cy - orbR * 0.25,
        orbR * 0.05,
        cx,
        cy,
        orbR,
      );
      core.addColorStop(0, 'hsla(210, 80%, 92%, 0.95)');
      core.addColorStop(0.35, `hsla(210, 70%, 70%, ${0.55 + breathExpansion * 0.2})`);
      core.addColorStop(0.75, `hsla(262, 45%, 62%, ${0.4 + breathExpansion * 0.15})`);
      core.addColorStop(1, 'hsla(262, 40%, 55%, 0.15)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fill();

      // Thin outer ring + circular progress for current phase
      ctx.strokeStyle = `hsla(210, 55%, 55%, ${0.25 + breathExpansion * 0.25})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, orbR + 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'hsla(262, 45%, 58%, 0.55)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, orbR + 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, phaseProgress));
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, speed, pattern, cycleDuration, patternTotal]);

  return (
    <div className={cn('relative flex h-full w-full flex-col items-center justify-center', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      />
      {!hideLabels ? (
        <div
          ref={labelRef}
          className="pointer-events-none absolute top-6 left-0 right-0 z-10 text-center font-display text-xl text-zen-primary"
        >
          Inhale
        </div>
      ) : null}
    </div>
  );
};
