'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sprout,
  TreeDeciduous,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { JournalEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { shouldShowPSS } from '@/lib/pssSchedule';
import PandaAvatar from '@/components/PandaAvatar';
import type { PandaEmotion } from '@/components/panda/types';
import {
  HomeAtmospherePanda,
  HomeClosing,
  HomeGarden,
  HomeGreeting,
  HomeHeader,
  HomeReflections,
  HomeYourSpace,
} from '@/components/home';
import type { HomePandaPresentation } from '@/components/home/HomeGreeting';
import {
  ZenPage,
  ZenContainer,
  ZenButton,
  ZenMoodSelector,
  ZenRecommendation,
  ZenCard,
} from '@/components/zen';

const useHomeData = (enabled: boolean) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!enabled) {
        setEntries([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const journalList = await apiClient.getJournalEntries({ limit: 3 });
        if (!mounted) return;
        setEntries(journalList);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load your home');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [enabled]);

  return { entries, loading, error };
};

const LandingHero = () => {
  return (
    <ZenPage atmosphere="home" gradient className="min-h-[calc(100dvh-4rem)]">
      <ZenContainer maxWidth="xl" className="pt-16 pb-20 md:pt-24">
        <div className="relative overflow-hidden rounded-zen-2xl min-h-[70vh] flex flex-col justify-end">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--zen-atm-bg-tint)' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--zen-primary)/0.12),transparent_55%)]" aria-hidden="true" />
          <div className="absolute top-8 right-8 opacity-90 hidden sm:block z-10" aria-hidden="true">
            <PandaAvatar state="idle" size={120} />
          </div>

          <div className="relative z-10 p-8 sm:p-12 max-w-2xl">
            <p className="zen-label text-zen-primary mb-4">ZenU</p>
            <h1 className="zen-display text-zen-fg font-display">
              Your calm, between classes.
            </h1>
            <p className="zen-body text-zen-fg-muted mt-5 max-w-lg">
              Guided breathing, journaling, and a companion who listens — built for student stress, not generic wellness noise.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <ZenButton asChild size="lg">
                <Link href="/signin">
                  Sign in
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </ZenButton>
              <ZenButton asChild variant="outline" size="lg">
                <Link href="/signup">Create account</Link>
              </ZenButton>
            </div>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-3xl">
          <div className="flex gap-3">
            <Sprout className="h-5 w-5 text-zen-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="zen-body-sm text-zen-fg-muted">
              Micro-practices under five minutes to reset between lectures.
            </p>
          </div>
          <div className="flex gap-3">
            <TreeDeciduous className="h-5 w-5 text-zen-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="zen-body-sm text-zen-fg-muted">
              Gentle growth that celebrates showing up, not perfection.
            </p>
          </div>
        </div>
      </ZenContainer>
    </ZenPage>
  );
};

const PssNudge = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  const router = useRouter();
  if (!visible) return null;

  return (
    <div
      className={cn(
        'rounded-zen-lg px-3.5 py-3',
        'bg-[hsl(38_42%_97%)] border border-[hsl(36_30%_90%)]',
      )}
      role="status"
    >
      <p className="font-ui text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-zen-fg-subtle mb-1">
        Weekly check-in
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="font-ui text-[0.8125rem] text-zen-fg-muted flex-1 min-w-[9rem]">
          Your weekly stress check is due
        </p>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => router.push('/assessment')}
            className="font-ui text-[0.8125rem] font-medium text-zen-secondary hover:text-zen-fg min-h-11 px-1.5 rounded-sm focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
          >
            Take PSS →
          </button>
          <button
            type="button"
            aria-label="Dismiss stress check reminder"
            onClick={onDismiss}
            className="inline-flex h-11 w-10 items-center justify-center rounded-full text-zen-fg-subtle hover:text-zen-fg hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading: dashboardLoading, error } = useHomeData(Boolean(user));
  const [showPssNudge, setShowPssNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [recRefreshKey, setRecRefreshKey] = useState(0);
  const [moodGlow, setMoodGlow] = useState<string | null>(null);
  const [pandaPresentation, setPandaPresentation] =
    useState<HomePandaPresentation | null>(null);

  const displayName =
    user?.username ?? user?.fullName ?? user?.email?.split('@')[0] ?? 'friend';

  const handlePresentationChange = useCallback(
    (presentation: HomePandaPresentation | null) => {
      setPandaPresentation(presentation);
    },
    [],
  );

  useEffect(() => {
    if (!user || dashboardLoading) {
      setShowPssNudge(false);
      return;
    }
    setShowPssNudge(shouldShowPSS() && !nudgeDismissed);
  }, [user, dashboardLoading, nudgeDismissed]);

  const handleMoodSelect = (
    _score: number,
    meta: { emotion: PandaEmotion; glow: string },
  ) => {
    setMoodGlow(meta.glow);
    setRecRefreshKey((k) => k + 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" aria-busy="true" aria-label="Loading">
        <div className="h-12 w-12 rounded-full border-4 border-zen-primary-soft border-t-zen-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <LandingHero />;

  return (
    <ZenPage atmosphere="home" gradient className="min-h-[calc(100dvh-4rem)] relative">
      <div className="zen-home-atmosphere absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="zen-home-glow left-[-12%] top-[4%] h-48 w-48 md:h-72 md:w-72 opacity-70"
          style={{ background: moodGlow ?? 'hsl(var(--zen-secondary) / 0.12)' }}
        />
        <div className="zen-home-glow right-[-10%] top-[18%] h-52 w-52 md:h-80 md:w-80 bg-zen-secondary-soft opacity-30" />
      </div>

      <ZenContainer
        maxWidth="full"
        className="relative z-10 mx-auto w-full max-w-[1320px] pt-3 pb-8 px-4 sm:px-5 md:pt-6 md:pb-16 md:px-8 lg:px-10"
      >
        <HomeHeader />

        {/* Hero composition — atmospheric Panda is outside all cards */}
        <div className="relative flex flex-col gap-9 md:gap-10 lg:gap-11">
          <HomeAtmospherePanda presentation={pandaPresentation} />

          <HomeGreeting
            displayName={displayName}
            panda={pandaPresentation}
            className="md:pr-[11rem] lg:pr-[13rem] xl:pr-[14rem]"
          />

          <ZenMoodSelector onSelect={handleMoodSelect} className="md:pr-[2rem]" />

          <PssNudge visible={showPssNudge} onDismiss={() => setNudgeDismissed(true)} />

          {/* Recommendation — full width */}
          <ZenRecommendation
            refreshKey={recRefreshKey}
            onPresentationChange={handlePresentationChange}
            className="w-full"
          />

          {error ? (
            <ZenCard variant="subtle" className="border-zen-danger/30 bg-zen-danger-soft text-center w-full">
              <p className="zen-body text-zen-danger">{error}</p>
            </ZenCard>
          ) : null}

          {/* Below recommendation — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Healing Garden widget stays here */}
            <HomeGarden className="rounded-zen-xl bg-zen-surface border border-zen-border-soft/55 p-6 shadow-[0_6px_20px_-16px_rgba(30,41,90,0.1)]" />
            
            {/* Recent Reflections / Journal stays here */}
            <HomeReflections
              entries={entries}
              loading={dashboardLoading}
              className="rounded-zen-xl bg-zen-surface border border-zen-border-soft/55 p-6 shadow-[0_6px_20px_-16px_rgba(30,41,90,0.1)]"
            />
          </div>

          <HomeYourSpace />

          <HomeClosing className="mb-1" />
        </div>
      </ZenContainer>
    </ZenPage>
  );
};

export default HomePage;
