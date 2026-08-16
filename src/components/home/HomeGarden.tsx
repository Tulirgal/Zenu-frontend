'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Quiet Healing Garden summary — real tasks API, no gamification.
 */
export function HomeGarden({ className }: { className?: string }) {
  const [trees, setTrees] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API}/api/healing-garden/tasks`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const tasks = (data.tasks || []) as { completed: boolean }[];
        setTrees(tasks.filter((t) => t.completed).length);
      })
      .catch(() => {
        setTrees(0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={cn('zen-home-section', className)} aria-labelledby="home-garden-heading">
      <div className="flex items-start gap-2.5 mb-2 md:gap-3 md:mb-3">
        <div
          className="mt-0.5 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-zen-lg bg-zen-success-soft text-zen-success shrink-0"
          aria-hidden="true"
        >
          <Sprout className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </div>
        <div className="min-w-0">
          <h2
            id="home-garden-heading"
            className="font-ui text-[0.875rem] font-semibold text-zen-fg md:text-[1.125rem]"
          >
            Healing Garden
          </h2>
          {loading ? (
            <p className="text-[0.8125rem] text-zen-fg-muted mt-1">Looking at your garden…</p>
          ) : trees > 0 ? (
            <p className="text-[0.8125rem] text-zen-fg-muted mt-1 leading-snug">
              {trees} tree{trees === 1 ? '' : 's'} grown. Keep nurturing your calm.
            </p>
          ) : (
            <p className="text-[0.8125rem] text-zen-fg-muted mt-1 leading-snug">
              You haven&apos;t grown anything here yet. A quiet place waits when you&apos;re ready.
            </p>
          )}
        </div>
      </div>
      <Link
        href="/healing-garden"
        className="inline-flex text-[0.75rem] md:zen-body-sm text-zen-success hover:text-zen-fg transition-colors focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2 rounded-sm"
      >
        Visit garden →
      </Link>
    </section>
  );
}
