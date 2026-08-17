'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Hinged front cover — rotates around its LEFT edge (book spine).
 * Front + back faces with backface-visibility so text never reads mirrored.
 *
 * `span="full"` — closed book face (fills shell).
 * `span="half"` — open-book right leaf, hinged at center spine.
 */
export function JournalCover({
  open,
  hovering,
  interactive,
  onHoverChange,
  onOpen,
  span = 'half',
  opaque = true,
  className,
}: {
  open: boolean;
  hovering: boolean;
  interactive: boolean;
  onHoverChange: (v: boolean) => void;
  onOpen: () => void;
  span?: 'full' | 'half';
  /** When false (settled open), cover fades out so left page stays readable inside the book. */
  opaque?: boolean;
  className?: string;
}) {
  const lift = interactive && !open && hovering;

  return (
    <motion.div
      className={cn(
        'absolute inset-y-0 z-20',
        span === 'full' ? 'left-0 right-0' : 'left-1/2 right-0',
        (!interactive || !opaque) && 'pointer-events-none',
        className,
      )}
      style={{
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
      }}
      initial={false}
      animate={{
        rotateY: open ? -165 : lift ? -6 : 0,
        opacity: opaque ? 1 : 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden={!interactive}
    >
      <button
        type="button"
        aria-label="Open your journal"
        disabled={!interactive || open}
        onClick={() => {
          if (interactive && !open) onOpen();
        }}
        onMouseEnter={() => interactive && onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => interactive && onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        className={cn(
          'absolute inset-0 overflow-hidden text-left',
          span === 'full' ? 'rounded-md' : 'rounded-r-md rounded-l-sm',
          'border border-[hsl(28_28%_42%/0.35)]',
          'bg-[linear-gradient(145deg,hsl(28_32%_38%)_0%,hsl(28_28%_28%)_55%,hsl(24_30%_22%)_100%)]',
          'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
          (!interactive || open) && 'pointer-events-none',
        )}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          boxShadow: lift
            ? '0 24px 40px -18px rgba(40,28,16,0.45)'
            : '0 14px 28px -14px rgba(40,28,16,0.35)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, hsl(40 40% 70% / 0.35), transparent 40%), radial-gradient(circle at 80% 70%, hsl(20 30% 20% / 0.4), transparent 45%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 left-0 w-3 bg-[linear-gradient(90deg,hsl(24_35%_18%),hsl(28_30%_32%))]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-ui text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[hsl(40_40%_88%/0.75)]">
            My Journal
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-[-0.02em] text-[hsl(40_45%_96%)]">
            Private pages
          </h2>
          <p className="mt-3 max-w-[12rem] font-ui text-xs leading-relaxed text-[hsl(40_30%_80%/0.8)]">
            Tap to open
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-1/3 rounded-b-full opacity-30"
          style={{
            background: 'linear-gradient(180deg, hsl(40 50% 90% / 0.25), transparent)',
          }}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          'absolute inset-0',
          span === 'full' ? 'rounded-md' : 'rounded-l-md rounded-r-sm',
          'border border-[hsl(32_25%_78%/0.7)]',
          'bg-[linear-gradient(180deg,hsl(40_40%_97%),hsl(38_30%_93%))]',
        )}
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[hsl(28_20%_40%/0.1)] to-transparent"
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
