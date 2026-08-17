'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { JournalEntry } from '@/lib/types';
import { ZenButton } from '@/components/zen';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  defaultFormState,
  type EntryFormMode,
  type EntryFormState,
} from '../journalUtils';
import type { BookPhase, JournalPandaPhase, PageTurnDirection, SpreadMode } from './bookTypes';
import { JournalSpread } from './JournalSpread';
import { JournalContents } from './JournalContents';
import { JournalEntryPage } from './JournalEntryPage';
import { JournalWritePage } from './JournalWritePage';
import { JournalPageTurn } from './JournalPageTurn';
import { JournalPanda } from './JournalPanda';

function useIsMobileLite() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return lite;
}

function sleep(ms: number) {
  return new Promise<void>((r) => {
    window.setTimeout(r, ms);
  });
}

export function JournalBook({
  entries,
  loading,
  loadError,
  onRetry,
  formMode,
  formValues,
  formSubmitting,
  onFormChange,
  onSave,
  onRequestDelete,
  onFormModeChange,
  className,
}: {
  entries: JournalEntry[];
  loading?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  formMode: EntryFormMode;
  formValues: EntryFormState;
  formSubmitting: boolean;
  onFormChange: (next: EntryFormState) => void;
  onSave: () => Promise<boolean>;
  onRequestDelete: (entry: JournalEntry) => void;
  onFormModeChange: (mode: EntryFormMode) => void;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const lite = useIsMobileLite();

  const [phase, setPhase] = useState<BookPhase>('closed');
  const [spreadMode, setSpreadMode] = useState<SpreadMode>('toc');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [hovering, setHovering] = useState(false);
  const [turnDirection, setTurnDirection] = useState<PageTurnDirection>('forward');
  const [thinking, setThinking] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const isOpenSurface = phase === 'open' || phase === 'turning' || phase === 'saving';
  /** Front cover rotated open (hinged at spine). */
  const lidOpen =
    phase === 'opening' ||
    phase === 'open' ||
    phase === 'turning' ||
    phase === 'saving';
  /**
   * Interior pages visible. Hidden when closed AND while closing
   * so Contents cannot remain beside/under the shutting cover.
   */
  const pagesVisible =
    phase === 'opening' ||
    phase === 'open' ||
    phase === 'turning' ||
    phase === 'saving';
  /** Full open footprint until fully closed. */
  const expanded = phase !== 'closed';
  /**
   * Front cover stays mounted for hinge motion but is hidden once the book
   * is settled open — otherwise rotateY parks it on top of the left page.
   */
  const coverOpaque =
    phase === 'closed' || phase === 'opening' || phase === 'closing';

  const selectedIndex = useMemo(() => {
    if (!selectedEntry) return -1;
    return entries.findIndex((e) => e.id === selectedEntry.id);
  }, [entries, selectedEntry]);

  useEffect(() => {
    if (!selectedEntry) return;
    const next = entries.find((e) => e.id === selectedEntry.id);
    if (!next) {
      setSelectedEntry(null);
      setSpreadMode((m) => (m === 'reading' ? 'toc' : m));
      return;
    }
    if (
      next.title !== selectedEntry.title ||
      next.content !== selectedEntry.content ||
      next.mood !== selectedEntry.mood
    ) {
      setSelectedEntry(next);
    }
  }, [entries, selectedEntry]);

  const openBook = useCallback(async () => {
    if (phase !== 'closed') return;
    setHovering(false);
    setPhase('opening');
    setSpreadMode('toc');
    setSelectedEntry(null);
    await sleep(reducedMotion ? 200 : 750);
    setPhase('open');
  }, [phase, reducedMotion]);

  const runClose = useCallback(async () => {
    setSpreadMode('toc');
    setSelectedEntry(null);
    setThinking(false);
    setPhase('closing');
    await sleep(reducedMotion ? 200 : 750);
    setPhase('closed');
    setHovering(false);
  }, [reducedMotion]);

  const closeBook = useCallback(async () => {
    if (!(phase === 'open' || phase === 'turning')) return;
    if (spreadMode === 'writing') return;
    await runClose();
  }, [phase, spreadMode, runClose]);

  const startWrite = () => {
    onFormModeChange('create');
    onFormChange(defaultFormState);
    setSelectedEntry(null);
    setSpreadMode('writing');
    setThinking(false);
  };

  const startEdit = (entry: JournalEntry) => {
    onFormModeChange('edit');
    onFormChange({
      id: entry.id,
      mood: entry.mood ?? null,
      title: entry.title ?? '',
      content: entry.content ?? '',
    });
    setSpreadMode('writing');
    setThinking(false);
  };

  const cancelWrite = useCallback(() => {
    if (formMode === 'edit' && selectedEntry) {
      setSpreadMode('reading');
    } else {
      setSpreadMode('toc');
    }
    setThinking(false);
  }, [formMode, selectedEntry]);

  const selectEntry = async (entry: JournalEntry) => {
    const fromIndex = selectedIndex;
    const toIndex = entries.findIndex((e) => e.id === entry.id);
    const direction: PageTurnDirection =
      fromIndex >= 0 && toIndex < fromIndex ? 'back' : 'forward';

    setTurnDirection(direction);
    if (spreadMode === 'reading' && selectedEntry && selectedEntry.id !== entry.id) {
      setPhase('turning');
      setSelectedEntry(entry);
      setSpreadMode('reading');
      await sleep(reducedMotion ? 140 : 420);
      setPhase('open');
    } else {
      setSelectedEntry(entry);
      setSpreadMode('reading');
    }
  };

  const goAdjacent = useCallback(
    async (dir: PageTurnDirection) => {
      if (selectedIndex < 0) return;
      const nextIndex = dir === 'forward' ? selectedIndex + 1 : selectedIndex - 1;
      const next = entries[nextIndex];
      if (!next) return;
      setTurnDirection(dir);
      setPhase('turning');
      setSelectedEntry(next);
      setSpreadMode('reading');
      await sleep(reducedMotion ? 140 : 420);
      setPhase('open');
    },
    [entries, reducedMotion, selectedIndex],
  );

  const handleSave = async () => {
    const ok = await onSave();
    if (!ok) return;

    setPhase('saving');
    setSavedFlash(true);
    await sleep(reducedMotion ? 220 : 950);
    setSavedFlash(false);
    await runClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (spreadMode === 'writing') {
        e.preventDefault();
        cancelWrite();
        return;
      }
      if (isOpenSurface) {
        e.preventDefault();
        void closeBook();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spreadMode, isOpenSurface, closeBook, cancelWrite]);

  useEffect(() => {
    if (spreadMode !== 'writing') {
      setThinking(false);
      return;
    }
    const t = window.setTimeout(() => setThinking(true), 5000);
    return () => window.clearTimeout(t);
  }, [spreadMode, formValues.title, formValues.content, formValues.mood]);

  useEffect(() => {
    if (!lite || spreadMode !== 'reading' || !isOpenSurface) return;
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) void goAdjacent('forward');
      else void goAdjacent('back');
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [lite, spreadMode, isOpenSurface, goAdjacent]);

  const pandaPhase: JournalPandaPhase = (() => {
    if (phase === 'opening') return 'opening';
    if (phase === 'closing') return 'closing';
    if (phase === 'saving') return 'saving';
    if (phase === 'closed') return hovering ? 'hover' : 'closed';
    if (spreadMode === 'writing') return thinking ? 'thinking' : 'writing';
    if (spreadMode === 'reading') return 'reading';
    return 'closed';
  })();

  const rightPage = (() => {
    if (spreadMode === 'writing') {
      return (
        <JournalWritePage
          mode={formMode}
          values={formValues}
          submitting={formSubmitting}
          onChange={onFormChange}
          onSave={() => void handleSave()}
          onCancel={cancelWrite}
          onTypingActivity={() => setThinking(false)}
        />
      );
    }
    if (spreadMode === 'reading' && selectedEntry) {
      return (
        <JournalPageTurn pageKey={selectedEntry.id} direction={turnDirection} lite={lite}>
          <JournalEntryPage
            entry={selectedEntry}
            onEdit={() => startEdit(selectedEntry)}
            onDelete={() => onRequestDelete(selectedEntry)}
            onBackToToc={() => {
              setSelectedEntry(null);
              setSpreadMode('toc');
            }}
            onPrev={() => void goAdjacent('back')}
            onNext={() => void goAdjacent('forward')}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex >= 0 && selectedIndex < entries.length - 1}
          />
        </JournalPageTurn>
      );
    }
    return (
      <div className="flex h-full flex-col items-start justify-center">
        <p className="font-ui text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zen-fg-subtle">
          This page
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-[-0.02em] text-zen-fg">
          Ready when you are
        </h2>
        <p className="mt-2 max-w-sm font-ui text-sm leading-relaxed text-zen-fg-muted">
          Choose a page from the contents, or begin a new reflection here.
        </p>
        <ZenButton type="button" className="mt-6 min-h-11" onClick={startWrite}>
          + Write a new reflection
        </ZenButton>
      </div>
    );
  })();

  return (
    <section className={cn('relative w-full', className)}>
      <div className="mb-8 text-center md:mb-10 md:text-left">
        <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-zen-secondary md:text-[0.75rem]">
          My Journal
        </p>
        <h1
          className={cn(
            'mt-2 font-display font-medium',
            'text-[1.875rem] leading-[1.15] tracking-[-0.02em]',
            'sm:text-[2.5rem] md:text-[3rem]',
          )}
        >
          Your private space
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-ui text-[0.9375rem] leading-relaxed opacity-80 md:mx-0">
          Open the book. Write things down. You don&apos;t have to make them perfect.
        </p>
      </div>

      {loadError ? (
        <div className="mb-6 rounded-zen-xl border border-zen-danger/20 bg-zen-danger-soft/40 px-5 py-4 text-center">
          <p className="font-ui text-sm text-zen-danger">
            We couldn&apos;t load your reflections.
          </p>
          {onRetry ? (
            <ZenButton variant="outline" className="mt-4" onClick={onRetry}>
              Try again
            </ZenButton>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          'relative mx-auto flex w-full max-w-[1100px] flex-col items-center',
          !lite && 'md:flex-row md:items-end md:justify-center md:gap-6',
        )}
      >
        {!lite ? (
          <div className="mb-4 hidden shrink-0 md:mb-8 md:block">
            <JournalPanda phase={pandaPhase} />
          </div>
        ) : null}

        <div className="relative w-full min-w-0 flex-1">
          <JournalSpread
            lidOpen={lidOpen}
            pagesVisible={pagesVisible}
            expanded={expanded}
            coverOpaque={coverOpaque}
            hovering={hovering}
            onHoverChange={setHovering}
            onOpen={() => void openBook()}
            lite={lite}
            left={
              <JournalContents
                entries={entries}
                loading={loading}
                selectedId={selectedEntry?.id}
                onSelect={(e) => void selectEntry(e)}
                onWrite={startWrite}
              />
            }
            right={rightPage}
          />

          {isOpenSurface || phase === 'opening' || phase === 'closing' ? (
            <div className="mt-4 flex justify-center">
              <ZenButton
                type="button"
                variant="ghost"
                className="min-h-11"
                onClick={() => void closeBook()}
                disabled={phase === 'saving' || phase === 'closing' || spreadMode === 'writing'}
              >
                Close journal
              </ZenButton>
            </div>
          ) : null}

          {lite && (isOpenSurface || phase === 'opening') ? (
            <div className="mt-3 flex justify-center">
              <JournalPanda phase={pandaPhase} lite className="!relative" />
            </div>
          ) : null}

          {lite && !expanded ? (
            <div className="mt-2 flex justify-center">
              <JournalPanda phase={pandaPhase} lite className="!relative" />
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {savedFlash ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center font-ui text-sm text-zen-fg-muted"
            aria-live="polite"
          >
            Kept safely.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
