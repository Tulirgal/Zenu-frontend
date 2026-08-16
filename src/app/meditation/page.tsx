'use client';

import { useCallback, useEffect, useState } from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import ZenFocusMode from '@/components/layout/ZenFocusMode';
import {
  ZenPage,
  ZenButton,
} from '@/components/zen';
import { apiClient } from '@/lib/apiClient';
import type { Meditation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PracticeCard } from './components/PracticeCard';
import { AtmosphereControl } from './components/AtmosphereControl';
import { SequenceTimeline } from './components/SequenceTimeline';
import { TipsDisclosure } from './components/TipsDisclosure';

function MeditationPageInner() {
  const { user } = useAuth();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeditations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.getMeditations();
      setMeditations(result);
    } catch (err) {
      console.error('Failed to load meditations', err);
      setError('We could not load guided sessions. Please refresh or try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadMeditations();
  }, [user, loadMeditations]);

  const session = meditations[0] ?? null;

  return (
    <ZenFocusMode title="Mindfulness Studio">
      <ZenPage
        atmosphere="home"
        className={cn(
          'relative min-h-dvh overflow-x-hidden',
          'bg-[hsl(40,35%,99%)]',
          'pt-20 pb-16 md:pt-24 md:pb-20',
        )}
      >
        {/* Subtle lavender/blue atmosphere — not full-page purple */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 900px 480px at 15% 0%, hsl(262 40% 72% / 0.12), transparent 60%), radial-gradient(ellipse 700px 400px at 90% 20%, hsl(210 55% 70% / 0.1), transparent 55%), radial-gradient(ellipse 600px 360px at 50% 100%, hsl(40 40% 92% / 0.5), transparent 50%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-zen-secondary md:text-[0.75rem]">
              Guided stillness
            </p>
            <h1
              className={cn(
                'mt-3 font-display font-medium text-zen-fg',
                'text-[1.875rem] leading-[1.15] tracking-[-0.02em]',
                'sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem]',
              )}
            >
              Find your inner peace
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:text-[1.0625rem]">
              A few quiet minutes to slow down and release tension.
            </p>
          </header>

          {error ? (
            <div className="mx-auto mt-10 max-w-lg rounded-zen-xl border border-zen-danger/20 bg-zen-danger-soft/40 px-5 py-4 text-center">
              <p className="font-ui text-sm text-zen-danger">{error}</p>
              <ZenButton variant="outline" className="mt-4" onClick={loadMeditations}>
                Try again
              </ZenButton>
            </div>
          ) : null}

          <div className="mt-10 md:mt-12">
            {loading ? (
              <div className="rounded-zen-2xl border border-zen-border-soft bg-white/60 px-6 py-20 text-center font-ui text-zen-fg-muted">
                Loading session…
              </div>
            ) : session ? (
              <PracticeCard session={session} />
            ) : (
              <div className="rounded-zen-2xl border border-dashed border-zen-border bg-white/50 px-6 py-16 text-center font-ui text-zen-fg-muted">
                No guided meditations are available yet. Check back soon.
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-8">
            <AtmosphereControl />
          </div>

          {session ? (
            <>
              <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12 lg:gap-16">
                <section className="min-w-0">
                  <h2 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-zen-fg md:text-[1.5rem]">
                    About this practice
                  </h2>
                  <p className="mt-3 font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:text-[1.0625rem]">
                    {session.description?.trim() ||
                      "Jacobson's Progressive Muscle Relaxation guides you through systematically tensing and releasing each muscle group so the body can settle into stillness."}
                  </p>
                </section>

                <SequenceTimeline />
              </div>

              <div className="mt-10 md:mt-12">
                <TipsDisclosure />
              </div>
            </>
          ) : null}
        </div>
      </ZenPage>
    </ZenFocusMode>
  );
}

export default function MeditationPage() {
  return (
    <RequireAuth>
      <MeditationPageInner />
    </RequireAuth>
  );
}
