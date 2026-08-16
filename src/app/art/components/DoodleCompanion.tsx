'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Whisper = 'idle' | 'first' | 'rich' | 'saved' | null;

export function DoodleCompanion({
  strokeCount = 0,
  savedPulse = 0,
  className,
}: {
  strokeCount?: number;
  savedPulse?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [whisper, setWhisper] = useState<Whisper>('idle');
  const hasFirst = useRef(false);
  const hasRich = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (w: Whisper, ms = 2200) => {
    setWhisper(w);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setWhisper(null), ms);
  };

  useEffect(() => {
    if (strokeCount > 0 && !hasFirst.current) {
      hasFirst.current = true;
      show('first');
    } else if (strokeCount >= 6 && !hasRich.current) {
      hasRich.current = true;
      show('rich');
    }
  }, [strokeCount]);

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
      ? "Let's see what you create."
      : whisper === 'first'
        ? 'Keep going.'
        : whisper === 'rich'
          ? 'Look at that.'
          : whisper === 'saved'
            ? 'You made this.'
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
