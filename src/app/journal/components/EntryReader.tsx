'use client';

import { useEffect } from 'react';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { JournalEntry } from '@/lib/types';
import { ZenBadge, ZenButton } from '@/components/zen';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { formatJournalDate } from './journalUtils';

/**
 * In-page focused reading panel — not a modal.
 */
export function EntryReader({
  entry,
  onBack,
  onEdit,
  onDelete,
  className,
}: {
  entry: JournalEntry;
  onBack: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={entry.id}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: 'easeOut' }}
        className={cn('mx-auto w-full max-w-[44rem]', className)}
      >
        <ZenButton
          type="button"
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-zen-fg-muted"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to reflections
        </ZenButton>

        <div
          className={cn(
            'rounded-zen-2xl border border-zen-border-soft bg-[hsl(40,40%,99%)] p-6 sm:p-8 md:p-10',
            'shadow-[0_12px_40px_-28px_rgba(40,30,60,0.28)]',
          )}
        >
          <p className="font-ui text-xs uppercase tracking-[0.1em] text-zen-fg-subtle">
            {formatJournalDate(entry.createdAt)}
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-zen-fg md:text-[2.125rem]">
            {entry.title?.trim() || 'Untitled'}
          </h1>
          {entry.mood ? (
            <ZenBadge variant="soft" size="sm" className="mt-3">
              {entry.mood}
            </ZenBadge>
          ) : null}

          <div className="my-6 h-px bg-zen-border-soft" aria-hidden="true" />

          <div className="whitespace-pre-wrap font-ui text-[1rem] leading-[1.75] text-zen-fg md:text-[1.0625rem]">
            {entry.content}
          </div>

          <div className="my-6 h-px bg-zen-border-soft" aria-hidden="true" />

          <div className="flex flex-wrap gap-2">
            <ZenButton type="button" variant="outline" onClick={() => onEdit(entry)}>
              <Edit3 className="h-4 w-4" aria-hidden="true" />
              Edit
            </ZenButton>
            <ZenButton type="button" variant="ghost" onClick={() => onDelete(entry)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </ZenButton>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
