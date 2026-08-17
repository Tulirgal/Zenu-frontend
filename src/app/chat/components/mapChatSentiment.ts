import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';

export type ChatPresentation = {
  emotion: PandaEmotion;
  animation: PandaAnimation;
};

const FALLBACK: ChatPresentation = {
  emotion: 'calm',
  animation: 'breathe',
};

/** Normalize loose API strings without inventing a required contract. */
function normalize(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  return v.length ? v : null;
}

/**
 * Map optional backend sentiment/emotion → existing Panda states.
 * Never requires fields; defaults to calm.
 */
export function mapChatSentiment(data: {
  sentiment?: unknown;
  emotion?: unknown;
}): ChatPresentation {
  const key = normalize(data.emotion) ?? normalize(data.sentiment);
  if (!key) return FALLBACK;

  if (
    key.includes('happy') ||
    key.includes('joy') ||
    key.includes('positive') ||
    key.includes('excited') ||
    key.includes('grateful')
  ) {
    return { emotion: 'happy', animation: 'idle' };
  }

  if (
    key.includes('sad') ||
    key.includes('grief') ||
    key.includes('down') ||
    key.includes('lonely')
  ) {
    return { emotion: 'sad', animation: 'idle' };
  }

  if (
    key.includes('anxious') ||
    key.includes('anxiety') ||
    key.includes('overwhelm') ||
    key.includes('stress') ||
    key.includes('fear') ||
    key.includes('worried')
  ) {
    return { emotion: 'anxious', animation: 'attentive' };
  }

  if (key.includes('curious') || key.includes('wonder')) {
    return { emotion: 'curious', animation: 'tilt' };
  }

  if (key.includes('listen') || key.includes('empath') || key.includes('support')) {
    return { emotion: 'listening', animation: 'attentive' };
  }

  if (key.includes('think') || key.includes('reflect')) {
    return { emotion: 'thinking', animation: 'tilt' };
  }

  if (key.includes('calm') || key.includes('peace') || key.includes('neutral')) {
    return { emotion: 'calm', animation: 'breathe' };
  }

  return FALLBACK;
}

/** Subtle atmosphere wash keyed off held emotion — never replaces ModulePage theme. */
export function atmosphereWash(emotion: PandaEmotion): string {
  switch (emotion) {
    case 'happy':
    case 'excited':
      return 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(251, 191, 36, 0.10), transparent 70%)';
    case 'sad':
    case 'anxious':
    case 'disappointed':
      return 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(196, 181, 253, 0.12), transparent 70%)';
    case 'curious':
    case 'thinking':
      return 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(147, 197, 253, 0.08), transparent 70%)';
    case 'calm':
    case 'listening':
    default:
      return 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(96, 165, 250, 0.07), transparent 70%)';
  }
}
