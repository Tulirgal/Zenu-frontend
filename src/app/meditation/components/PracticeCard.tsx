'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { Panda } from '@/components/panda/Panda';
import { ZenButton } from '@/components/zen';
import { apiClient } from '@/lib/apiClient';
import { resolveGuidedAudioUrl } from '@/lib/meditationAudio';
import { trackEngagement } from '@/lib/signals';
import type { Meditation } from '@/lib/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { formatPracticeTime } from './practiceContent';

type Phase = 'idle' | 'active' | 'completed';

export function PracticeCard({ session }: { session: Meditation }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [settleWhisper, setSettleWhisper] = useState(false);
  const startedRef = useRef(false);
  const startTime = useRef(Date.now());
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const audioUrl = resolveGuidedAudioUrl(session.title, session.audioUrl);
  const category = session.category || 'Relaxation';
  const description =
    session.description?.trim() ||
    'A guided practice for releasing physical tension.';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setPhase('completed');
      trackEngagement(
        'meditation_jpmr',
        'completed',
        Math.round((Date.now() - startTime.current) / 1000),
      );
      apiClient
        .logMeditationSession({
          meditationId: session.id,
          durationSeconds: Math.round(audio.duration || session.durationMinutes * 60),
        })
        .catch(console.error);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [session.id, session.durationMinutes]);

  useEffect(
    () => () => {
      if (whisperTimer.current) clearTimeout(whisperTimer.current);
    },
    [],
  );

  const markStarted = () => {
    if (!startedRef.current) {
      trackEngagement('meditation_jpmr', 'opened');
      startedRef.current = true;
      startTime.current = Date.now();
      setSettleWhisper(true);
      if (whisperTimer.current) clearTimeout(whisperTimer.current);
      whisperTimer.current = setTimeout(() => setSettleWhisper(false), 2200);
    }
  };

  const beginPractice = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setPhase('active');
    markStarted();
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    markStarted();
    try {
      await audio.play();
      setPlaying(true);
      setPhase('active');
    } catch {
      setPlaying(false);
    }
  };

  const replay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    setPhase('active');
    markStarted();
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  };

  const meta = `${session.durationMinutes} min · ${category} · Beginner`;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-zen-2xl border border-zen-border-soft',
        'bg-[hsl(40,40%,99%)] shadow-[0_12px_40px_-28px_rgba(40,30,60,0.35)]',
      )}
    >
      <audio ref={audioRef} src={audioUrl || ''} preload="metadata" />

      {/* Soft atmospheric wash — not a purple slab */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 18%, hsl(262 40% 72% / 0.16), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, hsl(200 50% 70% / 0.08), transparent 65%)',
        }}
      />

      <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
        <AnimatePresence mode="wait">
          {phase === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.35 }}
              className="mx-auto flex max-w-lg flex-col items-center text-center"
            >
              <div className="pointer-events-none">
                <Panda
                  emotion="calm"
                  activity={null}
                  animation="idle"
                  mode="responsive"
                  size={88}
                  label="Panda companion"
                />
              </div>
              <p className="mt-3 font-ui text-[0.875rem] text-zen-fg-muted" aria-live="polite">
                Take a quiet moment.
              </p>
              <p className="mt-1 font-ui text-[0.8125rem] text-zen-fg-subtle">Take your time.</p>

              <h2 className="mt-6 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-zen-fg sm:text-[1.75rem] md:text-[2rem]">
                {session.title}
              </h2>
              <p className="mt-3 max-w-md font-ui text-[0.9375rem] leading-relaxed text-zen-fg-muted md:text-[1rem]">
                {description}
              </p>
              <p className="mt-2 font-ui text-[0.8125rem] text-zen-fg-subtle">{meta}</p>

              <ZenButton
                type="button"
                size="lg"
                className="mt-8 min-h-12 px-8"
                onClick={() => void beginPractice()}
                disabled={!audioUrl}
              >
                Begin practice
                <span aria-hidden="true">→</span>
              </ZenButton>
              {!audioUrl ? (
                <p className="mt-3 font-ui text-sm text-zen-warning" role="status">
                  Audio is unavailable for this session.
                </p>
              ) : null}
            </motion.div>
          ) : null}

          {phase === 'active' ? (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.4 }}
              className="mx-auto flex max-w-lg flex-col items-center text-center"
            >
              <div className="relative flex h-[11rem] w-full items-center justify-center sm:h-[13rem]">
                {/* Breathing orb */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 160,
                    height: 160,
                    background:
                      'radial-gradient(circle, hsl(262 45% 70% / 0.35) 0%, hsl(220 50% 75% / 0.12) 45%, transparent 70%)',
                  }}
                  animate={
                    playing && !reducedMotion
                      ? { scale: [1, 1.06, 1], opacity: [0.55, 0.85, 0.55] }
                      : { scale: 1, opacity: 0.5 }
                  }
                  transition={
                    playing && !reducedMotion
                      ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
                      : { type: 'spring', bounce: 0, duration: 0.5 }
                  }
                  aria-hidden="true"
                />
                <div className="pointer-events-none relative z-[1]">
                  <Panda
                    emotion="calm"
                    activity="meditating"
                    animation={playing && !reducedMotion ? 'breathe' : 'idle'}
                    mode="responsive"
                    size={100}
                    label="Meditating Panda"
                  />
                </div>
              </div>

              <div className="min-h-[1.25rem]" aria-live="polite">
                {settleWhisper ? (
                  <p className="font-ui text-[0.8125rem] text-zen-fg-muted">Let&apos;s settle in.</p>
                ) : null}
              </div>

              <h2 className="mt-2 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-zen-fg sm:text-[1.75rem] md:text-[2rem]">
                {session.title}
              </h2>
              <p className="mt-2 font-ui text-[0.8125rem] text-zen-fg-subtle">{meta}</p>

              <ZenButton
                type="button"
                variant="secondary"
                size="lg"
                className="mt-6 min-h-12 min-w-[9rem]"
                onClick={() => void togglePlay()}
                aria-label={playing ? 'Pause practice' : 'Resume practice'}
              >
                {playing ? (
                  <>
                    <Pause className="h-4 w-4" aria-hidden="true" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Resume
                  </>
                )}
              </ZenButton>

              <div className="mt-8 w-full max-w-md">
                <div
                  role="slider"
                  tabIndex={0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Practice progress"
                  className="h-1.5 w-full cursor-pointer rounded-full bg-zen-border-soft"
                  onClick={handleSeek}
                  onKeyDown={(e) => {
                    const audio = audioRef.current;
                    if (!audio || !duration) return;
                    if (e.key === 'ArrowRight') {
                      audio.currentTime = Math.min(duration, audio.currentTime + 5);
                    } else if (e.key === 'ArrowLeft') {
                      audio.currentTime = Math.max(0, audio.currentTime - 5);
                    }
                  }}
                >
                  <div
                    className="relative h-full rounded-full bg-zen-secondary/70"
                    style={{ width: `${progress}%` }}
                  >
                    <span
                      className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full border border-white bg-zen-secondary shadow-sm"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-between font-ui text-[0.75rem] text-zen-fg-subtle">
                  <span>{formatPracticeTime(currentTime)}</span>
                  <span>{formatPracticeTime(duration)}</span>
                </div>
              </div>
            </motion.div>
          ) : null}

          {phase === 'completed' ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.35 }}
              className="mx-auto flex max-w-lg flex-col items-center text-center"
            >
              <div className="pointer-events-none">
                <Panda
                  emotion="happy"
                  activity={null}
                  animation="attentive"
                  mode="responsive"
                  size={96}
                  label="Panda companion"
                />
              </div>
              <p className="mt-4 font-ui text-[0.9375rem] text-zen-fg-muted" aria-live="polite">
                Nice. You gave yourself a few quiet minutes.
              </p>
              <h2 className="mt-4 font-display text-[1.375rem] text-zen-fg md:text-[1.5rem]">
                {session.title}
              </h2>
              <ZenButton
                type="button"
                variant="outline"
                size="lg"
                className="mt-6 min-h-12"
                onClick={() => void replay()}
              >
                Practice again
              </ZenButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
