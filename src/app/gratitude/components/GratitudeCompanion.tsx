'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Panda } from '@/components/panda/Panda';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type GratitudeWhisper = 'saved' | 'found' | 'empty' | null;

const LINES: Record<Exclude<GratitudeWhisper, null>, string> = {
  saved: "That's worth keeping.",
  found: 'You found one.',
  empty: 'The jar is waiting.',
};

/**
 * Sparse whispers only — one intentional Panda when moments already exist
 * (empty state hosts its own Panda).
 */
export function GratitudeCompanion({
  whisper,
  visible,
  className,
}: {
  whisper: GratitudeWhisper;
  visible: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible || !whisper) {
      setShow(false);
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, [visible, whisper]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'pointer-events-none flex flex-col items-center gap-2',
        className,
      )}
      aria-live="polite"
    >
      <Panda
        emotion="happy"
        activity={null}
        animation="idle"
        mode="responsive"
        size={64}
        label="Panda companion"
      />
      <AnimatePresence>
        {show && whisper ? (
          <motion.p
            key={whisper}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
            className="font-ui text-sm text-[hsl(28_45%_42%)]"
          >
            {LINES[whisper]}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
