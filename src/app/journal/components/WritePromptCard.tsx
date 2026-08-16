'use client';

import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';

export function WritePromptCard({
  onWrite,
  className,
}: {
  onWrite: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-zen-2xl border border-zen-border-soft bg-white/85 p-6 md:p-8',
        'shadow-[0_12px_40px_-28px_rgba(40,30,60,0.28)]',
        className,
      )}
    >
      <h2 className="font-display text-[1.5rem] tracking-[-0.01em] text-zen-fg md:text-[1.75rem]">
        What&apos;s on your mind?
      </h2>
      <p className="mt-2 max-w-xl font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted">
        Start with a thought, a feeling, or just a few words.
      </p>
      <ZenButton type="button" size="lg" className="mt-6 min-h-12" onClick={onWrite}>
        Write a reflection
        <span aria-hidden="true">→</span>
      </ZenButton>
    </section>
  );
}
