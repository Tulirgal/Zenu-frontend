import type { PandaAnimation, PandaEmotion } from '@/components/panda/types';
import type { PrimaryEmotion } from './emotionData';

/**
 * Map Inner Compass primaries → V1-safe Panda emotions
 * (V1 renders: neutral | happy | calm | sad | thinking | listening).
 */
export function mapPrimaryToPanda(primary: PrimaryEmotion | null): {
  emotion: PandaEmotion;
  animation: PandaAnimation;
} {
  if (!primary) {
    return { emotion: 'thinking', animation: 'tilt' };
  }

  switch (primary) {
    case 'happy':
      return { emotion: 'happy', animation: 'idle' };
    case 'sad':
      return { emotion: 'sad', animation: 'idle' };
    case 'angry':
      return { emotion: 'sad', animation: 'idle' };
    case 'fearful':
      return { emotion: 'thinking', animation: 'tilt' };
    case 'disgusted':
      return { emotion: 'neutral', animation: 'idle' };
    case 'surprised':
      return { emotion: 'listening', animation: 'attentive' };
    case 'bad':
      return { emotion: 'calm', animation: 'breathe' };
    default:
      return { emotion: 'thinking', animation: 'tilt' };
  }
}
