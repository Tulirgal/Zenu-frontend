'use client';

import { Panda } from '@/components/panda/Panda';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';

export function EmptyJournal({
  onWrite,
  className,
}: {
  onWrite: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col items-center rounded-zen-2xl border border-dashed border-zen-border bg-white/60 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="pointer-events-none">
        <Panda
          emotion="calm"
          activity={null}
          animation="attentive"
          mode="responsive"
          size={72}
          label="Panda companion"
        />
      </div>
      <p className="mt-3 font-ui text-sm text-zen-secondary" aria-live="polite">
        No need to make it perfect.
      </p>
      <h2 className="mt-4 font-display text-xl text-zen-fg md:text-2xl">Nothing here yet.</h2>
      <p className="mt-2 max-w-sm font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted">
        You don&apos;t need the perfect words. Start with whatever is on your mind.
      </p>
      <ZenButton type="button" size="lg" className="mt-6 min-h-12" onClick={onWrite}>
        Write your first reflection
        <span aria-hidden="true">→</span>
      </ZenButton>
    </section>
  );
}
