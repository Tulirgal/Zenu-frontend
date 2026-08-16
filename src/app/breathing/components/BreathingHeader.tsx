'use client';

import { Panda } from '@/components/panda/Panda';
import { cn } from '@/lib/utils';

/**
 * Content header only — ZenU sidebar / mobile bottom nav provide app chrome.
 * No module-specific breadcrumb (keeps Breathing consistent with other modules).
 */
export function BreathingHeader({ className }: { className?: string }) {
  return (
    <header className={cn('relative', className)}>
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="min-w-0 text-center md:text-left">
          <h1
            className={cn(
              'font-display font-medium text-zen-fg',
              'text-[1.875rem] leading-[1.15] tracking-[-0.02em]',
              'sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem]',
            )}
          >
            Breathing
          </h1>
          <p className="mt-3 font-display text-[1.25rem] tracking-[-0.01em] text-zen-fg md:text-[1.5rem]">
            Find your rhythm.{' '}
            <span className="text-zen-secondary" aria-hidden="true">
              ♡
            </span>
          </p>
          <p className="mx-auto mt-3 max-w-xl font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:mx-0 md:text-[1.0625rem]">
            A few slow breaths can change the way this moment feels.
          </p>
        </div>

        <div className="relative mx-auto flex h-40 w-40 items-center justify-center md:mx-0 md:h-48 md:w-48">
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-80"
            style={{
              background:
                'radial-gradient(circle, hsl(262 48% 58% / 0.22) 0%, hsl(221 70% 52% / 0.08) 45%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-1 left-2 h-16 w-10 rounded-full bg-[hsl(150_35%_55%/0.18)] blur-md"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-2 right-3 h-14 w-8 rounded-full bg-[hsl(160_30%_50%/0.15)] blur-md"
            aria-hidden="true"
          />
          <div className="pointer-events-none relative z-[1]">
            <Panda
              emotion="calm"
              activity="breathing"
              animation="breathe"
              mode="responsive"
              size={112}
              label="Panda companion"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
