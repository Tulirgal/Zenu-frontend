'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { trackEngagement } from '@/lib/signals';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { GratitudeEntry, GratitudeOverallReview } from '@/lib/types';
import {
  ZenPage,
  ZenButton,
  ZenDialog,
  ZenDialogContent,
  ZenDialogDescription,
  ZenDialogHeader,
  ZenDialogTitle,
  ZenSkeleton,
} from '@/components/zen';
import { cn } from '@/lib/utils';
import { GratitudeHeader } from './components/GratitudeHeader';
import { GratitudeJar } from './components/GratitudeJar';
import { MemoryReveal } from './components/MemoryReveal';
import { AddGratitudeDialog } from './components/AddGratitudeDialog';
import { RecentMoments } from './components/RecentMoments';
import {
  GratitudeCompanion,
  type GratitudeWhisper,
} from './components/GratitudeCompanion';
import { pickLocalRandom } from './components/gratitudeUtils';

function GratitudePageInner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [jarActive, setJarActive] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [revealed, setRevealed] = useState<GratitudeEntry | null>(null);
  const [whisperLine, setWhisperLine] = useState<string | null>(null);
  const [overallReview, setOverallReview] = useState<GratitudeOverallReview | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [companionWhisper, setCompanionWhisper] = useState<GratitudeWhisper>(null);
  const [whisperPulse, setWhisperPulse] = useState(0);

  useEffect(() => {
    trackEngagement('journal_gratitude', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('journal_gratitude', 'completed', duration);
    };
  }, []);

  const flashWhisper = (w: Exclude<GratitudeWhisper, null>) => {
    setCompanionWhisper(w);
    setWhisperPulse((n) => n + 1);
  };

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setOverallReview(null);
    setReviewDialogOpen(false);
    try {
      const data = await apiClient.getGratitudeEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load gratitude entries', error);
      toast.error('Unable to load your gratitude jar right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadEntries();
  }, [user, loadEntries]);

  const handleCreateEntry = async (input: { title: string; content: string }) => {
    setSubmitting(true);
    try {
      const created = await apiClient.createGratitudeEntry({
        title: input.title.trim() ? input.title.trim() : null,
        content: input.content.trim(),
      });
      setEntries((prev) => [created, ...prev]);
      setComposerOpen(false);
      toast.success('Moment saved in your jar.');
      flashWhisper('saved');
      await apiClient.recordActivity('gratitude', { entryId: created.id });
    } catch (error) {
      console.error('Failed to create gratitude entry', error);
      toast.error('Could not save this gratitude moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePickMemory = async () => {
    if (!entries.length) {
      toast.message('Your jar is still empty. Add your first gratitude moment.');
      flashWhisper('empty');
      return;
    }

    setPicking(true);
    setJarActive(true);
    setOverallReview(null);
    setReviewDialogOpen(false);

    try {
      const result = await apiClient.getRandomGratitudeFeedback();
      setRevealed(result.entry);
      setWhisperLine(result.feedback?.trim() ? result.feedback : null);
      flashWhisper('found');
      await apiClient.recordActivity('gratitude', {
        action: 'random_reflection',
        entryId: result.entry.id,
        thankfulnessScore: result.thankfulnessScore,
      });
    } catch (error) {
      console.error('Failed to fetch random gratitude feedback', error);
      const local = pickLocalRandom(entries);
      if (local) {
        setRevealed(local);
        setWhisperLine(null);
        flashWhisper('found');
        toast.message('Opened a memory from your jar.');
      } else {
        toast.error('Could not pick a memory right now.');
      }
    } finally {
      setPicking(false);
      window.setTimeout(() => setJarActive(false), 1600);
    }
  };

  const handleOverallReview = async () => {
    if (!entries.length) {
      toast.message('Add a few moments first to generate a quiet review.');
      return;
    }
    setReviewing(true);
    try {
      const result = await apiClient.getOverallGratitudeReview();
      setOverallReview(result);
      setReviewDialogOpen(true);
      await apiClient.recordActivity('gratitude', {
        action: 'overall_review',
        entriesCount: result.entriesCount,
      });
    } catch (error) {
      console.error('Failed to fetch overall gratitude review', error);
      toast.error('Could not generate the overall review now.');
    } finally {
      setReviewing(false);
    }
  };

  const handleDeleteRevealed = async () => {
    if (!revealed?.id) return;
    try {
      await apiClient.deleteGratitudeEntry(revealed.id);
      setEntries((prev) => prev.filter((entry) => entry.id !== revealed.id));
      setRevealed(null);
      setWhisperLine(null);
      toast.success('Moment removed from your jar.');
    } catch (error) {
      console.error('Failed to delete gratitude entry', error);
      toast.error('Could not delete this moment.');
    }
  };

  const closeReveal = () => {
    setRevealed(null);
    setWhisperLine(null);
  };

  const greetingName = useMemo(() => {
    if (!user) return 'friend';
    return user.username ?? user.fullName ?? user.email?.split('@')[0] ?? 'friend';
  }, [user]);

  const hasEntries = entries.length > 0;

  return (
    <ZenPage
      atmosphere="home"
      className={cn(
        'relative min-h-dvh overflow-x-hidden',
        'bg-[hsl(38,40%,99%)]',
        'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-16',
        'pt-6 md:pt-10',
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 900px 480px at 12% 0%, hsl(32 55% 78% / 0.22), transparent 58%), radial-gradient(ellipse 720px 420px at 92% 18%, hsl(28 45% 88% / 0.35), transparent 55%), radial-gradient(ellipse 600px 360px at 50% 100%, hsl(40 40% 92% / 0.4), transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] space-y-10 px-4 sm:px-6 md:space-y-12 lg:px-8">
        <GratitudeHeader
          greetingName={greetingName}
          onAdd={() => setComposerOpen(true)}
          onPick={() => void handlePickMemory()}
          picking={picking}
          canPick={hasEntries && !loading}
        />

        <section className="flex flex-col items-center gap-8">
          {loading ? (
            <ZenSkeleton className="h-72 w-full max-w-sm" rounded="2xl" />
          ) : (
            <GratitudeJar entryCount={entries.length} active={jarActive || Boolean(revealed)} />
          )}

          <MemoryReveal
            entry={revealed}
            whisper={whisperLine}
            onClose={closeReveal}
            onDelete={() => void handleDeleteRevealed()}
          />

          {hasEntries ? (
            <GratitudeCompanion
              key={whisperPulse}
              whisper={companionWhisper}
              visible
            />
          ) : null}
        </section>

        <RecentMoments
          entries={entries}
          loading={loading}
          onAdd={() => setComposerOpen(true)}
          onOpen={(entry) => {
            setRevealed(entry);
            setWhisperLine(null);
          }}
          onReview={() => void handleOverallReview()}
          reviewing={reviewing}
        />
      </div>

      <AddGratitudeDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        onSubmit={handleCreateEntry}
        submitting={submitting}
      />

      <ZenDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <ZenDialogContent className="sm:max-w-2xl">
          <ZenDialogHeader>
            <ZenDialogTitle className="font-display">Quiet jar review</ZenDialogTitle>
            <ZenDialogDescription>
              A gentle look across the moments you&apos;ve kept.
            </ZenDialogDescription>
          </ZenDialogHeader>

          {overallReview ? (
            <div className="space-y-3">
              <p className="font-ui text-sm text-zen-fg-muted">
                Moments considered: {overallReview.entriesCount}
              </p>
              <p className="whitespace-pre-wrap font-display text-[1.0625rem] leading-relaxed text-zen-fg">
                {overallReview.review}
              </p>
            </div>
          ) : (
            <ZenSkeleton className="h-40 w-full" rounded="xl" />
          )}

          <div className="mt-4 flex justify-end">
            <ZenButton variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Close
            </ZenButton>
          </div>
        </ZenDialogContent>
      </ZenDialog>
    </ZenPage>
  );
}

export default function GratitudePage() {
  return (
    <RequireAuth>
      <GratitudePageInner />
    </RequireAuth>
  );
}
