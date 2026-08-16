'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Smile, Sparkles, Star, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logMood } from '@/lib/signals';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { PandaEmotion } from '@/components/panda/types';

const MOODS = [
  {
    score: 1,
    label: 'Low',
    Icon: Cloud,
    emotion: 'sad' as PandaEmotion,
    color: 'text-zen-emotion-sadness',
    soft: 'bg-zen-emotion-sadness-soft',
    glow: 'hsl(var(--zen-emotion-sadness) / 0.35)',
  },
  {
    score: 2,
    label: 'Okay',
    Icon: Smile,
    emotion: 'neutral' as PandaEmotion,
    color: 'text-zen-emotion-okay',
    soft: 'bg-zen-emotion-okay-soft',
    glow: 'hsl(var(--zen-emotion-okay) / 0.35)',
  },
  {
    score: 3,
    label: 'Calm',
    Icon: Sparkles,
    emotion: 'calm' as PandaEmotion,
    color: 'text-zen-emotion-calm',
    soft: 'bg-zen-emotion-calm-soft',
    glow: 'hsl(var(--zen-emotion-calm) / 0.35)',
  },
  {
    score: 4,
    label: 'Good',
    Icon: Sun,
    emotion: 'happy' as PandaEmotion,
    color: 'text-zen-emotion-joy',
    soft: 'bg-zen-emotion-joy-soft',
    glow: 'hsl(var(--zen-emotion-joy) / 0.38)',
  },
  {
    score: 5,
    label: 'Great',
    Icon: Star,
    emotion: 'excited' as PandaEmotion,
    color: 'text-zen-emotion-great',
    soft: 'bg-zen-emotion-great-soft',
    glow: 'hsl(var(--zen-emotion-great) / 0.35)',
  },
] as const;

export interface ZenMoodSelectorProps {
  className?: string;
  onSelect?: (score: number, meta: { emotion: PandaEmotion; glow: string }) => void;
  compact?: boolean;
}

export function ZenMoodSelector({ className, onSelect, compact = false }: ZenMoodSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const handleSelect = (score: number) => {
    const mood = MOODS.find((m) => m.score === score)!;
    setSelected(score);
    setSaved(true);
    void logMood(score);
    onSelect?.(score, { emotion: mood.emotion, glow: mood.glow });
  };

  return (
    <div
      className={cn(
        'relative zen-home-section',
        !compact &&
          'rounded-zen-xl border border-zen-border-soft/55 bg-zen-surface/90 px-3 py-3.5 shadow-[0_6px_18px_-14px_rgba(30,41,90,0.1)] md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none',
        className,
      )}
    >
      {!compact && (
        <p className="font-ui text-[0.8125rem] text-zen-fg-muted mb-3 md:mb-3.5">
          {saved ? 'Thanks for checking in' : 'How are you feeling?'}
        </p>
      )}
      <div
        className="grid grid-cols-5 gap-1.5 sm:gap-2 md:flex md:flex-wrap md:items-center md:gap-3"
        role="group"
        aria-label="Mood selector"
      >
        {MOODS.map((mood) => {
          const isActive = selected === mood.score;
          const Icon = mood.Icon;
          return (
            <motion.button
              key={mood.score}
              type="button"
              aria-label={`Mood: ${mood.label}`}
              aria-pressed={isActive}
              onClick={() => handleSelect(mood.score)}
              whileTap={reducedMotion ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1.5 rounded-zen-lg',
                'min-h-[4.15rem] px-1 py-2 text-[0.6875rem] font-medium font-ui',
                'md:min-h-11 md:flex-row md:gap-2 md:rounded-zen-full md:px-4 md:py-2.5 md:text-sm',
                'transition-colors duration-zen-fast ease-zen-out',
                'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                isActive
                  ? cn(mood.soft, mood.color)
                  : 'bg-transparent text-zen-fg-muted hover:bg-zen-bg-subtle/60 hover:text-zen-fg md:bg-zen-surface md:border md:border-zen-border-soft/70',
              )}
              style={
                isActive && !reducedMotion
                  ? { boxShadow: `0 8px 22px -12px ${mood.glow}` }
                  : undefined
              }
            >
              <Icon
                className={cn('h-[1.125rem] w-[1.125rem] shrink-0', isActive && 'scale-105')}
                aria-hidden="true"
                strokeWidth={isActive ? 2.1 : 1.7}
              />
              <span>{mood.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
