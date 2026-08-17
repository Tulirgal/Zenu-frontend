'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatPresentation } from './mapChatSentiment';

export type ChatPhase = 'idle' | 'typing' | 'paused' | 'processing' | 'responding';
export type { ChatPresentation };

const PAUSE_MS = 2000;
const LONG_WAIT_MS = 2500;

const IDLE_PRESENTATION: ChatPresentation = {
  emotion: 'calm',
  animation: 'breathe',
};

/**
 * UI-only chat phase machine — separate from message list.
 * Owns typing-pause (2s) and long-processing (2.5s) timers.
 */
export function useChatPhase() {
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const [longWait, setLongWait] = useState(false);
  const [held, setHeld] = useState<ChatPresentation>(IDLE_PRESENTATION);
  const [inputFocused, setInputFocused] = useState(false);

  const pauseTimerRef = useRef<number | null>(null);
  const longWaitTimerRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  const focusedRef = useRef(false);
  const inputNonEmptyRef = useRef(false);

  phaseRef.current = phase;

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current != null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const clearLongWaitTimer = useCallback(() => {
    if (longWaitTimerRef.current != null) {
      window.clearTimeout(longWaitTimerRef.current);
      longWaitTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearPauseTimer();
    clearLongWaitTimer();
  }, [clearPauseTimer, clearLongWaitTimer]);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const schedulePause = useCallback(() => {
    clearPauseTimer();
    pauseTimerRef.current = window.setTimeout(() => {
      pauseTimerRef.current = null;
      if (
        focusedRef.current &&
        inputNonEmptyRef.current &&
        phaseRef.current === 'typing'
      ) {
        setPhase('paused');
      }
    }, PAUSE_MS);
  }, [clearPauseTimer]);

  const onFocus = useCallback(() => {
    focusedRef.current = true;
    setInputFocused(true);
    if (phaseRef.current === 'processing') return;
    setPhase('typing');
    if (inputNonEmptyRef.current) schedulePause();
  }, [schedulePause]);

  const onBlur = useCallback(() => {
    focusedRef.current = false;
    setInputFocused(false);
    clearPauseTimer();
    if (phaseRef.current === 'typing' || phaseRef.current === 'paused') {
      setPhase('idle');
    }
  }, [clearPauseTimer]);

  const onInputChange = useCallback(
    (value: string) => {
      const nonEmpty = value.trim().length > 0;
      inputNonEmptyRef.current = nonEmpty;
      if (phaseRef.current === 'processing') return;
      setPhase('typing');
      if (nonEmpty && focusedRef.current) {
        schedulePause();
      } else {
        clearPauseTimer();
      }
    },
    [schedulePause, clearPauseTimer],
  );

  const beginProcessing = useCallback(() => {
    clearAllTimers();
    inputNonEmptyRef.current = false;
    setLongWait(false);
    setPhase('processing');
    longWaitTimerRef.current = window.setTimeout(() => {
      longWaitTimerRef.current = null;
      if (phaseRef.current === 'processing') {
        setLongWait(true);
      }
    }, LONG_WAIT_MS);
  }, [clearAllTimers]);

  const beginResponding = useCallback(
    (presentation: ChatPresentation) => {
      clearLongWaitTimer();
      setLongWait(false);
      setHeld(presentation);
      setPhase('responding');
    },
    [clearLongWaitTimer],
  );

  const resetToIdle = useCallback(() => {
    clearAllTimers();
    setLongWait(false);
    setHeld(IDLE_PRESENTATION);
    setPhase('idle');
  }, [clearAllTimers]);

  const presentation: ChatPresentation = (() => {
    switch (phase) {
      case 'processing':
        return longWait
          ? { emotion: 'calm', animation: 'breathe' }
          : { emotion: 'thinking', animation: 'tilt' };
      case 'paused':
        return { emotion: 'curious', animation: 'tilt' };
      case 'typing':
        return { emotion: 'listening', animation: 'attentive' };
      case 'responding':
        return held;
      case 'idle':
      default:
        return IDLE_PRESENTATION;
    }
  })();

  const showThoughtCloud = phase === 'processing' && !longWait;

  return {
    phase,
    longWait,
    inputFocused,
    presentation,
    showThoughtCloud,
    onFocus,
    onBlur,
    onInputChange,
    beginProcessing,
    beginResponding,
    resetToIdle,
    clearAllTimers,
  };
}
