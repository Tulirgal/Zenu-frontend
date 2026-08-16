'use client';

import type { GratitudeEntry } from '@/lib/types';
import { ZenSkeleton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { formatGratitudeDate, getExcerpt } from './gratitudeUtils';
import { EmptyGratitude } from './EmptyGratitude';

function MomentCard({
  entry,
  onOpen,
}: {
  entry: GratitudeEntry;
  onOpen: (entry: GratitudeEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className={cn(
        'group w-full rounded-zen-xl border border-[hsl(32_25%_88%)] bg-white/90 p-5 text-left',
        'shadow-[0_8px_28px_-24px_rgba(80,50,20,0.28)]',
        'transition-[border-color,box-shadow] duration-200',
        'hover:border-[hsl(32_40%_72%)] hover:shadow-[0_14px_36px_-26px_rgba(80,50,20,0.35)]',
        'active:scale-[0.985]',
        'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
      )}
    >
      <h3 className="min-w-0 font-display text-[1.125rem] leading-snug tracking-[-0.01em] text-zen-fg md:text-[1.25rem]">
        {entry.title?.trim() || 'Untitled moment'}
      </h3>
      <p className="mt-2 line-clamp-2 font-ui text-sm leading-relaxed text-zen-fg-muted">
        {getExcerpt(entry.content)}
      </p>
      <p className="mt-3 font-ui text-xs text-zen-fg-subtle">{formatGratitudeDate(entry.createdAt)}</p>
    </button>
  );
}

export function RecentMoments({
  entries,
  loading,
  onOpen,
  onAdd,
  onReview,
  reviewing,
  className,
}: {
  entries: GratitudeEntry[];
  loading?: boolean;
  onOpen: (entry: GratitudeEntry) => void;
  onAdd: () => void;
  onReview?: () => void;
  reviewing?: boolean;
  className?: string;
}) {
  return (
    <section className={cn('min-w-0', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-[1.375rem] tracking-[-0.01em] text-zen-fg md:text-[1.625rem]">
          Recent moments
        </h2>
        {onReview && entries.length > 0 ? (
          <button
            type="button"
            onClick={onReview}
            disabled={reviewing}
            className={cn(
              'font-ui text-sm text-zen-fg-muted underline-offset-4',
              'hover:text-zen-fg hover:underline',
              'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
              'disabled:opacity-50',
              'min-h-11 px-1',
            )}
          >
            {reviewing ? 'Reviewing…' : 'Quiet jar review'}
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
          <ZenSkeleton className="h-28 w-full" rounded="xl" />
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-5">
          <EmptyGratitude onAdd={onAdd} />
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <MomentCard entry={entry} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
