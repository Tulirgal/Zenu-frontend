import type {
  PandaActivity,
  PandaAnimation,
  PandaEmotion,
  PandaMode,
} from '@/components/panda/types';

export type RoutePandaPresentation = {
  emotion: PandaEmotion;
  activity: PandaActivity | null;
  animation: PandaAnimation;
  mode: PandaMode;
};

/**
 * Path-aware presentation for ambient/responsive companion only.
 * Does NOT fetch or invent recommendations — presentation mapping only.
 */
const PATH_PRESENTATION: Array<{
  match: RegExp;
  presentation: RoutePandaPresentation;
}> = [
  {
    match: /^\/breathing(\/|$)/,
    presentation: {
      emotion: 'calm',
      activity: 'breathing',
      animation: 'breathe',
      mode: 'responsive',
    },
  },
  {
    match: /^\/meditation(\/|$)/,
    presentation: {
      emotion: 'calm',
      activity: 'meditating',
      animation: 'breathe',
      mode: 'responsive',
    },
  },
  {
    match: /^\/journal(\/|$)/,
    presentation: {
      emotion: 'thinking',
      activity: 'writing',
      animation: 'writing',
      mode: 'responsive',
    },
  },
  {
    match: /^\/gratitude(\/|$)/,
    presentation: {
      emotion: 'happy',
      activity: 'gratitude',
      animation: 'bounce',
      mode: 'responsive',
    },
  },
  {
    match: /^\/art(\/|$)/,
    presentation: {
      emotion: 'happy',
      activity: 'drawing',
      animation: 'attentive',
      mode: 'responsive',
    },
  },
  {
    match: /^\/scribble(\/|$)/,
    presentation: {
      emotion: 'happy',
      activity: 'drawing',
      animation: 'attentive',
      mode: 'responsive',
    },
  },
  {
    match: /^\/chat(\/|$)/,
    presentation: {
      emotion: 'listening',
      activity: 'talking',
      animation: 'talk',
      mode: 'responsive',
    },
  },
  {
    match: /^\/innercompass(\/|$)/,
    presentation: {
      emotion: 'thinking',
      activity: null,
      animation: 'tilt',
      mode: 'responsive',
    },
  },
  {
    match: /^\/healing-garden(\/|$)/,
    presentation: {
      emotion: 'calm',
      activity: 'garden',
      animation: 'breathe',
      mode: 'responsive',
    },
  },
  {
    match: /^\/burst(\/|$)/,
    presentation: {
      emotion: 'happy',
      activity: 'release',
      animation: 'bounce',
      mode: 'responsive',
    },
  },
  {
    match: /^\/bubbles(\/|$)/,
    presentation: {
      emotion: 'calm',
      activity: null,
      animation: 'idle',
      mode: 'responsive',
    },
  },
];

/** Routes where a floating companion would duplicate a dominant inline panda. */
const COMPANION_DENY = [
  /^\/$/,
  /^\/innercompass(\/|$)/,
  /^\/scribble(\/|$)/,
  /^\/art(\/|$)/,
  /^\/bubbles(\/|$)/,
  /^\/meditation(\/|$)/,
  /^\/breathing(\/|$)/,
  /^\/dev\/panda(\/|$)/,
  /^\/chat(\/|$)/,
  /^\/signin(\/|$)/,
  /^\/signup(\/|$)/,
  /^\/forgot-password(\/|$)/,
  /^\/reset-password(\/|$)/,
  /^\/auth(\/|$)/,
];

export function getPandaContextPresentation(
  pathname: string | null | undefined,
): RoutePandaPresentation | null {
  if (!pathname) return null;

  for (const rule of PATH_PRESENTATION) {
    if (rule.match.test(pathname)) return rule.presentation;
  }

  // Authenticated home / dashboard
  if (pathname === '/') {
    return {
      emotion: 'neutral',
      activity: null,
      animation: 'idle',
      mode: 'ambient',
    };
  }

  return {
    emotion: 'neutral',
    activity: null,
    animation: 'idle',
    mode: 'ambient',
  };
}

export function shouldShowFloatingCompanion(
  pathname: string | null | undefined,
): boolean {
  if (!pathname) return false;
  return !COMPANION_DENY.some((re) => re.test(pathname));
}
