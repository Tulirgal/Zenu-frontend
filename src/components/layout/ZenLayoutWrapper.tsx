'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import ZenNavigation from '@/components/layout/ZenNavigation';
import ZenBottomNav from '@/components/layout/ZenBottomNav';
import { PandaCompanionHost } from '@/components/panda/PandaCompanionHost';
import { PandaNotification } from '@/components/panda/PandaNotification';
import { syncRecommendationAttribution } from '@/lib/recommendationAttribution';
import { cn } from '@/lib/utils';

/** Immersive modules paint their own atmosphere — main must not flash cream. */
function immersiveMainBackground(pathname: string | null): string | undefined {
  if (!pathname) return undefined;
  if (pathname.startsWith('/burst')) {
    return 'linear-gradient(160deg, #0a0514 0%, #1e1035 35%, #3b1c7a 70%, #2d1b69 100%)';
  }
  if (pathname.startsWith('/bubbles')) {
    return 'hsl(240 32% 12%)';
  }
  if (pathname.startsWith('/chat')) {
    return 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #1e3a5f 75%, #0f172a 100%)';
  }
  return undefined;
}

export default function ZenLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const immersiveBg = immersiveMainBackground(pathname);

  useEffect(() => {
    if (!user || !pathname) return;
    syncRecommendationAttribution(pathname);
  }, [user, pathname]);

  if (!user) {
    // Unauthenticated layout (landing page) - Use Top Navbar
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <ZenNavigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Authenticated layout - Use Sidebar on Desktop
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] md:h-[100dvh] md:overflow-hidden">
      <ZenNavigation />
      <main
        className={cn(
          'relative flex flex-1 flex-col',
          'min-h-[calc(100dvh-4rem)] md:min-h-0 md:h-full md:overflow-y-auto',
          'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0',
          // Default transparent; immersive routes get an inline atmosphere fill
          !immersiveBg && 'bg-transparent',
        )}
        style={immersiveBg ? { background: immersiveBg } : undefined}
      >
        {children}
      </main>
      <ZenBottomNav />
      <PandaCompanionHost />
      <PandaNotification />
    </div>
  );
}
