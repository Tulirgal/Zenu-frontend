'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ZenBackLink } from '@/components/zen/ZenBackLink';

interface ZenFocusModeProps {
  /** Title shown in the floating back pill */
  title: string;
  /** Back destination — defaults to '/' */
  backHref?: string;
  /** Extra class on the outer wrapper */
  className?: string;
  children: React.ReactNode;
}

/**
 * Immersive shell for routes in ZEN_FOCUS_ROUTES (hides global nav).
 * Back pill reuses the shared ZenBackLink — do not invent a second design.
 */
export default function ZenFocusMode({
  title,
  backHref = '/',
  className,
  children,
}: ZenFocusModeProps) {
  return (
    <div
      className={cn('relative min-h-dvh w-full', className)}
      data-zen-focus-mode="true"
    >
      <ZenBackLink href={backHref} section={title} floating className="zen-fade" />
      {children}
    </div>
  );
}
