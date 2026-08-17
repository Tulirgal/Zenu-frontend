'use client';

import { useEffect } from 'react';
import InnerCompassComponent from '@/components/InnerCompass';
import { trackEngagement } from '@/lib/signals';
import { ZenContainer, ZenBackLink } from '@/components/zen';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';

const InnerCompass = () => {
  useEffect(() => {
    trackEngagement('inner_compass', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('inner_compass', 'completed', duration);
    };
  }, []);

  const theme = getTheme('innercompass');

  return (
    <ModulePage theme={theme} className="min-h-[calc(100dvh-4rem)] relative">

      <ZenContainer
        maxWidth="full"
        className="relative z-10 mx-auto w-full max-w-[1320px] pt-3 pb-6 px-4 sm:px-5 md:pt-6 md:pb-16 md:px-8 lg:px-10"
      >
        <ZenBackLink section="Inner Compass" className="mb-5 md:mb-6" />
        <InnerCompassComponent />
      </ZenContainer>
    </ModulePage>
  );
};

export default InnerCompass;
