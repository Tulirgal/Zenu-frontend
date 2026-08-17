'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { trackEngagement } from '@/lib/signals';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { GratitudeEntry } from '@/lib/types';
import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';
import {
  ZenPage,
  ZenBackLink,
  ZenSkeleton,
} from '@/components/zen';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';
import { cn } from '@/lib/utils';
import { GratitudeHeader } from './components/GratitudeHeader';
import { GratitudeJar, type GratitudeJarHandle, type JarPhase } from './components/GratitudeJar';
import { MemoryReveal } from './components/MemoryReveal';
import { AddGratitudeDialog } from './components/AddGratitudeDialog';
import {
  GratitudeCompanion,
  type CompanionStage,
  type GratitudeWhisper,
} from './components/GratitudeCompanion';
import { pickLocalRandom } from './components/gratitudeUtils';
import { DepositRitual } from './components/ritual/DepositRitual';
import { RetrieveRitual } from './components/ritual/RetrieveRitual';
import { getElementCenter, type Point } from './components/ritual/geometry';

function GratitudePageInner() {
  const { user } = useAuth();
  const jarRef = useRef<GratitudeJarHandle>(null);
  const dialogPanelRef = useRef<HTMLDivElement>(null);
  const theme = getTheme('gratitude');

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [jarPhase, setJarPhase] = useState<JarPhase>('idle');
  const [revealed, setRevealed] = useState<GratitudeEntry | null>(null);
  const [whisperLine, setWhisperLine] = useState<string | null>(null);
  const [companionWhisper, setCompanionWhisper] = useState<GratitudeWhisper>(null);
  const [whisperPulse, setWhisperPulse] = useState(0);
  const [pandaEmotion, setPandaEmotion] = useState<PandaEmotion>('calm');
  const [pandaAnimation, setPandaAnimation] = useState<PandaAnimation>('idle');
  const [companionStage, setCompanionStage] = useState<CompanionStage>('rest');

  const [deposit, setDeposit] = useState<{
    source: Point;
    mouth: Point;
    preview: { title: string; content: string };
  } | null>(null);
  const [retrieve, setRetrieve] = useState<{
    mouth: Point;
    entry: GratitudeEntry;
    feedback: string | null;
  } | null>(null);
  const [pendingReveal, setPendingReveal] = useState<{
    entry: GratitudeEntry;
    feedback: string | null;
  } | null>(null);
  const pendingRevealRef = useRef(pendingReveal);
  pendingRevealRef.current = pendingReveal;

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

      const source =
        getElementCenter(dialogPanelRef.current) ??
        getElementCenter(document.querySelector('[role="dialog"]'));
      const mouth = getElementCenter(jarRef.current?.getMouthElement() ?? null);

      setComposerOpen(false);
      await apiClient.recordActivity('gratitude', { entryId: created.id });

      if (source && mouth) {
        setPandaEmotion('listening');
        setPandaAnimation('attentive');
        setDeposit({
          source,
          mouth,
          preview: {
            title: input.title.trim() || 'Gratitude',
            content: input.content.trim(),
          },
        });
      } else {
        toast.success('Moment saved in your jar.');
        flashWhisper('saved');
        setPandaEmotion('happy');
        setPandaAnimation('idle');
      }
    } catch (error) {
      console.error('Failed to create gratitude entry', error);
      toast.error('Could not save this gratitude moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const finishDeposit = useCallback(() => {
    setJarPhase('absorb');
    setPandaEmotion('happy');
    setPandaAnimation('idle');
    flashWhisper('saved');
    toast.success('Moment saved in your jar.');
    setDeposit(null);
    window.setTimeout(() => {
      setJarPhase('idle');
      setPandaEmotion('calm');
    }, 320);
  }, []);

  const handlePickMemory = async () => {
    if (!entries.length) {
      toast.message('Your jar is still empty. Add your first gratitude moment.');
      flashWhisper('empty');
      return;
    }

    setPicking(true);
    setRevealed(null);
    setWhisperLine(null);
    setCompanionStage('reach');
    flashWhisper('choosing');
    setPandaEmotion('curious');
    setPandaAnimation('bounce');
    setJarPhase('resonate');

    const mouth = getElementCenter(jarRef.current?.getMouthElement() ?? null);

    try {
      const result = await apiClient.getRandomGratitudeFeedback();
      await apiClient.recordActivity('gratitude', {
        action: 'random_reflection',
        entryId: result.entry.id,
        thankfulnessScore: result.thankfulnessScore,
      });

      const feedback = result.feedback?.trim() ? result.feedback : null;
      if (mouth) {
        setPendingReveal({ entry: result.entry, feedback });
        setPandaEmotion('thinking');
        setPandaAnimation('tilt');
        await new Promise((r) => window.setTimeout(r, 160));
        setRetrieve({
          mouth: getElementCenter(jarRef.current?.getMouthElement() ?? null) ?? mouth,
          entry: result.entry,
          feedback,
        });
      } else {
        setJarPhase('idle');
        setCompanionStage('offer');
        setRevealed(result.entry);
        setWhisperLine(feedback);
        flashWhisper('found');
        setPandaEmotion('happy');
        setPandaAnimation('wave');
      }
    } catch (error) {
      console.error('Failed to fetch random gratitude feedback', error);
      const local = pickLocalRandom(entries);
      if (local && mouth) {
        setPendingReveal({ entry: local, feedback: null });
        setPandaEmotion('thinking');
        setPandaAnimation('tilt');
        await new Promise((r) => window.setTimeout(r, 160));
        setRetrieve({
          mouth: getElementCenter(jarRef.current?.getMouthElement() ?? null) ?? mouth,
          entry: local,
          feedback: null,
        });
        toast.message('Panda found a memory in your jar.');
      } else if (local) {
        setCompanionStage('offer');
        setRevealed(local);
        setWhisperLine(null);
        flashWhisper('found');
        setJarPhase('idle');
        setPandaEmotion('happy');
        setPandaAnimation('wave');
        toast.message('Panda found a memory in your jar.');
      } else {
        toast.error('Could not pick a memory right now.');
        setJarPhase('idle');
        setCompanionStage('rest');
        setPandaEmotion('calm');
        setPandaAnimation('idle');
      }
    } finally {
      setPicking(false);
    }
  };

  const onRetrieveReady = useCallback(() => {
    const pending = pendingRevealRef.current;
    if (!pending) return;
    setCompanionStage('offer');
    setRevealed(pending.entry);
    setWhisperLine(pending.feedback);
    setPandaEmotion('happy');
    setPandaAnimation('wave');
    flashWhisper('found');
  }, []);

  const finishRetrieve = useCallback(() => {
    setRetrieve(null);
    setPendingReveal(null);
    setJarPhase('idle');
  }, []);

  const handleDeleteRevealed = async () => {
    if (!revealed?.id) return;
    try {
      await apiClient.deleteGratitudeEntry(revealed.id);
      setEntries((prev) => prev.filter((entry) => entry.id !== revealed.id));
      setRevealed(null);
      setWhisperLine(null);
      setCompanionStage('rest');
      setPandaEmotion('calm');
      setPandaAnimation('idle');
      toast.success('Moment removed from your jar.');
    } catch (error) {
      console.error('Failed to delete gratitude entry', error);
      toast.error('Could not delete this moment.');
    }
  };

  const closeReveal = () => {
    setRevealed(null);
    setWhisperLine(null);
    setCompanionStage('rest');
    setPandaEmotion('calm');
    setPandaAnimation('idle');
  };

  const greetingName = useMemo(() => {
    if (!user) return 'friend';
    return user.username ?? user.fullName ?? user.email?.split('@')[0] ?? 'friend';
  }, [user]);

  const hasEntries = entries.length > 0;

  return (
    <ModulePage
      theme={theme}
      className={cn(
        'relative flex w-full flex-col overflow-x-hidden',
        'max-md:absolute max-md:inset-0 max-md:overflow-y-auto',
        'md:h-full md:min-h-0 md:flex-1',
        'max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px)+1rem)]',
        'md:pb-10',
      )}
    >
      <div
        className={cn(
          'sticky top-0 z-40 px-4 pt-3 pb-2 sm:px-6',
          'supports-[backdrop-filter]:backdrop-blur-md',
        )}
        style={{
          background:
            'linear-gradient(180deg, rgba(26,10,0,0.92) 0%, rgba(61,31,0,0.78) 70%, rgba(61,31,0,0) 100%)',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <ZenBackLink section="Gratitude" />
        </div>
      </div>

      <ZenPage atmosphere="none" className="relative w-full">
        <div className="relative z-10 mx-auto flex w-full max-w-[820px] flex-col items-center px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
          <GratitudeHeader
            className="mt-4 w-full"
            greetingName={greetingName}
            onAdd={() => setComposerOpen(true)}
            onPick={() => void handlePickMemory()}
            picking={picking || Boolean(retrieve)}
            canPick={hasEntries && !loading && !deposit && !retrieve}
          />

          <section className="mt-8 flex w-full flex-row items-end justify-center gap-6 md:mt-12">
            {loading ? (
              <ZenSkeleton className="h-72 w-[220px]" rounded="2xl" />
            ) : (
              <GratitudeJar
                ref={jarRef}
                entryCount={entries.length}
                active={jarPhase !== 'idle' || Boolean(revealed)}
                phase={jarPhase}
              />
            )}

            <GratitudeCompanion
              key={whisperPulse}
              whisper={companionWhisper}
              visible={!loading}
              emotion={pandaEmotion}
              animation={pandaAnimation}
              stage={companionStage}
            >
              {revealed ? (
                <MemoryReveal
                  entry={revealed}
                  whisper={whisperLine}
                  onClose={closeReveal}
                  onDelete={() => void handleDeleteRevealed()}
                />
              ) : null}
            </GratitudeCompanion>
          </section>
        </div>

        <AddGratitudeDialog
          ref={dialogPanelRef}
          open={composerOpen}
          onOpenChange={setComposerOpen}
          onSubmit={handleCreateEntry}
          submitting={submitting}
        />

        {deposit ? (
          <DepositRitual
            source={deposit.source}
            mouth={deposit.mouth}
            preview={deposit.preview}
            onComplete={finishDeposit}
          />
        ) : null}

        {retrieve ? (
          <RetrieveRitual
            mouth={retrieve.mouth}
            onReadyToReveal={onRetrieveReady}
            onComplete={finishRetrieve}
          />
        ) : null}
      </ZenPage>
    </ModulePage>
  );
}

export default function GratitudePage() {
  return (
    <RequireAuth>
      <GratitudePageInner />
    </RequireAuth>
  );
}
