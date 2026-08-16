'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type SpaceItem = {
  href: string;
  title: string;
  description: string;
  identity: string;
  accentClass: string;
  glowClass: string;
  featured?: boolean;
};

const SPACE_ITEMS: SpaceItem[] = [
  {
    href: '/art',
    title: 'Doodle Dreams',
    description: 'Soft patterns when words feel heavy.',
    identity: 'mandala',
    accentClass: 'text-zen-emotion-calm',
    glowClass: 'from-zen-emotion-calm-soft',
    featured: true,
  },
  {
    href: '/scribble',
    title: 'Scribble Pad',
    description: 'Let the line wander without a plan.',
    identity: 'scribble',
    accentClass: 'text-zen-emotion-sadness',
    glowClass: 'from-zen-emotion-sadness-soft',
    featured: true,
  },
  {
    href: '/burst',
    title: 'Burst It Out',
    description: 'A short release when energy builds.',
    identity: 'burst',
    accentClass: 'text-zen-emotion-great',
    glowClass: 'from-zen-emotion-great-soft',
  },
  {
    href: '/breathing',
    title: 'Breathe',
    description: 'A gentle rhythm for your nervous system.',
    identity: 'breathe',
    accentClass: 'text-zen-emotion-okay',
    glowClass: 'from-zen-emotion-okay-soft',
  },
  {
    href: '/meditation',
    title: 'Meditate',
    description: 'Stillness in a few quiet minutes.',
    identity: 'meditate',
    accentClass: 'text-zen-emotion-fear',
    glowClass: 'from-zen-emotion-fear-soft',
  },
  {
    href: '/innercompass',
    title: 'Inner Compass',
    description: 'Find a direction that feels true.',
    identity: 'compass',
    accentClass: 'text-zen-emotion-surprise',
    glowClass: 'from-zen-emotion-surprise-soft',
  },
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
    case 'scribble':
      return (
        <svg viewBox="0 0 64 40" className={cn(compact ? 'h-8 w-12' : 'h-10 w-16', 'opacity-80')} aria-hidden="true">
          <path
            d="M4 28 C14 8, 22 36, 32 18 S52 6, 60 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
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
  return (
    <section className={cn('zen-home-section', className)} aria-labelledby="home-space-heading">
      <div className="flex items-baseline justify-between gap-3 mb-4 md:mb-6">
        <h2
          id="home-space-heading"
          className="font-ui text-[0.9375rem] font-semibold text-zen-fg md:text-[1.25rem]"
        >
          Your wellness space
        </h2>
        <Link
          href="/bubbles"
          className="font-ui text-[0.8125rem] md:text-[0.9375rem] text-zen-secondary hover:text-zen-fg transition-colors focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2 rounded-sm"
        >
          Explore all →
        </Link>
      </div>

      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 -mx-4 pl-4 pr-6 snap-x snap-mandatory',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'md:mx-0 md:px-0 md:pr-0 md:overflow-visible md:pb-0 md:snap-none',
          'md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-3.5 lg:gap-4',
        )}
      >
        {SPACE_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative overflow-hidden rounded-zen-xl',
              'bg-zen-surface border border-zen-border-soft/60',
              'transition-colors duration-zen-fast ease-zen-out',
              'active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
              // Mobile rail — ~2.5 cards visible on 390–430
              'shrink-0 w-[8.25rem] snap-start p-3.5 min-h-[8.5rem]',
              // Desktop — wider cards with room for descriptions
              'md:w-auto md:min-h-[11.5rem] md:p-5 md:shrink',
            )}
          >
            <div
              className={cn(
                'absolute -right-2 -bottom-3 h-16 w-16 rounded-full bg-gradient-to-tl to-transparent opacity-95 md:h-20 md:w-20 md:-right-3 md:-bottom-4',
                item.glowClass,
              )}
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-full flex-col">
              <h3 className="font-ui text-[0.8125rem] font-semibold text-zen-fg tracking-tight leading-snug md:text-[1.0625rem]">
                {item.title}
              </h3>
              <p className="hidden md:block font-ui text-[0.875rem] text-zen-fg-muted mt-2 leading-snug line-clamp-2">
                {item.description}
              </p>
              <div className={cn('mt-auto pt-4 flex items-end justify-between', item.accentClass)}>
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
                <SpaceMark identity={item.identity} compact />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
