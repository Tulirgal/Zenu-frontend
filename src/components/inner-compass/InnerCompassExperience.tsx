'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  emotions,
  tertiaryData,
  type PrimaryEmotion,
  type SecondaryEmotion,
  type TertiaryEmotion,
} from './emotionData';
import { CompassProgress } from './CompassProgress';
import { EmotionWheel } from './EmotionWheel';
import { EmotionOptionList } from './EmotionOptionList';
import { CompassResult } from './CompassResult';
import { CompassWhisper } from './CompassWhisper';
import { OPTION_FOCUS, PRIMARY_LABEL, primaryText } from './emotionTokens';

type FlowView = 'primary' | 'secondary' | 'tertiary' | 'complete';

const WHISPER = {
  step1: "Take your time. There isn't a wrong answer.",
  afterPrimary: "Okay... let's look a little closer.",
  step2: 'What part of this feels closest?',
  afterSecondary: "We're getting closer.",
  step3a: "You don't have to explain it perfectly.",
  step3b: "That's okay. You can sit with this.",
} as const;

function progressStep(view: FlowView): 1 | 2 | 3 {
  if (view === 'primary') return 1;
  if (view === 'complete') return 3;
  return 2;
}

function headingFor(view: FlowView): { title: string; support: string } {
  if (view === 'primary') {
    return {
      title: 'How are you feeling right now?',
      support: "There's no right or wrong. Just be real with yourself.",
    };
  }
  if (view === 'secondary' || view === 'tertiary') {
    return {
      title: 'What feels closest?',
      support: 'Take your time — choose what resonates most.',
    };
  }
  return {
    title: 'What might help right now?',
    support: "You're not alone. Let's take a gentle next step.",
  };
}

