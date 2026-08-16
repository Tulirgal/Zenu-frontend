import type { GratitudeEntry } from '@/lib/types';

export function formatGratitudeDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function getExcerpt(content: string, max = 120): string {
  const trimmed = content.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function pickLocalRandom(entries: GratitudeEntry[]): GratitudeEntry | null {
  if (!entries.length) return null;
  return entries[Math.floor(Math.random() * entries.length)] ?? null;
}
