'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { BubblesEvent } from './BubblesField';

type Cheer =
  | 'nice'
  | 'yay'
  | 'keep'
  | 'whoa'
  | 'roll'
  | 'fun'
  | 'still'
  | 'approves'
  | null;

const CHEERS: Record<Exclude<Cheer, null>, string> = {
  nice: 'Nice!',
  yay: 'Yay!',
  keep: 'Keep going!',
  whoa: 'Whoa!',
  roll: "You're on a roll!",
  fun: 'That was fun!',
  still: 'Still popping?',
  approves: 'Panda approves.',
};

/**
 * Cheer-only Bubbles companion — never scores, never coaches.
 */
export function BubblesCompanion({
  eventPulse,
  lastEvent,
  className,
}: {
  eventPulse: number;
  lastEvent: BubblesEvent | null;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [cheer, setCheer] = useState<Cheer>(null);
  const [visible, setVisible] = useState(false);
  const pops = useRef(0);
  const spawns = useRef(0);
  const total = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!lastEvent || eventPulse === 0) return;

    const flash = (c: Cheer, ms = 2000) => {
      if (!c) return;
      setCheer(c);
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setCheer(null);
        setVisible(false);
      }, ms);
    };

    total.current += 1;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (total.current > 0) flash('still', 1800);
    }, 14000);

    if (lastEvent.type === 'spawn') {
      spawns.current += lastEvent.count;
      if (!shown.current.has('nice') && spawns.current >= 1) {
        shown.current.add('nice');
        flash('nice');
      }
      return;
    }

    if (lastEvent.type === 'pop' || lastEvent.type === 'popAll') {
      pops.current += lastEvent.count;
      if (lastEvent.type === 'popAll' || lastEvent.count >= 6) {
        flash('whoa');
        return;
      }
      if (pops.current === 1) {
        flash('nice');
        return;
      }
      if (pops.current === 3) {
        flash('yay');
        return;
      }
      if (pops.current === 6) {
        flash('keep');
        return;
      }
      if (pops.current === 12) {
        flash('roll');
        return;
      }
      if (pops.current === 20) {
        flash('fun');
        return;
      }
      if (pops.current >= 30 && !shown.current.has('approves')) {
        shown.current.add('approves');
        flash('approves');
      }
    }
  }, [eventPulse, lastEvent]);

  useEffect(
    () => () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  const message = cheer ? CHEERS[cheer] : null;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-20 flex flex-col items-center',
        'right-2 top-20 md:right-4 md:bottom-16 md:top-auto',
        className,
      )}
      aria-hidden={message ? undefined : true}
    >
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="panda"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div
                className="absolute inset-0 -m-3 rounded-full opacity-50 blur-2xl"
                style={{ background: 'hsl(262 48% 58% / 0.35)' }}
              />
              <Panda
                emotion="happy"
                activity={null}
                animation="attentive"
                mode="responsive"
                size={64}
                label="Panda companion"
              />
            </div>
            <div className="mt-1 min-h-[1.25rem]" aria-live="polite">
              {message ? (
                <p className="max-w-[7rem] text-center font-ui text-[0.6875rem] text-white/90 drop-shadow">
                  {message}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
