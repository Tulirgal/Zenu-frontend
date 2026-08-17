'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { JournalCover } from './JournalCover';

const OPEN_MAX = 920;
const CLOSED_MAX = 300;

/**
 * Physical book hierarchy:
 *   BackCover (closed depth only)
 *   PageStack (interior left = Contents, right = page — always inside the shell)
 *   FrontCover (visible when closed / opening / closing; hidden when settled open
 *               so it never sits on top of the left interior page)
 */
export function JournalSpread({
  lidOpen,
  pagesVisible,
  expanded,
  coverOpaque,
  hovering,
  onHoverChange,
  onOpen,
  left,
  right,
  lite,
  className,
}: {
  lidOpen: boolean;
  pagesVisible: boolean;
  expanded: boolean;
  /** False when settled open — cover must not obscure left Contents. */
  coverOpaque: boolean;
  hovering: boolean;
  onHoverChange: (v: boolean) => void;
  onOpen: () => void;
  left: ReactNode;
  right: ReactNode;
  lite?: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const closed = !expanded;
  const openMax = lite ? 512 : OPEN_MAX;

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <motion.div
        className={cn('relative', closed && 'overflow-hidden')}
        initial={false}
        animate={{
          maxWidth: closed ? CLOSED_MAX : openMax,
          width: '100%',
        }}
        transition={{
          duration: reducedMotion ? 0.2 : 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          perspective: reducedMotion ? undefined : 1800,
        }}
      >
        {closed ? (
          <div
            className="pointer-events-none absolute inset-y-3 -right-1.5 z-30 w-2.5 rounded-r-sm bg-[hsl(40_30%_88%)]"
            aria-hidden="true"
            style={{ boxShadow: '2px 0 0 hsl(40 25% 82%), 4px 0 0 hsl(40 22% 78%)' }}
          />
        ) : null}

        <div className="relative w-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Book shell — always frames both interior pages when open */}
          <div
            className={cn(
              'relative z-10 overflow-hidden rounded-sm',
              'border border-[hsl(32_25%_78%/0.7)]',
              'bg-[hsl(40_35%_96%)]',
              'shadow-[0_24px_60px_-28px_rgba(40,28,16,0.35)]',
              closed && 'border-transparent bg-transparent shadow-none',
            )}
          >
            {/* BACK COVER — closed depth only */}
            {closed ? (
              <div
                className="pointer-events-none absolute inset-0 z-0 rounded-md"
                style={{
                  background:
                    'linear-gradient(145deg,hsl(28 30% 30%),hsl(28 26% 22%) 55%,hsl(24 28% 16%))',
                  boxShadow: 'inset 0 0 0 1px hsl(28 28% 42% / 0.35)',
                }}
                aria-hidden="true"
              />
            ) : null}

            {/* PAGE STACK — left Contents + right page, inside the shell */}
            <motion.div
              className={cn(
                'relative z-[1] grid',
                lite ? 'grid-cols-1' : 'grid-cols-2',
                closed && 'invisible absolute inset-0',
              )}
              initial={false}
              animate={{
                opacity: pagesVisible ? 1 : 0,
              }}
              transition={{
                duration: reducedMotion ? 0.2 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                pointerEvents: pagesVisible ? 'auto' : 'none',
              }}
              aria-hidden={!pagesVisible}
            >
              {!lite ? (
                <div
                  className={cn(
                    'relative min-h-[min(58vh,420px)] p-5 sm:p-6 md:min-h-[480px] md:p-7',
                    'border-r border-[hsl(32_20%_82%)]',
                    'bg-[linear-gradient(180deg,hsl(40_40%_98%),hsl(38_30%_95%))]',
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[hsl(28_20%_40%/0.08)] to-transparent"
                    aria-hidden="true"
                  />
                  {/* Spine gutter cue */}
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[hsl(28_20%_55%/0.25)]"
                    aria-hidden="true"
                  />
                  {left}
                </div>
              ) : null}

              <div
                className={cn(
                  'relative min-h-[min(58vh,420px)] p-5 sm:p-6',
                  !lite && 'md:min-h-[480px] md:p-7',
                  lite && 'min-h-[min(62vh,460px)]',
                  'bg-[linear-gradient(180deg,hsl(40_42%_99%),hsl(38_32%_96%))]',
                )}
              >
                {!lite ? (
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[hsl(28_20%_40%/0.07)] to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                {lite ? (
                  <>
                    <div className="mb-6 border-b border-[hsl(32_20%_85%)] pb-5">{left}</div>
                    {right}
                  </>
                ) : (
                  right
                )}
              </div>
            </motion.div>

            {closed ? (
              <div className="relative z-[1] aspect-[3/4] w-full" aria-hidden="true" />
            ) : null}
          </div>

          {/* FRONT COVER — above shell while closed/animating; faded out when settled open */}
          {reducedMotion ? (
            <motion.div
              className={cn(
                'absolute inset-y-0 z-20',
                closed || lite ? 'inset-x-0' : 'left-1/2 right-0',
              )}
              initial={false}
              animate={{ opacity: coverOpaque ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: closed ? 'auto' : 'none' }}
            >
              <JournalCover
                open={false}
                hovering={hovering}
                interactive={closed}
                onHoverChange={onHoverChange}
                onOpen={onOpen}
                span="full"
                opaque
              />
            </motion.div>
          ) : (
            <JournalCover
              open={lidOpen}
              hovering={hovering}
              interactive={closed}
              onHoverChange={onHoverChange}
              onOpen={onOpen}
              span={closed || lite ? 'full' : 'half'}
              opaque={coverOpaque}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
