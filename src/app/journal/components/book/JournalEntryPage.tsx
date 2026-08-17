'use client';

import { ChevronLeft, ChevronRight, Edit3, Trash2, X } from 'lucide-react';
import type { JournalEntry } from '@/lib/types';
import { ZenBadge, ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { formatJournalDate } from '../journalUtils';

export function JournalEntryPage({
  entry,
  onEdit,
  onDelete,
  onBackToToc,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  className,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  onBackToToc: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  className?: string;
}) {
  return (
    <article className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="flex shrink-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-ui text-[0.65rem] uppercase tracking-[0.12em] text-zen-fg-subtle">
            {formatJournalDate(entry.createdAt)}
          </p>
          <h2 className="mt-1 font-display text-xl leading-tight tracking-[-0.015em] text-zen-fg md:text-2xl">
            {entry.title?.trim() || 'Untitled'}
          </h2>
          {entry.mood ? (
            <ZenBadge variant="soft" size="sm" className="mt-2">
              {entry.mood}
            </ZenBadge>
          ) : null}
        </div>
        <ZenButton
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-11 min-w-11 shrink-0"
          onClick={onBackToToc}
          aria-label="Back to contents"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </ZenButton>
      </div>

      <div
        className={cn(
          'mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain',
          'whitespace-pre-wrap font-ui text-[0.975rem] leading-[1.75] text-zen-fg',
          'bg-[repeating-linear-gradient(transparent,transparent_27px,hsl(28_20%_70%/0.18)_28px)]',
          'px-0.5',
        )}
      >
        {entry.content}
      </div>

      <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2 border-t border-[hsl(32_20%_85%)] pt-3">
        <ZenButton type="button" variant="outline" size="sm" className="min-h-11" onClick={onEdit}>
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit
        </ZenButton>
        <ZenButton type="button" variant="ghost" size="sm" className="min-h-11" onClick={onDelete}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </ZenButton>

        <div className="ml-auto flex gap-1">
          <ZenButton
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 min-w-11"
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Previous entry"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </ZenButton>
          <ZenButton
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 min-w-11"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next entry"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </ZenButton>
        </div>
      </div>
    </article>
  );
}
