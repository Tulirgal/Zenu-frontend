'use client';

import { motion } from 'framer-motion';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function BurstComposer({
  value,
  onChange,
  onRelease,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  onRelease: () => void;
  disabled?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const canRelease = Boolean(value.trim()) && !disabled;

  return (
    <motion.div
      className="mx-auto w-full max-w-xl"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { type: 'spring', bounce: 0, duration: 0.4 }
      }
    >
      <div
        className={cn(
          'rounded-[22px] p-3.5 md:p-4',
          'border border-violet-300/25',
          'bg-[hsl(268_42%_14%/0.78)]',
          'shadow-[0_18px_48px_-22px_rgba(40,10,80,0.75),inset_0_1px_0_rgba(255,255,255,0.08)]',
          'backdrop-blur-xl',
          'focus-within:border-violet-300/45 focus-within:ring-2 focus-within:ring-violet-400/30',
        )}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's weighing on you? Pour it out…"
          rows={4}
          maxLength={300}
          disabled={disabled}
          aria-label="Thought to release"
          className={cn(
            'w-full resize-none rounded-xl bg-transparent px-2 py-2',
            'font-ui text-[1rem] leading-relaxed text-white',
            'placeholder:text-violet-100/75',
            'caret-violet-200 outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-[1.0625rem]',
            // Prevent browser autofill / UA white surfaces
            '[color-scheme:dark]',
          )}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 px-1">
          <span className="font-ui text-xs font-medium text-violet-100/85">
            {value.length}/300
          </span>
          <ZenButton
            type="button"
            variant="primary"
            size="md"
            onClick={onRelease}
            disabled={!canRelease}
            className={cn(
              'rounded-full px-5 shadow-[0_8px_24px_-10px_rgba(96,165,250,0.65)]',
              canRelease && 'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(96,165,250,0.75)]',
            )}
          >
            Release it
          </ZenButton>
        </div>
      </div>
    </motion.div>
  );
}
