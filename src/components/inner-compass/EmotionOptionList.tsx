'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrimaryEmotion } from './emotionData';
import {
  OPTION_FOCUS,
  OPTION_HOVER,
  OPTION_IDLE,
  OPTION_SELECTED,
} from './emotionTokens';

export function EmotionOptionList({
  options,
  selected,
  onSelect,
  primary,
  className,
}: {
  options: string[];
  selected?: string | null;
  onSelect: (value: string) => void;
  primary: PrimaryEmotion;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 w-full',
        className,
      )}
      role="listbox"
      aria-label="Emotion options"
    >
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <li key={option}>
            <button
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => onSelect(option)}
              className={cn(
                'group w-full min-h-[3.25rem] md:min-h-14 px-4 py-3.5 rounded-zen-xl text-left',
                'font-ui text-[0.9375rem] md:text-base font-medium capitalize',
                'border transition-all duration-200 ease-out',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'active:scale-[0.98]',
                'motion-reduce:active:scale-100 motion-reduce:transition-colors',
                'flex items-center justify-between gap-3',
                OPTION_FOCUS[primary],
                isActive
                  ? OPTION_SELECTED[primary]
                  : cn(OPTION_IDLE, OPTION_HOVER[primary]),
              )}
            >
              <span className="transition-colors duration-200">{option}</span>
              {isActive ? (
                <Check className="h-4 w-4 shrink-0 opacity-85" aria-hidden="true" />
              ) : (
                <span
                  className="h-4 w-4 shrink-0 text-zen-fg-subtle opacity-0 group-hover:opacity-40 group-hover:translate-x-0.5 transition-all duration-200"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
