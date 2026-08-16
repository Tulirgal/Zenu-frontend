'use client';

import type { JournalEntry } from '@/lib/types';
import { ZenBadge, ZenSkeleton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { formatJournalDate, getExcerpt } from './journalUtils';
import { EmptyJournal } from './EmptyJournal';

export function JournalEntryCard({
  entry,
  onOpen,
}: {
  entry: JournalEntry;
  onOpen: (entry: JournalEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className={cn(
        'group w-full rounded-zen-xl border border-zen-border-soft bg-white/90 p-5 text-left',
        'shadow-[0_8px_28px_-24px_rgba(40,30,60,0.3)]',
        'transition-[border-color,box-shadow] duration-200',
        'hover:border-zen-secondary/35 hover:shadow-[0_14px_36px_-26px_rgba(40,30,60,0.4)]',
        'active:scale-[0.985]',
        'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-[1.125rem] leading-snug tracking-[-0.01em] text-zen-fg md:text-[1.25rem]">
          {entry.title?.trim() || 'Untitled'}
        </h3>
        {entry.mood ? (
          <ZenBadge variant="soft" size="sm" className="shrink-0">
            {entry.mood}
          </ZenBadge>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 font-ui text-sm leading-relaxed text-zen-fg-muted">
        {getExcerpt(entry.content)}
      </p>
      <p className="mt-3 font-ui text-xs text-zen-fg-subtle">{formatJournalDate(entry.createdAt)}</p>
    </button>
  );
}

export function RecentReflections({
  entries,
  loading,
  onOpen,
  onWrite,
  className,
}: {
  entries: JournalEntry[];
  loading?: boolean;
  onOpen: (entry: JournalEntry) => void;
  onWrite: () => void;
  className?: string;
}) {
  return (
    <section className={cn('min-w-0', className)}>
      <h2 className="font-display text-[1.375rem] tracking-[-0.01em] text-zen-fg md:text-[1.625rem]">
        Recent reflections
      </h2>

      {loading ? (
        <div className="mt-5 space-y-3">
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-5">
          <EmptyJournal onWrite={onWrite} />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <JournalEntryCard entry={entry} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
