'use client';

import type { JournalEntry } from '@/lib/types';
import { ZenBadge, ZenButton, ZenSkeleton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { formatJournalDate, getExcerpt } from '../journalUtils';

export function JournalContents({
  entries,
  loading,
  selectedId,
  onSelect,
  onWrite,
  className,
}: {
  entries: JournalEntry[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect: (entry: JournalEntry) => void;
  onWrite: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="shrink-0">
        <p className="font-ui text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zen-fg-subtle">
          Contents
        </p>
        <h2 className="mt-1 font-display text-xl tracking-[-0.01em] text-zen-fg md:text-2xl">
          Your pages
        </h2>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        {loading ? (
          <div className="space-y-2">
            <ZenSkeleton className="h-16 w-full" rounded="md" />
            <ZenSkeleton className="h-16 w-full" rounded="md" />
            <ZenSkeleton className="h-16 w-full" rounded="md" />
          </div>
        ) : entries.length === 0 ? (
          <p className="font-ui text-sm leading-relaxed text-zen-fg-muted">
            Nothing written yet. The right page is waiting for your first reflection.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {entries.map((entry) => {
              const active = entry.id === selectedId;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(entry)}
                    className={cn(
                      'w-full rounded-md px-3 py-2.5 text-left transition-colors',
                      'min-h-11',
                      'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                      active
                        ? 'bg-[hsl(32_40%_90%/0.7)]'
                        : 'hover:bg-[hsl(40_30%_92%/0.8)]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display text-[0.975rem] leading-snug text-zen-fg">
                        {entry.title?.trim() || 'Untitled'}
                      </span>
                      {entry.mood ? (
                        <ZenBadge variant="soft" size="sm" className="shrink-0">
                          {entry.mood}
                        </ZenBadge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-1 font-ui text-xs text-zen-fg-muted">
                      {getExcerpt(entry.content, 72)}
                    </p>
                    <p className="mt-1 font-ui text-[0.65rem] text-zen-fg-subtle">
                      {formatJournalDate(entry.createdAt)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 shrink-0 border-t border-[hsl(32_20%_85%)] pt-3">
        <ZenButton
          type="button"
          variant="ghost"
          className="min-h-11 w-full justify-start px-2"
          onClick={onWrite}
        >
          + Write a new reflection
        </ZenButton>
      </div>
    </div>
  );
}
