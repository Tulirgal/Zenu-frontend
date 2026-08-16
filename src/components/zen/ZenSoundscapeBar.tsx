'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Flame, CloudRain, Waves, TreePine, Sparkles } from 'lucide-react';
import {
  ZenSheet,
  ZenSheetContent,
  ZenSheetHeader,
  ZenSheetTitle,
} from './ZenSheet';
import { ZenButton } from './ZenButton';
import { AMBIENT_SOURCES } from '@/lib/meditationAudio';
import { cn } from '@/lib/utils';

type SoundType = 'fire' | 'rain' | 'forest' | 'ocean';

const SOUND_CONTROLS = [
  { type: 'fire' as const, label: 'Fire', icon: Flame },
  { type: 'rain' as const, label: 'Rain', icon: CloudRain },
  { type: 'forest' as const, label: 'Forest', icon: TreePine },
  { type: 'ocean' as const, label: 'Ocean', icon: Waves },
];

function VolumeRow({
  type,
  label,
  icon: Icon,
  volume,
  onChange,
}: {
  type: SoundType;
  label: string;
  icon: typeof Flame;
  volume: number;
  onChange: (sound: SoundType, value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 min-h-11 w-full min-w-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-zen-md border border-zen-border-soft bg-zen-bg-subtle text-zen-fg-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="w-16 shrink-0 font-ui text-sm text-zen-fg">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(type, parseInt(e.target.value, 10))
        }
        aria-label={`${label} ambient volume`}
        className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-lg bg-zen-bg-muted accent-zen-secondary"
      />
      <span className="w-8 shrink-0 text-right font-ui text-xs text-zen-fg-subtle">{volume}</span>
    </label>
  );
}

/**
 * Compact atmosphere mixer — chips on desktop, sheet on mobile.
 * Fire / Rain / Forest / Ocean volume behavior preserved.
 */
export function ZenSoundscapeBar({ className }: { className?: string }) {
  const [volumes, setVolumes] = useState({ fire: 0, rain: 0, forest: 0, ocean: 0 });
  const [expanded, setExpanded] = useState<SoundType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const fireRef = useRef<HTMLAudioElement>(null);
  const rainRef = useRef<HTMLAudioElement>(null);
  const forestRef = useRef<HTMLAudioElement>(null);
  const oceanRef = useRef<HTMLAudioElement>(null);

  const handleVolumeChange = (sound: SoundType, newVolume: number) => {
    setVolumes((prev) => ({ ...prev, [sound]: newVolume }));
  };

  useEffect(() => {
    const refs: Record<SoundType, HTMLAudioElement | null> = {
      fire: fireRef.current,
      rain: rainRef.current,
      forest: forestRef.current,
      ocean: oceanRef.current,
    };

    (Object.keys(volumes) as SoundType[]).forEach((sound) => {
      const audio = refs[sound];
      const volume = volumes[sound];
      if (!audio) return;

      if (volume > 0 && audio.paused) {
        audio.play().catch((error) => console.warn(`Could not play ${sound} audio:`, error));
      }
      audio.volume = volume / 100;
      if (volume === 0 && !audio.paused) {
        audio.pause();
      }
    });
  }, [volumes]);

  useEffect(() => {
    return () => {
      [fireRef, rainRef, forestRef, oceanRef].forEach((ref) => {
        ref.current?.pause();
      });
    };
  }, []);

  const toggleChip = (type: SoundType) => {
    if (expanded === type) {
      setExpanded(null);
      return;
    }
    setExpanded(type);
    if (volumes[type] === 0) {
      handleVolumeChange(type, 35);
    }
  };

  return (
    <div className={cn('w-full min-w-0', className)}>
      <div className="hidden md:block rounded-zen-xl border border-zen-border-soft bg-white/70 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 font-ui text-sm text-zen-fg-muted">
            <Sparkles className="h-3.5 w-3.5 text-zen-secondary" aria-hidden="true" />
            Atmosphere
          </span>
          {SOUND_CONTROLS.map(({ type, label, icon: Icon }) => {
            const active = volumes[type] > 0;
            const selected = expanded === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleChip(type)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-1.5 rounded-zen-full border px-3 font-ui text-sm transition-colors duration-100',
                  'active:scale-[0.97]',
                  'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                  active || selected
                    ? 'border-zen-secondary/35 bg-zen-secondary-soft text-zen-secondary'
                    : 'border-zen-border-soft bg-zen-bg-subtle/80 text-zen-fg-muted hover:text-zen-fg',
                )}
                aria-pressed={active}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {expanded ? (
          <div className="mt-3 border-t border-zen-border-soft pt-3">
            {SOUND_CONTROLS.filter((s) => s.type === expanded).map(({ type, label, icon }) => (
              <VolumeRow
                key={type}
                type={type}
                label={label}
                icon={icon}
                volume={volumes[type]}
                onChange={handleVolumeChange}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="md:hidden">
        <ZenButton
          type="button"
          variant="outline"
          className="w-full min-h-11 justify-center"
          aria-label="Open atmosphere controls"
          onClick={() => setSheetOpen(true)}
        >
          <Sparkles className="h-4 w-4 text-zen-secondary" aria-hidden="true" />
          Atmosphere
        </ZenButton>
      </div>

      <ZenSheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <ZenSheetContent
          side="bottom"
          className="md:hidden rounded-t-zen-2xl pb-safe max-h-[85dvh] overflow-y-auto"
        >
          <ZenSheetHeader>
            <ZenSheetTitle className="font-ui text-base">Atmosphere</ZenSheetTitle>
          </ZenSheetHeader>
          <div className="mt-4 flex min-w-0 flex-col gap-2">
            {SOUND_CONTROLS.map(({ type, label, icon }) => (
              <VolumeRow
                key={type}
                type={type}
                label={label}
                icon={icon}
                volume={volumes[type]}
                onChange={handleVolumeChange}
              />
            ))}
          </div>
        </ZenSheetContent>
      </ZenSheet>

      <audio ref={fireRef} src={AMBIENT_SOURCES.fire} loop preload="none" />
      <audio ref={rainRef} src={AMBIENT_SOURCES.rain} loop preload="none" />
      <audio ref={forestRef} src={AMBIENT_SOURCES.forest} loop preload="none" />
      <audio ref={oceanRef} src={AMBIENT_SOURCES.ocean} loop preload="none" />
    </div>
  );
}
