'use client';

import Link from 'next/link';
import type { JournalEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ZenSkeleton } from '@/components/zen/ZenSkeleton';

function formatEntryDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function HomeReflections({
  entries,
  loading,
  className,
}: {
  entries: JournalEntry[];
  loading: boolean;
  className?: string;
}) {
  return (
    <section className={cn('zen-home-section', className)} aria-labelledby="home-reflections-heading">
      <div className="flex flex-col gap-1 mb-2.5 sm:mb-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h2
          id="home-reflections-heading"
          className="font-ui text-[0.8125rem] sm:text-[0.875rem] md:text-[1.125rem] font-semibold text-zen-fg"
        >
          Recent Reflections
        </h2>
        <Link
          href="/journal"
          className="text-[0.6875rem] sm:text-[0.75rem] text-zen-secondary hover:text-zen-fg transition-colors focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2 rounded-sm"
        >
          Open journal →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <ZenSkeleton className="h-8 w-full" />
          <ZenSkeleton className="h-8 w-full" />
        </div>
      ) : !entries.length ? (
        <p className="text-[0.8125rem] text-zen-fg-muted py-1">
          No reflections yet.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {entries.map((entry, i) => (
            <li key={entry.id} className="flex gap-2.5">
              <span
                className={cn(
                  'mt-1.5 h-1.5 w-1.5 rounded-full shrink-0',
                  i === 0 && 'bg-zen-emotion-calm',
                  i === 1 && 'bg-zen-emotion-okay',
                  i === 2 && 'bg-zen-emotion-joy',
                )}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[0.6875rem] text-zen-fg-subtle">
                  {formatEntryDate(entry.createdAt)}
                </p>
                <p className="text-[0.75rem] sm:text-[0.8125rem] text-zen-fg mt-0.5 line-clamp-1 sm:line-clamp-2 font-serif">
                  {entry.title?.trim() || entry.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
