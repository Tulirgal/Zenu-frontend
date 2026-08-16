'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useCanvasStore } from '../store/canvasStore';

type Whisper = 'idle' | 'first' | 'going' | 'saved' | null;

/**
 * One intentional Scribble companion — outside the canvas, never over artwork.
 */
export function ScribbleCompanion({
  savedPulse,
  className,
}: {
  savedPulse?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const elements = useCanvasStore((s) => s.elements);
  const [whisper, setWhisper] = useState<Whisper>('idle');
  const hasFirst = useRef(false);
  const hasGoing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (w: Whisper, ms = 2200) => {
    setWhisper(w);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setWhisper(null), ms);
  };

  useEffect(() => {
    if (elements.length === 0) return;
    if (!hasFirst.current) {
      hasFirst.current = true;
      show('first');
    } else if (elements.length >= 4 && !hasGoing.current) {
      hasGoing.current = true;
      show('going');
    }
  }, [elements.length]);

  useEffect(() => {
    if (!savedPulse) return;
    show('saved');
  }, [savedPulse]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const message =
    whisper === 'idle'
      ? 'Let it out.'
      : whisper === 'first'
        ? "That's enough to start."
        : whisper === 'going'
          ? 'Keep going.'
          : whisper === 'saved'
            ? 'You got it out.'
            : null;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-20 hidden md:flex flex-col items-center',
        'right-3 bottom-20 lg:right-6 lg:bottom-24',
        className,
      )}
      aria-hidden={message ? undefined : true}
    >
      <div className="relative">
        <div
          className="absolute inset-0 -m-4 rounded-full blur-2xl opacity-60"
          style={{ background: 'hsl(var(--zen-secondary-soft))' }}
        />
        <Panda
          emotion="happy"
          activity="drawing"
          animation="attentive"
          mode="responsive"
          size={68}
          label="Panda companion"
        />
      </div>
      <div className="min-h-[1.25rem] mt-1" aria-live="polite">
        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={message}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.25 }}
              className="font-ui text-[0.6875rem] text-zen-fg-muted text-center max-w-[7.5rem]"
            >
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
