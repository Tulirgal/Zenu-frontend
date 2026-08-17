'use client';

import { useCallback, useEffect, useState } from 'react';
import { trackEngagement } from '@/lib/signals';
import { cn } from '@/lib/utils';
import { ZenBackLink } from '@/components/zen';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { BubblesField, type BubblesEvent } from './components/BubblesField';
import { BubblesHelp } from './components/BubblesHelp';
import { BubblesCompanion } from './components/BubblesCompanion';

export default function BubblesPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [eventPulse, setEventPulse] = useState(0);
  const [lastEvent, setLastEvent] = useState<BubblesEvent | null>(null);

  useEffect(() => {
    trackEngagement('bubble_simulation', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('bubble_simulation', 'completed', duration);
    };
  }, []);

  const onEvent = useCallback((e: BubblesEvent) => {
    setLastEvent(e);
    setEventPulse((n) => n + 1);
  }, []);

  return (
    <div
      className={cn(
        'relative flex w-full flex-col overflow-hidden',
        'max-md:absolute max-md:inset-0',
        'max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]',
        'md:h-full md:min-h-0 md:flex-1',
        'bg-[hsl(240,32%,12%)]',
      )}
      data-zen-atmosphere="none"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 900px 500px at 20% 10%, hsl(262 48% 40% / 0.28), transparent 65%), radial-gradient(ellipse 700px 420px at 85% 80%, hsl(200 70% 45% / 0.18), transparent 60%), linear-gradient(160deg, hsl(250 35% 14%) 0%, hsl(240 32% 12%) 45%, hsl(230 38% 10%) 100%)',
          }}
        />
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[hsl(262_48%_58%/0.12)] blur-3xl" />
        <div className="absolute -right-16 bottom-32 h-56 w-56 rounded-full bg-[hsl(190_70%_50%/0.1)] blur-3xl" />
      </div>

      <ZenBackLink
        section="Bubbles"
        className="absolute left-3 top-3 z-30 md:left-4 md:top-4"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-2 pt-14 md:p-3 md:pt-16">
        <div
          className={cn(
            'relative flex min-h-0 flex-1 overflow-hidden rounded-zen-2xl',
            'border border-white/10 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)]',
          )}
          style={{
            background:
              'radial-gradient(ellipse 1000px 520px at 30% 20%, hsl(262 48% 35% / 0.2), transparent 70%), radial-gradient(ellipse 800px 400px at 70% 90%, hsl(200 70% 40% / 0.12), transparent 65%), hsl(240 30% 11%)',
          }}
        >
          <BubblesField
            className="absolute inset-0"
            reducedMotion={reducedMotion}
            onEvent={onEvent}
          />
          <BubblesHelp />
          <BubblesCompanion eventPulse={eventPulse} lastEvent={lastEvent} />
        </div>
      </div>
    </div>
  );
}
