'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { GratitudeOrb } from './GratitudeOrb';
import type { Point } from './geometry';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Stage = 'rise' | 'expand' | 'done';

/**
 * Retrieve ritual: orb emerges from jar mouth, rises, expands → hand off to MemoryReveal.
 */
export function RetrieveRitual({
  mouth,
  onReadyToReveal,
  onComplete,
}: {
  mouth: Point;
  /** Called when orb has expanded — parent should show MemoryReveal. */
  onReadyToReveal: () => void;
  onComplete: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<Stage>(reducedMotion ? 'done' : 'rise');
  const [mounted, setMounted] = useState(false);
  const riseY = mouth.y - 40;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reducedMotion) {
      onReadyToReveal();
      const t = window.setTimeout(onComplete, 80);
      return () => window.clearTimeout(t);
    }

    if (stage === 'rise') {
      const t = window.setTimeout(() => setStage('expand'), 180);
      return () => window.clearTimeout(t);
    }
    if (stage === 'expand') {
      const reveal = window.setTimeout(() => onReadyToReveal(), 80);
      const done = window.setTimeout(() => {
        setStage('done');
        onComplete();
      }, 180);
      return () => {
        window.clearTimeout(reveal);
        window.clearTimeout(done);
      };
    }
    return undefined;
  }, [stage, reducedMotion, onReadyToReveal, onComplete]);

  if (!mounted || typeof document === 'undefined' || stage === 'done') return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <motion.div
        className="absolute"
        initial={{ left: mouth.x, top: mouth.y, scale: 0.5, opacity: 0.6 }}
        animate={
          stage === 'rise'
            ? { left: mouth.x, top: riseY, scale: 1, opacity: 1 }
            : { left: mouth.x, top: riseY, scale: 2.4, opacity: 0 }
        }
        transition={{
          duration: stage === 'rise' ? 0.18 : 0.16,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <GratitudeOrb size={26} pulse={stage === 'rise'} />
      </motion.div>
    </div>,
    document.body,
  );
}
