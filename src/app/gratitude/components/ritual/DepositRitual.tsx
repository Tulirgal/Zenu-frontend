'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { GratitudeOrb } from './GratitudeOrb';
import { GratitudeParticles } from './GratitudeParticles';
import { peakBetween, quadPoint, type Point } from './geometry';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Stage = 'compress' | 'orb' | 'fly' | 'absorb' | 'done';

/**
 * Deposit ritual: compress card → orb → curved flight to jar mouth → absorb.
 * Source/target are viewport points measured at start (mouth, not jar center).
 */
export function DepositRitual({
  source,
  mouth,
  preview,
  onComplete,
}: {
  source: Point;
  mouth: Point;
  preview: { title: string; content: string };
  onComplete: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<Stage>(reducedMotion ? 'done' : 'compress');
  const [flyT, setFlyT] = useState(0);
  const [mounted, setMounted] = useState(false);

  const peak = useMemo(() => peakBetween(source, mouth, 90), [source, mouth]);
  const pos = useMemo(() => {
    if (stage === 'fly') return quadPoint(flyT, source, peak, mouth);
    if (stage === 'absorb' || stage === 'done') return mouth;
    return source;
  }, [stage, flyT, source, peak, mouth]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reducedMotion) {
      const t = window.setTimeout(onComplete, 80);
      return () => window.clearTimeout(t);
    }

    if (stage === 'compress') {
      const t = window.setTimeout(() => setStage('orb'), 140);
      return () => window.clearTimeout(t);
    }
    if (stage === 'orb') {
      const t = window.setTimeout(() => setStage('fly'), 100);
      return () => window.clearTimeout(t);
    }
    if (stage === 'fly') {
      const duration = 280;
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setFlyT(t);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setStage('absorb');
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
    if (stage === 'absorb') {
      const t = window.setTimeout(() => {
        setStage('done');
        onComplete();
      }, 160);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [stage, reducedMotion, onComplete]);

  if (!mounted || typeof document === 'undefined') return null;

  const cardScale =
    stage === 'compress' ? 0.15 : stage === 'orb' || stage === 'fly' || stage === 'absorb' ? 0 : 1;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {/* Compressing card clone */}
      {(stage === 'compress' || stage === 'orb') && (
        <motion.div
          className="absolute max-w-sm rounded-2xl border border-[hsl(32_40%_80%)] bg-[hsl(40_45%_97%)] p-5 shadow-lg"
          style={{
            left: source.x,
            top: source.y,
            width: 280,
            marginLeft: -140,
            marginTop: -80,
          }}
          initial={{ scale: 1, borderRadius: 16, opacity: 1 }}
          animate={{
            scale: cardScale,
            borderRadius: stage === 'compress' ? 40 : 999,
            opacity: stage === 'orb' ? 0 : 1,
            boxShadow:
              stage === 'compress'
                ? '0 0 40px hsl(40 80% 70% / 0.45)'
                : '0 0 20px hsl(40 80% 70% / 0.2)',
          }}
          transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-sm text-zen-fg line-clamp-1">
            {preview.title || 'Gratitude'}
          </p>
          <p className="mt-1 line-clamp-3 font-ui text-xs text-zen-fg-muted">{preview.content}</p>
        </motion.div>
      )}

      {(stage === 'orb' || stage === 'fly' || stage === 'absorb') && (
        <div
          className="absolute"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {stage === 'orb' ? <GratitudeParticles seed={17} /> : null}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: stage === 'absorb' ? 0.2 : 1,
              opacity: stage === 'absorb' ? 0 : 1,
            }}
            transition={{ duration: stage === 'absorb' ? 0.14 : 0.12 }}
          >
            <GratitudeOrb size={stage === 'absorb' ? 18 : 28} pulse={stage !== 'absorb'} />
          </motion.div>
        </div>
      )}
    </div>,
    document.body,
  );
}
