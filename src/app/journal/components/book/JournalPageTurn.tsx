'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { PageTurnDirection } from './bookTypes';

/**
 * Wraps right-page content with a directional page-turn.
 * Desktop: mild rotateY. Mobile / reduced-motion: slide + fade.
 */
export function JournalPageTurn({
  pageKey,
  direction,
  lite,
  children,
  className,
}: {
  pageKey: string;
  direction: PageTurnDirection;
  lite?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const forward = direction === 'forward';

  const enterX = forward ? 28 : -28;
  const exitX = forward ? -28 : 28;
  const enterRot = lite || reducedMotion ? 0 : forward ? -12 : 12;
  const exitRot = lite || reducedMotion ? 0 : forward ? 18 : -18;

  return (
    <div className={cn('relative h-full min-h-0', className)} style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          className="h-full min-h-0"
          initial={
            reducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 0.55,
                  x: enterX,
                  rotateY: enterRot,
                }
          }
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 0.4,
                  x: exitX,
                  rotateY: exitRot,
                }
          }
          transition={
            reducedMotion
              ? { duration: 0.16 }
              : { type: 'spring', stiffness: 220, damping: 26 }
          }
          style={{ transformOrigin: forward ? 'left center' : 'right center' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
