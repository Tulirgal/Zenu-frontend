'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panda } from '@/components/panda/Panda';
import { ZenButton } from '@/components/zen';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { PrimaryEmotion, TertiaryData } from './emotionData';
import {
  CTA_FOCUS,
  CTA_HOVER,
  PRIMARY_LABEL,
  primaryCssVar,
  primarySoftCssVar,
  primaryText,
} from './emotionTokens';
import { mapPrimaryToPanda } from './pandaMap';
import { resolveModuleHref } from './resolveModuleHref';
import { CompassWhisper } from './CompassWhisper';

const FALLBACK: TertiaryData = {
  affirmation:
    'You noticed it — that is enough. Every emotion has something to say, and you listened.',
  tip: 'Take a moment to sit with whatever you are feeling.',
  modules: [
    { name: 'Talk to Seviyan', route: '/chat', emoji: '💬' },
    { name: 'Zen Breath Zone', route: '/breathing', emoji: '🌬️' },
  ],
};

export function CompassResult({
  primary,
  secondary,
  tertiary,
  data,
  whisper,
  onReset,
  onBack,
  className,
}: {
  primary: PrimaryEmotion;
  secondary: string;
  tertiary: string;
  data?: TertiaryData;
  whisper?: string | null;
  onReset: () => void;
  onBack: () => void;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const content = data ?? FALLBACK;
  const panda = mapPrimaryToPanda(primary);

  return (
    <div className={cn('w-full max-w-2xl mx-auto pb-2', className)}>
      <button
        type="button"
        onClick={onBack}
        className={cn(
          'font-ui text-sm text-zen-fg-muted hover:text-zen-fg mb-5 min-h-11 inline-flex items-center rounded-sm',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          CTA_FOCUS[primary],
        )}
      >
        ← back
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div
            className="pointer-events-none absolute inset-0 -m-8 rounded-full opacity-80 blur-3xl transition-[background] duration-300"
            style={{ background: primarySoftCssVar(primary) }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-4 rounded-full blur-2xl opacity-50"
            style={{ background: primaryCssVar(primary) }}
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={tertiary}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.28 }}
              className="relative"
            >
              <Panda
                emotion={panda.emotion}
                activity={null}
                animation={panda.animation}
                mode="responsive"
                size={128}
                label="Supportive panda companion"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <CompassWhisper message={whisper ?? null} accent={primary} className="mb-4" />

        <p
          className={cn(
            'font-ui text-[0.8125rem] mb-2 capitalize font-medium',
            primaryText(primary),
          )}
        >
          {PRIMARY_LABEL[primary]} → {secondary} → {tertiary}
        </p>
        <div
          className="h-0.5 w-10 rounded-full mb-4 opacity-70"
          style={{ backgroundColor: primaryCssVar(primary) }}
          aria-hidden="true"
        />

        <h2 className="font-display text-[1.55rem] sm:text-[1.75rem] md:text-[2rem] leading-[1.2] tracking-tight text-zen-fg font-semibold max-w-lg">
          It&apos;s okay to feel{' '}
          <span className={cn('capitalize', primaryText(primary))}>{tertiary}</span>.
        </h2>

        <p className="font-ui text-[0.875rem] md:text-[1.0625rem] text-zen-fg-muted mt-3.5 max-w-lg leading-relaxed">
          You&apos;re not alone, and this feeling will pass. Let&apos;s find what helps you right
          now.
        </p>

        <div className="mt-6 w-full rounded-zen-2xl border border-zen-border-soft/55 bg-zen-surface px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 text-left shadow-[0_8px_28px_-18px_rgba(30,41,90,0.1)]">
          <p className="font-ui text-[0.875rem] sm:text-[0.9375rem] md:text-base text-zen-fg leading-relaxed">
            {content.affirmation}
          </p>
          <p className="font-ui text-sm text-zen-fg-muted mt-3.5 italic leading-relaxed">
            {content.tip}
          </p>
        </div>

        <div className="mt-7 w-full text-left">
          <p className={cn('zen-eyebrow mb-3', primaryText(primary))}>
            What might help right now
          </p>
          <div className="flex flex-col gap-2.5">
            {content.modules.map((mod) => {
              const href = resolveModuleHref(mod.route);
              return (
                <Link
                  key={`${mod.name}-${href}`}
                  href={href}
                  className={cn(
                    'group flex items-center gap-3 rounded-zen-xl px-4 py-3.5 min-h-12',
                    'bg-zen-surface border border-zen-border-soft/70',
                    'transition-all duration-200 ease-out',
                    'focus-visible:outline-2 focus-visible:outline-offset-2',
                    'active:scale-[0.98] motion-reduce:active:scale-100',
                    CTA_HOVER[primary],
                    CTA_FOCUS[primary],
                  )}
                >
                  <span className="flex-1 font-ui text-[0.9375rem] md:text-base font-semibold text-zen-fg">
                    {mod.name}
                  </span>
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 text-zen-fg-muted group-hover:translate-x-0.5 transition-all duration-200',
                      primaryText(primary),
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <ZenButton variant="ghost" className="mt-7 mb-1" onClick={onReset}>
          Check in again
        </ZenButton>
      </div>
    </div>
  );
}