export function InnerCompassExperience({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [viewState, setViewState] = useState<FlowView>('primary');
  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryEmotion | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<SecondaryEmotion | null>(null);
  const [selectedTertiary, setSelectedTertiary] = useState<TertiaryEmotion | null>(null);
  const [whisper, setWhisper] = useState<string | null>(WHISPER.step1);
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWhisperTimer = () => {
    if (whisperTimer.current) {
      clearTimeout(whisperTimer.current);
      whisperTimer.current = null;
    }
  };

  useEffect(() => () => clearWhisperTimer(), []);

  const scheduleWhisper = (next: string | null, delayMs: number) => {
    clearWhisperTimer();
    whisperTimer.current = setTimeout(() => {
      setWhisper(next);
      whisperTimer.current = null;
    }, reducedMotion ? Math.min(delayMs, 400) : delayMs);
  };

  const accent = selectedPrimary;

  const handlePrimaryClick = (emotion: PrimaryEmotion) => {
    setSelectedPrimary(emotion);
    setSelectedSecondary(null);
    setSelectedTertiary(null);
    setWhisper(WHISPER.afterPrimary);
    setViewState('secondary');
    scheduleWhisper(WHISPER.step2, 1600);
  };

  const handleSecondaryClick = (emotion: SecondaryEmotion) => {
    setSelectedSecondary(emotion);
    setSelectedTertiary(null);
    setWhisper(WHISPER.afterSecondary);
    setViewState('tertiary');
    scheduleWhisper(null, 1700);
  };

  const handleTertiaryClick = (emotion: TertiaryEmotion) => {
    setSelectedTertiary(emotion);
    setWhisper(emotion.length % 2 === 0 ? WHISPER.step3a : WHISPER.step3b);
    setViewState('complete');
  };

  const handleReset = () => {
    clearWhisperTimer();
    setViewState('primary');
    setSelectedPrimary(null);
    setSelectedSecondary(null);
    setSelectedTertiary(null);
    setWhisper(WHISPER.step1);
  };

  const handleBack = () => {
    clearWhisperTimer();
    if (viewState === 'complete') {
      setViewState('tertiary');
      setWhisper(null);
      return;
    }
    if (viewState === 'tertiary') {
      setSelectedTertiary(null);
      setViewState('secondary');
      setWhisper(WHISPER.step2);
      return;
    }
    if (viewState === 'secondary') {
      setSelectedSecondary(null);
      setSelectedPrimary(null);
      setViewState('primary');
      setWhisper(WHISPER.step1);
    }
  };

  const heading = headingFor(viewState);
  const step = progressStep(viewState);

  const secondaryOptions = useMemo(() => {
    if (!selectedPrimary) return [];
    return Object.keys(emotions[selectedPrimary]);
  }, [selectedPrimary]);

  const tertiaryOptions = useMemo(() => {
    if (!selectedPrimary || !selectedSecondary) return [];
    return emotions[selectedPrimary][selectedSecondary] ?? [];
  }, [selectedPrimary, selectedSecondary]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="mb-5 sm:mb-7 md:mb-10 flex flex-col gap-3.5 sm:gap-5 md:gap-6 max-w-3xl">
        {viewState !== 'complete' ? (
          <>
            <CompassProgress step={step} accent={accent} />
            <div>
              <p
                className={cn(
                  'font-ui text-[0.8125rem] md:text-sm font-medium mb-1.5 sm:mb-2',
                  accent ? primaryText(accent) : 'text-zen-secondary',
                )}
              >
                Inner Compass
              </p>
              <h1 className="font-display text-[1.5rem] sm:text-[1.85rem] md:text-[2.25rem] leading-[1.15] tracking-tight font-semibold text-zen-fg">
                {heading.title}
              </h1>
              <p className="font-ui text-[0.8125rem] sm:text-[0.875rem] md:text-[1.0625rem] text-zen-fg-muted mt-2 sm:mt-2.5 md:mt-3 max-w-xl leading-relaxed">
                {heading.support}
              </p>
            </div>
          </>
        ) : (
          <CompassProgress step={3} accent={accent} className="mb-1" />
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewState}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
        >
          {viewState === 'primary' ? (
            <div className="flex flex-col items-center gap-4 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)] lg:items-center lg:gap-10">
              <EmotionWheel selected={selectedPrimary} onSelect={handlePrimaryClick} />
              <div className="w-full max-w-sm lg:max-w-xs">
                <CompassWhisper message={whisper} accent={accent} />
                <p className="hidden lg:block font-ui text-sm text-zen-fg-muted leading-relaxed mt-4">
                  Choose the emotional family that feels most true. You can refine it in the next
                  step.
                </p>
              </div>
            </div>
          ) : null}

          {viewState === 'secondary' && selectedPrimary ? (
            <div className="max-w-2xl">
              <button
                type="button"
                onClick={handleBack}
                className={cn(
                  'font-ui text-sm text-zen-fg-muted hover:text-zen-fg mb-3.5 sm:mb-5 min-h-11 inline-flex items-center rounded-sm',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  OPTION_FOCUS[selectedPrimary],
                )}
              >
                ← back
              </button>
              <CompassWhisper
                message={whisper}
                accent={selectedPrimary}
                className="justify-start mb-3 sm:mb-4"
              />
              <p className={cn('font-ui text-sm mb-3 capitalize font-medium', primaryText(selectedPrimary))}>
                {PRIMARY_LABEL[selectedPrimary]}
              </p>
              <EmotionOptionList
                options={secondaryOptions}
                onSelect={handleSecondaryClick}
                primary={selectedPrimary}
              />
            </div>
          ) : null}

          {viewState === 'tertiary' && selectedPrimary && selectedSecondary ? (
            <div className="max-w-2xl">
              <button
                type="button"
                onClick={handleBack}
                className={cn(
                  'font-ui text-sm text-zen-fg-muted hover:text-zen-fg mb-3.5 sm:mb-5 min-h-11 inline-flex items-center rounded-sm',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  OPTION_FOCUS[selectedPrimary],
                )}
              >
                ← back
              </button>
              <CompassWhisper
                message={whisper}
                accent={selectedPrimary}
                className="justify-start mb-3 sm:mb-4"
              />
              <p className={cn('font-ui text-sm mb-3 capitalize font-medium', primaryText(selectedPrimary))}>
                {PRIMARY_LABEL[selectedPrimary]} → {selectedSecondary}
              </p>
              <EmotionOptionList
                options={tertiaryOptions}
                selected={selectedTertiary}
                onSelect={handleTertiaryClick}
                primary={selectedPrimary}
              />
            </div>
          ) : null}

          {viewState === 'complete' &&
          selectedPrimary &&
          selectedSecondary &&
          selectedTertiary ? (
            <CompassResult
              primary={selectedPrimary}
              secondary={selectedSecondary}
              tertiary={selectedTertiary}
              data={tertiaryData[selectedTertiary]}
              whisper={whisper}
              onReset={handleReset}
              onBack={handleBack}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
