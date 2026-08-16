'use client';

import { Panda } from '@/components/panda/Panda';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';

export function EmptyGratitude({
  onAdd,
  className,
}: {
  onAdd: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col items-center rounded-zen-2xl border border-dashed border-[hsl(32_30%_82%)] bg-white/50 px-6 py-12 text-center',
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
      <p className="mt-3 font-ui text-sm text-[hsl(28_45%_45%)]" aria-live="polite">
        The jar is waiting.
      </p>
      <h2 className="mt-4 font-display text-xl text-zen-fg md:text-2xl">Nothing kept yet.</h2>
      <p className="mt-2 max-w-sm font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted">
        Add one small moment you&apos;re grateful for. You can pick it again later.
      </p>
      <ZenButton type="button" size="lg" variant="accent" className="mt-6 min-h-12" onClick={onAdd}>
        Add a gratitude moment
      </ZenButton>
    </section>
  );
}
