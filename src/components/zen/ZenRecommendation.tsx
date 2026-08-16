'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { getRecommendations, type RecommendationTodayResponse } from '@/lib/signals';
import { setRecommendationLaunch } from '@/lib/recommendationAttribution';
import { cn } from '@/lib/utils';
import { ZenButton } from './ZenButton';
import { ZenSkeleton } from './ZenSkeleton';
import {
  mapRecommendationToPanda,
  MODULE_ROUTES,
} from '@/components/panda/mapRecommendation';
import { showPandaMessage } from '@/components/panda/controller';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { HomePandaPresentation } from '@/components/home/HomeGreeting';
import { RecommendationAtmosphere } from '@/components/home/RecommendationAtmosphere';

function contextualSentence(context: RecommendationTodayResponse['context'] | undefined): string {
  if (!context) return 'A small practice chosen for where you are right now.';
  const tone = context.dominant_tone?.replace(/_/g, ' ');
  const stress = context.stress_level?.replace(/_/g, ' ');
  if (tone && stress) {
    return `Noticing ${tone} energy and ${stress} stress — here's a gentle next step.`;
  }
  if (tone) return `Meeting you with a little ${tone} care.`;
  return 'A small practice chosen for where you are right now.';
}

export function ZenRecommendation({
  className,
  refreshKey = 0,
  onPresentationChange,
}: {
  className?: string;
  refreshKey?: number;
  onPresentationChange?: (presentation: HomePandaPresentation | null) => void;
}) {
  const [data, setData] = useState<RecommendationTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [whyOpen, setWhyOpen] = useState(false);
  const pathname = usePathname();
  const promptedForLog = useRef<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let mounted = true;
    if (refreshKey === 0) setLoading(true);
    getRecommendations().then((d) => {
      if (!mounted) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const selected = data?.recommendations?.[0] ?? null;
  const mapped = useMemo(
    () => (selected ? mapRecommendationToPanda(selected.module_id) : null),
    [selected],
  );

  useEffect(() => {
    if (!mapped) {
      onPresentationChange?.(null);
      return;
    }
    onPresentationChange?.({
      emotion: mapped.emotion,
      activity: mapped.activity,
      animation: mapped.animation,
    });
  }, [mapped, onPresentationChange]);

  useEffect(() => {
    if (!mapped || !selected || !data) return;
    const promptKey = `${data.log_id ?? 'none'}:${selected.module_id}:${refreshKey}`;
    if (promptedForLog.current === promptKey) return;
    promptedForLog.current = promptKey;

    showPandaMessage({
      message: mapped.defaultMessage,
      action: mapped.actionLabel,
      secondaryAction: 'Maybe later',
      href: mapped.href,
      recommendationKey: mapped.recommendationKey,
      recommendationLogId: data.log_id ?? null,
      emotion: mapped.emotion,
      activity: mapped.activity,
      animation: mapped.animation,
      currentPath: pathname ?? undefined,
      force: refreshKey > 0,
    });
  }, [mapped, selected, pathname, data, refreshKey]);

  if (loading && !data) {
    return (
      <div className={cn('relative overflow-hidden rounded-zen-xl p-5 md:p-8', className)}>
        <ZenSkeleton className="h-3 w-28 mb-3" />
        <ZenSkeleton className="h-8 w-52 mb-2" />
        <ZenSkeleton className="h-4 w-64 mb-5" />
        <ZenSkeleton className="h-11 w-28" />
      </div>
    );
  }

  if (!data || !selected || !mapped) return null;

  const route = MODULE_ROUTES[selected.module_id] || mapped.href || '/';
  const contextLine = contextualSentence(data.context);

  return (
    <section
      className={cn(
        'relative zen-home-section overflow-hidden rounded-zen-xl md:rounded-zen-2xl h-full',
        className,
      )}
      aria-labelledby="home-rec-heading"
    >
      <div
        className={cn(
          'relative z-10 h-full',
          'bg-zen-surface border border-zen-border-soft/55',
          'shadow-[0_8px_28px_-18px_rgba(30,41,90,0.14)]',
          'grid grid-cols-1 md:grid-cols-[1.35fr_0.85fr] md:items-center',
          'px-4 py-5 sm:px-6 lg:px-8 lg:py-8',
          'gap-3 md:gap-4',
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selected.module_id}-${refreshKey}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28 }}
            className="min-w-0 relative"
          >
            {/* Mobile atmosphere sits top-right of the hero, not empty glow */}
            <RecommendationAtmosphere
              compact
              moduleId={selected.module_id}
              className="pointer-events-none absolute -right-2 top-1 md:hidden"
            />

            <p className="zen-eyebrow text-zen-secondary mb-2 md:mb-3">Today&apos;s focus</p>
            <h2
              id="home-rec-heading"
              className="font-display text-[1.375rem] sm:text-[1.65rem] lg:text-[1.85rem] leading-[1.18] tracking-tight text-zen-fg font-semibold pr-16 md:pr-0"
            >
              {selected.name}
            </h2>
            <p className="font-ui text-[0.875rem] leading-relaxed text-zen-fg-muted mt-2 md:mt-2.5 max-w-md pr-16 md:pr-0">
              {mapped.defaultMessage}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="zen-caption text-zen-fg-subtle">
                {selected.duration_min} min
              </span>
              {selected.tags?.length ? (
                <span className="zen-caption text-zen-fg-subtle">
                  {selected.tags.slice(0, 2).join(' · ')}
                </span>
              ) : null}
            </div>
            <p className="font-ui text-[0.75rem] leading-snug text-zen-fg-subtle mt-2.5 max-w-md hidden md:block">
              {contextLine}
            </p>
            <div className="mt-4 md:mt-5 flex flex-wrap items-center gap-2.5">
              <ZenButton asChild size="lg" variant="secondary" className="min-h-11 rounded-zen-xl gap-2">
                <Link
                  href={route}
                  onClick={() => setRecommendationLaunch(data.log_id, route)}
                >
                  <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  Start now
                </Link>
              </ZenButton>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-ui text-[0.8125rem] text-zen-fg-muted hover:text-zen-fg transition-colors focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2 rounded-sm min-h-11 px-1"
                aria-expanded={whyOpen}
                onClick={() => setWhyOpen((v) => !v)}
              >
                Why this?
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', whyOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </div>
            <AnimatePresence initial={false}>
              {whyOpen ? (
                <motion.p
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  className="font-ui text-[0.8125rem] text-zen-fg-muted mt-3 max-w-md overflow-hidden"
                >
                  Personalised from your recent mood, tone, and time of day
                  {data.context?.time_of_day
                    ? ` (${data.context.time_of_day.replace(/_/g, ' ')})`
                    : ''}
                  .
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Desktop: module atmosphere only — Home Panda lives beside this card */}
        <div className="relative hidden md:flex justify-center items-center min-h-[10.5rem]">
          <RecommendationAtmosphere
            moduleId={selected.module_id}
            className="absolute inset-0 flex items-center justify-center opacity-95"
          />
        </div>
      </div>
    </section>
  );
}

export default ZenRecommendation;
