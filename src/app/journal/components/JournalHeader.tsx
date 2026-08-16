'use client';

import { Panda } from '@/components/panda/Panda';
import { cn } from '@/lib/utils';

export function JournalHeader({ className }: { className?: string }) {
  return (
    <header className={cn('relative', className)}>
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="min-w-0 text-center md:text-left">
          <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-zen-secondary md:text-[0.75rem]">
            My Journal
          </p>
          <h1
            className={cn(
              'mt-2 font-display font-medium text-zen-fg',
              'text-[1.875rem] leading-[1.15] tracking-[-0.02em]',
              'sm:text-[2.5rem] md:text-[3rem]',
            )}
          >
            Your private space
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:mx-0 md:text-[1.0625rem]">
            Write things down. You don&apos;t have to make them perfect.
          </p>
        </div>

        <div className="relative mx-auto flex h-36 w-36 items-center justify-center md:mx-0 md:h-44 md:w-44">
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(262 48% 58% / 0.18) 0%, hsl(40 40% 92% / 0.5) 50%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none relative z-[1]">
            <Panda
              emotion="calm"
              activity="writing"
              animation="idle"
              mode="responsive"
              size={100}
              label="Panda companion"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
