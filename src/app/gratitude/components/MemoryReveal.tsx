'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import type { GratitudeEntry } from '@/lib/types';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { formatGratitudeDate } from './gratitudeUtils';

export function MemoryReveal({
  entry,
  whisper,
  onClose,
  onDelete,
  className,
}: {
  entry: GratitudeEntry | null;
  whisper?: string | null;
  onClose: () => void;
  onDelete?: () => void;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {entry ? (
        <motion.article
          key={entry.id}
          role="dialog"
          aria-modal="false"
          aria-labelledby="memory-reveal-title"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={
            reducedMotion
              ? { duration: 0.15 }
              : { type: 'spring', stiffness: 280, damping: 28 }
          }
          className={cn(
            'relative mx-auto w-full max-w-md overflow-hidden rounded-zen-xl',
            'border border-[hsl(32_40%_80%/0.6)] bg-[hsl(40_45%_97%)]',
            'px-5 py-5 shadow-[0_20px_48px_-28px_rgba(80,50,20,0.35)]',
            className,
          )}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40"
            style={{
              background: 'radial-gradient(circle, hsl(32 70% 70% / 0.35), transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[hsl(28_55%_42%)]">
                A memory from your jar
              </p>
              <h2
                id="memory-reveal-title"
                className="mt-1 font-display text-xl tracking-[-0.01em] text-zen-fg md:text-[1.375rem]"
              >
                {entry.title?.trim() || 'Untitled moment'}
              </h2>
              {entry.createdAt ? (
                <p className="mt-1 font-ui text-xs text-zen-fg-subtle">
                  {formatGratitudeDate(entry.createdAt)}
                </p>
              ) : null}
            </div>
            <ZenButton
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 shrink-0"
              onClick={onClose}
              aria-label="Close memory"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </ZenButton>
          </div>

          <p className="relative mt-4 whitespace-pre-wrap font-display text-[1.0625rem] leading-relaxed text-zen-fg">
            {entry.content}
          </p>

          {whisper?.trim() ? (
            <p className="relative mt-4 border-t border-[hsl(32_30%_85%)] pt-3 font-ui text-sm leading-relaxed text-zen-fg-muted">
              {whisper.trim()}
            </p>
          ) : null}

          <div className="relative mt-5 flex flex-wrap gap-2">
            <ZenButton type="button" variant="outline" onClick={onClose}>
              Put it back
            </ZenButton>
            {onDelete ? (
              <ZenButton type="button" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </ZenButton>
            ) : null}
          </div>
        </motion.article>
      ) : null}
    </AnimatePresence>
  );
}
