'use client';

import React from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { cn } from '@/lib/utils';

export type BreathPhase = 'Inhale' | 'Hold' | 'Exhale';

export interface ZenBreathingCircleProps {
  pattern: number[];
  cycleDuration: number;
  isPaused: boolean;
  speed: number;
  onCycleComplete?: () => void;
  onPhaseChange?: (phase: BreathPhase | string, seconds: number) => void;
  onPhaseTick?: (phase: string, remainingSeconds: number, phaseProgress: number) => void;
  hideLabels?: boolean;
  className?: string;
}

/**
 * Full-screen breathing circle — wraps ParticleCanvas with zen chrome.
 */
export function ZenBreathingCircle({
  pattern,
  cycleDuration,
  isPaused,
  speed,
  onCycleComplete,
  onPhaseChange,
  onPhaseTick,
  hideLabels = true,
  className,
}: ZenBreathingCircleProps) {
  return (
    <div className={cn('relative w-full h-full min-h-[18rem]', className)}>
      <ParticleCanvas
        pattern={pattern}
        cycleDuration={cycleDuration}
        isPaused={isPaused}
        speed={speed}
        onCycleComplete={onCycleComplete}
        onPhaseChange={onPhaseChange}
        onPhaseTick={onPhaseTick}
        hideLabels={hideLabels}
      />
    </div>
  );
}
