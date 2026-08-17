'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Canonical ZenU module Back control (source: Meditation focus pill).
 * Visual: ← ZenU | Section
 *
 * Use `floating` only when the global shell is hidden (ZenFocusMode).
 * Default is in-flow for normal module pages with sidebar / bottom nav.
 */
export function ZenBackLink({
  href = '/',
  section,
  label,
  floating = false,
  className,
}: {
  href?: string;
  /** Current module label shown after the divider (preferred). */
  section?: string;
  /** @deprecated Prefer `section`. Falls back when section is omitted. */
  label?: string;
  /** Fixed floating pill — for focus-mode shells only. */
  floating?: boolean;
  className?: string;
}) {
  const sectionLabel = section ?? label ?? 'Back';
  const aria =
    sectionLabel === 'Back' ? 'Back to ZenU home' : `Back to ZenU from ${sectionLabel}`;

  const pill = (
    <Link
      href={href}
      aria-label={aria}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-zen-full px-3 py-2',
        'glass-floating shadow-zen-floating',
        'text-sm font-medium text-zen-fg',
        'transition-colors duration-100 hover:bg-white/95',
        'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
        'active:scale-[0.97]',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0 text-zen-fg-muted" strokeWidth={2} aria-hidden="true" />
      <span className="hidden text-zen-fg-muted sm:inline">ZenU</span>
      <span className="hidden h-3 w-px bg-zen-border sm:block" aria-hidden="true" />
      <span className="text-zen-fg">{sectionLabel}</span>
    </Link>
  );

  if (floating) {
    return <div className="fixed left-4 top-4 z-50">{pill}</div>;
  }

  return pill;
}
