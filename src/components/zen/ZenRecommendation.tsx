'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
  const allRecommendations = data?.recommendations ?? [];
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
          'shadow-[0_8px_28px_-18px_rgba(30,41,90,0.12)]',
          'px-4 py-5 sm:px-6 md:px-8 md:py-8 lg:px-9 lg:py-9',
        )}
      >
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <p className="zen-eyebrow text-zen-secondary mb-1.5">
            For you right now
          </p>
          <p className="font-ui text-[0.8125rem] leading-snug text-zen-fg-muted max-w-lg md:text-[0.9375rem] md:leading-relaxed">
            {contextLine}
          </p>
        </div>

        {/* 3 recommendation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {allRecommendations.slice(0, 3).map((rec, i) => {
            const recMapped = mapRecommendationToPanda(rec.module_id);
            const recRoute = MODULE_ROUTES[rec.module_id] || recMapped?.href || '/';

            return (
              <AnimatePresence key={rec.module_id} mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.08 }}
                  className={cn(
                    'relative flex flex-col justify-between',
                    'rounded-zen-xl border border-zen-border-soft/55',
                    'bg-zen-surface-raised px-4 py-4 md:px-5 md:py-5',
                    'hover:border-zen-primary/30 hover:shadow-md transition-all duration-200',
                    i === 0 && 'ring-1 ring-zen-primary/20',
                  )}
                >
                  {/* Rank badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      'text-[0.7rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full',
                      i === 0
                        ? 'bg-zen-primary/10 text-zen-primary'
                        : 'bg-zen-surface text-zen-fg-subtle border border-zen-border-soft/40',
                    )}>
                      {i === 0 ? '✦ Top pick' : `#${i + 1}`}
                    </span>
                    <span className="text-[0.75rem] text-zen-fg-subtle">
                      {rec.duration_min} min
                    </span>
                  </div>

                  {/* Module name */}
                  <h3 className="font-display text-[1rem] md:text-[1.125rem] font-semibold text-zen-fg leading-tight mb-1">
                    {rec.name}
                  </h3>

                  {/* Message */}
                  {recMapped && (
                    <p className="font-ui text-[0.8125rem] text-zen-fg-muted leading-snug mb-3 line-clamp-2">
                      {recMapped.defaultMessage}
                    </p>
                  )}

                  {/* Tags */}
                  {rec.tags?.length ? (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-[0.7rem] px-2 py-0.5 rounded-full bg-zen-surface border border-zen-border-soft/40 text-zen-fg-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Start button */}
                  <Link
                    href={recRoute}
                    onClick={() => setRecommendationLaunch(data.log_id, recRoute)}
                    className={cn(
                      'inline-flex items-center gap-1.5 self-start',
                      'font-ui text-[0.8125rem] font-medium',
                      'px-3.5 py-2 rounded-zen-xl',
                      'transition-all duration-150',
                      i === 0
                        ? 'bg-zen-primary text-white hover:bg-zen-primary/90'
                        : 'bg-zen-surface border border-zen-border-soft text-zen-fg hover:bg-zen-surface-raised',
                    )}
                  >
                    Start
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Why this — collapsed */}
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center gap-1 font-ui text-[0.8125rem] text-zen-fg-muted hover:text-zen-fg transition-colors rounded-sm"
            aria-expanded={whyOpen}
            onClick={() => setWhyOpen((v) => !v)}
          >
            Why these?
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', whyOpen && 'rotate-180')}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence initial={false}>
            {whyOpen ? (
              <motion.p
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                className="font-ui text-[0.8125rem] text-zen-fg-muted mt-2 max-w-md overflow-hidden"
              >
                Personalised from your recent mood, tone, and time of day
                {data.context?.time_of_day ? ` (${data.context.time_of_day.replace(/_/g, ' ')})` : ''}
                .
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default ZenRecommendation;
