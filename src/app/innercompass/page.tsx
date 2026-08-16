'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import InnerCompassComponent from '@/components/InnerCompass';
import { trackEngagement } from '@/lib/signals';
import { ZenPage, ZenContainer, ZenButton } from '@/components/zen';

const InnerCompass = () => {
  const router = useRouter();

  useEffect(() => {
    trackEngagement('inner_compass', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('inner_compass', 'completed', duration);
    };
  }, []);

  return (
    <ZenPage atmosphere="home" gradient className="min-h-[calc(100dvh-4rem)] relative">
      <div className="zen-home-atmosphere absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="zen-home-glow right-[-8%] top-[10%] h-56 w-56 md:h-80 md:w-80 bg-zen-secondary-soft opacity-40" />
        <div className="zen-home-glow left-[-10%] bottom-[20%] h-48 w-48 md:h-72 md:w-72 opacity-30 bg-zen-emotion-surprise-soft" />
      </div>

      <ZenContainer
        maxWidth="full"
        className="relative z-10 mx-auto w-full max-w-[1320px] pt-3 pb-6 px-4 sm:px-5 md:pt-6 md:pb-16 md:px-8 lg:px-10"
      >
        <ZenButton
          variant="ghost"
          size="sm"
          className="mb-5 md:mb-6"
          onClick={() => router.push('/')}
          aria-label="Return to home"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </ZenButton>

        <InnerCompassComponent />
      </ZenContainer>
    </ZenPage>
  );
};

export default InnerCompass;
