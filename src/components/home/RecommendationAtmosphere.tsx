'use client';

import { cn } from '@/lib/utils';

type AtmosphereKind =
  | 'breath'
  | 'still'
  | 'create'
  | 'release'
  | 'reflect'
  | 'garden'
  | 'default';

function resolveKind(moduleId?: string | null): AtmosphereKind {
  if (!moduleId) return 'default';
  const id = moduleId.toLowerCase();
  if (id.includes('breath')) return 'breath';
  if (id.includes('mindful') || id.includes('meditat')) return 'still';
  if (id.includes('chat') || id.includes('seviyan')) return 'reflect';
  if (id.includes('doodle') || id.includes('scribble') || id.includes('art') || id.includes('mandala'))
    return 'create';
  if (id.includes('burst') || id.includes('bubble')) return 'release';
  if (id.includes('journal') || id.includes('gratitude') || id.includes('diary') || id.includes('compass'))
    return 'reflect';
  if (id.includes('garden') || id.includes('healing')) return 'garden';
  return 'default';
}

const TONE: Record<AtmosphereKind, { wash: string; accent: string }> = {
  breath: {
    wash: 'hsl(var(--zen-emotion-okay) / 0.18)',
    accent: 'hsl(var(--zen-emotion-okay) / 0.45)',
  },
  still: {
    wash: 'hsl(var(--zen-emotion-calm) / 0.2)',
    accent: 'hsl(var(--zen-emotion-calm) / 0.5)',
  },
  create: {
    wash: 'hsl(var(--zen-emotion-sadness) / 0.16)',
    accent: 'hsl(var(--zen-emotion-sadness) / 0.4)',
  },
  release: {
    wash: 'hsl(var(--zen-emotion-great) / 0.16)',
    accent: 'hsl(var(--zen-emotion-great) / 0.42)',
  },
  reflect: {
    wash: 'hsl(var(--zen-secondary) / 0.16)',
    accent: 'hsl(var(--zen-secondary) / 0.42)',
  },
  garden: {
    wash: 'hsl(var(--zen-success) / 0.14)',
    accent: 'hsl(var(--zen-success) / 0.4)',
  },
  default: {
    wash: 'hsl(var(--zen-secondary) / 0.16)',
    accent: 'hsl(var(--zen-secondary) / 0.4)',
  },
};

/**
 * Organic recommendation atmosphere — CSS/SVG only.
 * Visual language follows the recommended module family (not ranking copy).
 */
export function RecommendationAtmosphere({
  className,
  compact,
  moduleId,
}: {
  className?: string;
  compact?: boolean;
  moduleId?: string | null;
}) {
  const kind = resolveKind(moduleId);
  const tone = TONE[kind];
  const size = compact ? 'h-[6.25rem] w-[6.25rem]' : 'h-44 w-44 md:h-52 md:w-52';

  return (
    <div className={cn('pointer-events-none', className)} aria-hidden="true">
      <div className={cn('relative', size)}>
        {/* Soft organic wash */}
        <div
          className="absolute inset-[-8%] rounded-[42%_58%_48%_52%] blur-xl opacity-90"
          style={{ background: tone.wash }}
        />
        <div
          className="absolute inset-[18%] rounded-[55%_45%_60%_40%] blur-md opacity-70"
          style={{ background: tone.wash }}
        />

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          {kind === 'breath' && (
            <>
              <ellipse cx="60" cy="62" rx="34" ry="22" stroke={tone.accent} strokeWidth="1.2" opacity="0.55" />
              <ellipse cx="60" cy="62" rx="22" ry="14" stroke={tone.accent} strokeWidth="1.2" opacity="0.7" />
              <ellipse cx="60" cy="62" rx="10" ry="6" fill={tone.accent} opacity="0.35" />
            </>
          )}
          {kind === 'still' && (
            <>
              <path
                d="M60 28 C52 42 40 50 60 68 C80 50 68 42 60 28 Z"
                fill={tone.accent}
                opacity="0.35"
              />
              <ellipse cx="60" cy="78" rx="18" ry="6" stroke={tone.accent} strokeWidth="1.1" opacity="0.5" />
            </>
          )}
          {kind === 'create' && (
            <path
              d="M28 78 C40 40 52 90 64 52 S88 36 96 62"
              stroke={tone.accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
          )}
          {kind === 'release' && (
            <>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="60"
                  y1="60"
                  x2="60"
                  y2="28"
                  stroke={tone.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.55"
                  transform={`rotate(${deg} 60 60)`}
                />
              ))}
              <circle cx="60" cy="60" r="6" fill={tone.accent} opacity="0.4" />
            </>
          )}
          {kind === 'reflect' && (
            <>
              <circle cx="60" cy="60" r="26" stroke={tone.accent} strokeWidth="1.2" opacity="0.45" />
              <path d="M60 38 L68 60 L60 82 L52 60 Z" fill={tone.accent} opacity="0.4" />
            </>
          )}
          {kind === 'garden' && (
            <>
              <path
                d="M60 78 C60 58 48 48 48 40 C56 44 60 52 60 62 C60 52 64 44 72 40 C72 48 60 58 60 78 Z"
                fill={tone.accent}
                opacity="0.45"
              />
              <ellipse cx="60" cy="86" rx="20" ry="5" fill={tone.accent} opacity="0.2" />
            </>
          )}
          {kind === 'default' && (
            <>
              <path
                d="M38 70 C48 42 72 42 82 70 C72 64 48 64 38 70 Z"
                fill={tone.accent}
                opacity="0.35"
              />
              <circle cx="60" cy="52" r="8" fill={tone.accent} opacity="0.3" />
            </>
          )}

          {/* Soft sparkle particles */}
          <circle cx="88" cy="36" r="1.4" fill={tone.accent} opacity="0.55" />
          <circle cx="30" cy="44" r="1.1" fill={tone.accent} opacity="0.4" />
          <circle cx="78" cy="86" r="1.2" fill={tone.accent} opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
