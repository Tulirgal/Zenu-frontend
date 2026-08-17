'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_MODULES = [
  { id: 'breathing', name: 'Zen Breath Zone', description: 'A gentle rhythm for your nervous system.', route: '/breathing', icon: '🌬️' },
  { id: 'mindfulness', name: 'Meditate', description: 'Stillness in a few quiet minutes.', route: '/meditation', icon: '🧘' },
  { id: 'chatbot_seviyan', name: 'Seviyan', description: 'Talk it through with a calm companion.', route: '/chat', icon: '💬' },
  { id: 'diary', name: 'My Diary', description: 'Reflect on your day.', route: '/journal', icon: '📖' },
  { id: 'journal_gratitude', name: 'Gratitude Journal', description: 'Count your blessings.', route: '/gratitude', icon: '🌸' },
  { id: 'doodle_dreams', name: 'Doodle Dreams Studio', description: 'Soft patterns when words feel heavy.', route: '/art', icon: '🎨' },
  { id: 'bubble_canvas', name: 'Bubble Canvas', description: 'Pop stress away.', route: '/bubbles', icon: '🫧' },
  { id: 'burst_it_out', name: 'Burst It Out', description: 'A short release when energy builds.', route: '/burst', icon: '💥' },
  { id: 'scribble_pad', name: 'Scribble Pad', description: 'Express freely.', route: '/scribble', icon: '✏️' },
  { id: 'healing_garden', name: 'Healing Garden', description: 'Grow your streak.', route: '/healing-garden', icon: '🌿' },
  { id: 'inner_compass', name: 'Inner Compass', description: 'Find your direction.', route: '/innercompass', icon: '🧭' },
];

function SpaceMark({ identity, compact }: { identity: string; compact?: boolean }) {
  const size = compact ? 'h-10 w-10' : 'h-14 w-14';
  switch (identity) {
    case 'mandala':
      return (
        <svg viewBox="0 0 64 64" className={cn(size, 'opacity-80')} aria-hidden="true">
          <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
          {[0, 45, 90, 135].map((deg) => (
            <line
              key={deg}
              x1="32"
              y1="10"
              x2="32"
              y2="18"
              stroke="currentColor"
              strokeWidth="1.2"
              transform={`rotate(${deg} 32 32)`}
            />
          ))}
        </svg>
      );
    case 'seviyan':
      return (
        <svg viewBox="0 0 64 56" className={cn(compact ? 'h-9 w-10' : 'h-11 w-12', 'opacity-80')} aria-hidden="true">
          <path
            d="M10 14h36a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H28l-10 10v-10H10a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="28" r="2.2" fill="currentColor" />
          <circle cx="32" cy="28" r="2.2" fill="currentColor" />
          <circle cx="42" cy="28" r="2.2" fill="currentColor" />
        </svg>
      );
    case 'burst':
      return (
        <svg viewBox="0 0 64 64" className={cn(size, 'opacity-80')} aria-hidden="true">
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
            <line
              key={deg}
              x1="32"
              y1="32"
              x2="32"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${deg} 32 32)`}
            />
          ))}
        </svg>
      );
    case 'breathe':
      return (
        <svg viewBox="0 0 64 64" className={cn(size, 'opacity-80')} aria-hidden="true">
          <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.35" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case 'meditate':
      return (
        <svg viewBox="0 0 64 64" className={cn(size, 'opacity-80')} aria-hidden="true">
          <ellipse cx="32" cy="38" rx="14" ry="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M32 14 C28 22, 22 26, 32 34 C42 26, 36 22, 32 14 Z"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 64 64" className={cn(size, 'opacity-80')} aria-hidden="true">
          <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M32 16 L38 32 L32 48 L26 32 Z" fill="currentColor" opacity="0.55" />
        </svg>
      );
    default:
      return null;
  }
}

export function HomeYourSpace({ className }: { className?: string }) {
  const INITIAL_SHOW = 6;
  const [showAll, setShowAll] = useState(false);
  const visibleModules = showAll ? ALL_MODULES : ALL_MODULES.slice(0, INITIAL_SHOW);

  return (
    <section className={cn('zen-home-section', className)} aria-labelledby="home-space-heading">
      <div className="flex items-baseline justify-between gap-3 mb-4 md:mb-6">
        <h2
          id="home-space-heading"
          className="font-ui text-[0.9375rem] font-semibold text-zen-fg md:text-[1.25rem]"
        >
          Your wellness space
        </h2>
      </div>

      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 -mx-4 pl-4 pr-6 snap-x snap-mandatory',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'md:mx-0 md:px-0 md:pr-0 md:overflow-visible md:pb-0 md:snap-none',
          'md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-3.5 lg:gap-4',
        )}
      >
        <AnimatePresence>
          {visibleModules.map((module, i) => {
            const glowClass = 'from-zen-emotion-calm-soft';
            const accentClass = 'text-zen-emotion-calm';

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i >= INITIAL_SHOW ? (i - INITIAL_SHOW) * 0.05 : 0 }}
              >
                <Link
                  href={module.route}
                  className={cn(
                    'group relative overflow-hidden rounded-zen-xl',
                    'bg-zen-surface border border-zen-border-soft/60',
                    'transition-colors duration-zen-fast ease-zen-out',
                    'active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                    // Mobile rail — ~2.5 cards visible on 390–430
                    'shrink-0 w-[8.25rem] snap-start p-3.5 min-h-[8.5rem]',
                    // Desktop — wider cards with room for descriptions
                    'md:w-auto md:min-h-[11.5rem] md:p-5 md:shrink',
                    'block h-full'
                  )}
                >
                  <div
                    className={cn(
                      'absolute -right-2 -bottom-3 h-16 w-16 rounded-full bg-gradient-to-tl to-transparent opacity-95 md:h-20 md:w-20 md:-right-3 md:-bottom-4',
                      glowClass,
                    )}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <h3 className="font-ui text-[0.8125rem] font-semibold text-zen-fg tracking-tight leading-snug md:text-[1.0625rem]">
                      {module.name}
                    </h3>
                    <p className="hidden md:block font-ui text-[0.875rem] text-zen-fg-muted mt-2 leading-snug line-clamp-2">
                      {module.description}
                    </p>
                    <div className={cn('mt-auto pt-4 flex items-end justify-between', accentClass)}>
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full',
                          'bg-zen-bg-subtle/90 text-zen-fg-muted text-xs',
                          'group-hover:bg-zen-fg group-hover:text-white',
                          'transition-colors duration-zen-fast',
                        )}
                        aria-hidden="true"
                      >
                        →
                      </span>
                      <span className="text-2xl leading-none opacity-80">{module.icon}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!showAll && ALL_MODULES.length > INITIAL_SHOW && (
        <div className="flex justify-center mt-4 hidden md:flex">
          <motion.button
            onClick={() => setShowAll(true)}
            className={cn(
              'inline-flex items-center gap-2',
              'font-ui text-[0.875rem] text-zen-fg-muted hover:text-zen-fg',
              'px-5 py-2.5 rounded-zen-xl',
              'border border-zen-border-soft/55 bg-zen-surface',
              'hover:bg-zen-surface-raised transition-all duration-150',
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Show {ALL_MODULES.length - INITIAL_SHOW} more modules
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </div>
      )}

      {showAll && (
        <div className="flex justify-center mt-4 hidden md:flex">
          <button
            onClick={() => setShowAll(false)}
            className="font-ui text-[0.8125rem] text-zen-fg-subtle hover:text-zen-fg transition-colors underline"
          >
            Show less
          </button>
        </div>
      )}
    </section>
  );
}
