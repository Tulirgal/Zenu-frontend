'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { PrimaryEmotion } from './emotionData';
import { primaryText } from './emotionTokens';

/**
 * Quiet companion line — not a chat bubble.
 * One short message at a time; fades naturally.
 */
export function CompassWhisper({
  message,
  accent,
  className,
}: {
  message: string | null;
  accent?: PrimaryEmotion | null;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn('min-h-[1.5rem] flex items-center justify-center', className)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {message ? (
          <motion.p
            key={message}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: 'easeOut' }}
            className={cn(
              'font-ui text-[0.8125rem] md:text-sm text-center leading-snug max-w-xs',
              accent ? primaryText(accent) : 'text-zen-fg-muted',
            )}
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
