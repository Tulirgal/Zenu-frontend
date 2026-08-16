'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
} from 'lucide-react';
import { Panda } from '@/components/panda/Panda';
import { ZenBreathingCircle, ZenButton } from '@/components/zen';
import type { BreathingPattern } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  formatSessionTime,
  phaseInstruction,
} from './patternVisual';

type PlayerPhase = 'ready' | 'active' | 'complete';

export function BreathingPlayer({
  isOpen,
  pattern,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  pattern: BreathingPattern;
  onClose: () => void;
  onComplete?: (durationSeconds: number) => void;
}) {
  const [uiPhase, setUiPhase] = useState<PlayerPhase>('ready');
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(pattern.defaultMinutes);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState('Inhale');
  const [remaining, setRemaining] = useState(pattern.steps[0] ?? 4);
  const [whisper, setWhisper] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedDurationRef = useRef<number>(0);
  const completionLoggedRef = useRef(false);
  const midWhisperDone = useRef(false);
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cycleDuration = pattern.steps.reduce((a, b) => a + b, 0) || 1;
  const totalDuration = duration * 60;
  const patternId = pattern.id;

  const flashWhisper = useCallback((text: string, ms = 2200) => {
    setWhisper(text);
    if (whisperTimer.current) clearTimeout(whisperTimer.current);
    whisperTimer.current = setTimeout(() => setWhisper(null), ms);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setUiPhase('ready');
    setElapsedTime(0);
    setIsPaused(true);
    setIsComplete(false);
    setPhase('Inhale');
    setRemaining(pattern.steps[0] ?? 4);
    setDuration(pattern.defaultMinutes);
    setSpeed(1);
    startTimeRef.current = Date.now();
    pausedDurationRef.current = 0;
    completionLoggedRef.current = false;
    midWhisperDone.current = false;
    setWhisper(null);
  }, [isOpen, patternId, pattern.defaultMinutes, pattern.steps]);

  useEffect(
    () => () => {
      if (whisperTimer.current) clearTimeout(whisperTimer.current);
    },
    [],
  );

  const playChime = useCallback(
    (type: 'start' | 'end') => {
      if (isMuted) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = type === 'start' ? 440 : 330;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    },
    [isMuted],
  );

  useEffect(() => {
    if (isPaused || !isOpen || isComplete || uiPhase !== 'active') return;
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current - pausedDurationRef.current) / 1000);
      setElapsedTime(elapsed);

      if (!midWhisperDone.current && elapsed > totalDuration * 0.45 && elapsed < totalDuration * 0.55) {
        midWhisperDone.current = true;
        flashWhisper("You're doing well.");
      }

      if (elapsed >= totalDuration) {
        setIsComplete(true);
        setIsPaused(true);
        setUiPhase('complete');
        playChime('end');
        flashWhisper('You gave yourself a few quiet minutes.', 3200);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isPaused, isOpen, totalDuration, isComplete, uiPhase, playChime, flashWhisper]);

  useEffect(() => {
    if (isComplete && !completionLoggedRef.current) {
      completionLoggedRef.current = true;
      onComplete?.(totalDuration);
    }
  }, [isComplete, onComplete, totalDuration]);

  useEffect(() => {
    if (isPaused && uiPhase === 'active') {
      const pauseStart = Date.now();
      return () => {
        pausedDurationRef.current += Date.now() - pauseStart;
      };
    }
  }, [isPaused, uiPhase]);

  const begin = () => {
    setUiPhase('active');
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedDurationRef.current = 0;
    playChime('start');
    flashWhisper('Nice and slow.');
  };

  const togglePlayPause = () => {
    if (uiPhase === 'ready') {
      begin();
      return;
    }
    if (isComplete) return;
    setIsPaused((p) => {
      const next = !p;
      if (!next) playChime('start');
      return next;
    });
  };

  const skipCycle = () => {
    const cyclesElapsed = Math.floor(elapsedTime / cycleDuration);
    const nextCycleTime = (cyclesElapsed + 1) * cycleDuration;
    setElapsedTime(Math.min(nextCycleTime, totalDuration));
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length]);
  };

  const cycleDurationPreset = () => {
    const presets = [3, 5, 10];
    const idx = presets.indexOf(duration);
    setDuration(presets[(idx >= 0 ? idx + 1 : 0) % presets.length]);
  };

  const resetSession = () => {
    setUiPhase('ready');
    setIsPaused(true);
    setIsComplete(false);
    setElapsedTime(0);
    setPhase('Inhale');
    setRemaining(pattern.steps[0] ?? 4);
    startTimeRef.current = Date.now();
    pausedDurationRef.current = 0;
    completionLoggedRef.current = false;
    midWhisperDone.current = false;
  };

  if (!isOpen) return null;

  const remainingSession = Math.max(0, totalDuration - elapsedTime);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col overflow-hidden',
        'bg-[hsl(40,40%,99%)]',
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`${pattern.name} breathing session`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 800px 500px at 50% 30%, hsl(262 40% 72% / 0.14), transparent 65%), radial-gradient(ellipse 600px 400px at 20% 80%, hsl(200 55% 70% / 0.1), transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 sm:px-6 md:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="pointer-events-none shrink-0">
            <Panda
              emotion="calm"
              activity="breathing"
              animation={uiPhase === 'active' && !isPaused ? 'breathe' : 'idle'}
              mode="responsive"
              size={56}
              label="Panda companion"
            />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg tracking-[-0.01em] text-zen-fg md:text-xl">
              {pattern.name}
            </h2>
            <p className="font-ui text-sm text-zen-fg-muted">{duration} min session</p>
            <div className="mt-0.5 min-h-[1.1rem]" aria-live="polite">
              {whisper ? (
                <p className="font-ui text-xs text-zen-secondary">{whisper}</p>
              ) : null}
            </div>
          </div>
        </div>
        <ZenButton
          type="button"
          variant="ghost"
          size="icon-md"
          aria-label="Exit session"
          onClick={onClose}
          className="shrink-0"
        >
          <X className="h-5 w-5" />
        </ZenButton>
      </div>

      {/* Body */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-4">
        {uiPhase === 'complete' ? (
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Panda
              emotion="happy"
              activity={null}
              animation="attentive"
              mode="responsive"
              size={96}
              label="Panda companion"
            />
            <h3 className="mt-4 font-display text-2xl text-zen-fg md:text-3xl">Well done.</h3>
            <p className="mt-2 font-ui text-[0.9375rem] text-zen-fg-muted">
              You gave yourself a few quiet minutes.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <ZenButton type="button" size="lg" onClick={onClose}>
                Done
              </ZenButton>
              <ZenButton type="button" variant="outline" size="lg" onClick={onClose}>
                Try another practice
              </ZenButton>
            </div>
          </div>
        ) : (
          <>
            <p className="font-ui text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-zen-secondary">
              {phase}
            </p>
            <p className="mt-1 font-ui text-sm text-zen-fg-muted md:text-base">
              {uiPhase === 'ready' ? 'When you are ready' : phaseInstruction(phase)}
            </p>

            <div className="relative mt-2 h-[min(52vh,420px)] w-full max-w-xl">
              <ZenBreathingCircle
                pattern={pattern.steps}
                cycleDuration={cycleDuration}
                isPaused={isPaused || uiPhase !== 'active'}
                speed={speed}
                hideLabels
                onPhaseChange={(next) => setPhase(next)}
                onPhaseTick={(_p, rem) => setRemaining(rem)}
              />
            </div>

            <p
              className="mt-1 font-display text-[2.75rem] tabular-nums tracking-tight text-zen-fg md:text-[3.25rem]"
              aria-live="polite"
            >
              {String(Math.max(0, remaining)).padStart(2, '0')}
            </p>

            {uiPhase === 'ready' ? (
              <ZenButton type="button" size="lg" className="mt-6 min-h-12 px-8" onClick={begin}>
                Begin
              </ZenButton>
            ) : null}
          </>
        )}
      </div>

      {/* Footer controls */}
      {uiPhase !== 'complete' ? (
        <div className="relative z-10 border-t border-zen-border-soft bg-white/70 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:px-6 md:px-10">
          <div className="mx-auto flex max-w-xl items-center justify-between font-ui text-sm text-zen-fg-muted">
            <span>{formatSessionTime(remainingSession)} remaining</span>
            <span>{formatSessionTime(totalDuration)} total</span>
          </div>

          <div className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 sm:gap-3">
            <ZenButton
              type="button"
              variant="outline"
              size="icon-md"
              aria-label={isMuted ? 'Unmute chimes' : 'Mute chimes'}
              onClick={() => setIsMuted((m) => !m)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </ZenButton>

            <ZenButton
              type="button"
              size="icon-lg"
              className="h-14 w-14 rounded-full"
              aria-label={uiPhase === 'ready' || isPaused ? 'Resume' : 'Pause'}
              onClick={togglePlayPause}
              disabled={isComplete}
            >
              {uiPhase === 'ready' || isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </ZenButton>

            <ZenButton
              type="button"
              variant="outline"
              size="icon-md"
              aria-label="Reset session"
              onClick={resetSession}
            >
              <RotateCcw className="h-4 w-4" />
            </ZenButton>

            <ZenButton
              type="button"
              variant="ghost"
              size="icon-md"
              aria-label="Skip cycle"
              onClick={skipCycle}
              disabled={uiPhase !== 'active' || isComplete}
              className="hidden sm:inline-flex text-zen-fg-subtle"
            >
              <SkipForward className="h-4 w-4" />
            </ZenButton>

            <ZenButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Change speed"
              onClick={cycleSpeed}
              className="hidden text-zen-fg-subtle sm:inline-flex"
            >
              {speed}x
            </ZenButton>

            <ZenButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Change duration"
              onClick={cycleDurationPreset}
              className="hidden text-zen-fg-subtle sm:inline-flex"
            >
              {duration}m
            </ZenButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
