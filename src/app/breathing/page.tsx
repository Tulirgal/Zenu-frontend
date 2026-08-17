'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { trackEngagement, getRecommendations } from '@/lib/signals';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { BreathingPattern } from '@/lib/types';
import { ZenButton, ZenBackLink } from '@/components/zen';
import { cn } from '@/lib/utils';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';
import { BreathingHeader } from './components/BreathingHeader';
import { QuickBreathingSession } from './components/QuickBreathingSession';
import { BreathingTechniqueGrid } from './components/BreathingTechniqueGrid';
import { BreathingPlayer } from './components/BreathingPlayer';
import { pickQuickPattern } from './components/patternVisual';

function BreathingPageInner() {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<BreathingPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [recDurationMin, setRecDurationMin] = useState<number | null>(null);

  const loadPatterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getBreathingPatterns();
      setPatterns(data);
    } catch (err) {
      console.error('Failed to load breathing patterns', err);
      setError('Unable to load breathing exercises right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackEngagement('breathing_box', 'opened');
    if (!user) return;
    void loadPatterns();
  }, [user, loadPatterns]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const rec = await getRecommendations();
      if (cancelled || !rec?.recommendations?.length) return;
      const breathing = rec.recommendations.find((r) => r.module_id === 'breathing');
      if (breathing && Number.isFinite(breathing.duration_min)) {
        setRecDurationMin(breathing.duration_min);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const quickPattern = useMemo(
    () => pickQuickPattern(patterns, recDurationMin),
    [patterns, recDurationMin],
  );

  const handleStart = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedPattern(null);
  };

  const handleSessionComplete = async (durationSeconds: number) => {
    if (!selectedPattern) return;
    const patternId = selectedPattern.id;
    try {
      await apiClient.logBreathingSession({ patternId, durationSeconds });
      await apiClient.recordActivity('breathing', { patternId, durationSeconds });
      trackEngagement('breathing_box', 'completed', durationSeconds);
      toast.success('Session saved', {
        description: 'Your breathing practice has been logged and added to your streak.',
      });
    } catch (err) {
      console.error('Failed to record breathing session', err);
      toast.error('We could not sync this session. Please try again.');
    }
  };

  const theme = getTheme('breathing');

  return (
    <ModulePage theme={theme}>
      <div className={cn(
        'relative min-h-dvh overflow-x-hidden',
        'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-16',
        'pt-6 md:pt-10',
      )}>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <ZenBackLink section="Breathe" className="mb-4" />
        <BreathingHeader />

        {error ? (
          <div className="mx-auto mt-8 max-w-lg rounded-zen-xl border border-zen-danger/20 bg-zen-danger-soft/40 px-5 py-4 text-center">
            <p className="font-ui text-sm text-zen-danger">{error}</p>
            <ZenButton variant="outline" className="mt-4" onClick={loadPatterns}>
              Try again
            </ZenButton>
          </div>
        ) : null}

        {quickPattern && !loading ? (
          <div className="mt-10 md:mt-12">
            <QuickBreathingSession pattern={quickPattern} onStart={handleStart} />
          </div>
        ) : null}

        <div className="mt-10 md:mt-14">
          <BreathingTechniqueGrid
            patterns={patterns}
            loading={loading}
            onStart={handleStart}
          />
        </div>
      </div>

      {selectedPattern ? (
        <BreathingPlayer
          isOpen={isPlayerOpen}
          pattern={selectedPattern}
          onClose={handleClosePlayer}
          onComplete={handleSessionComplete}
        />
      ) : null}
      </div>
    </ModulePage>
  );
}

export default function BreathingPage() {
  return (
    <RequireAuth>
      <BreathingPageInner />
    </RequireAuth>
  );
}
