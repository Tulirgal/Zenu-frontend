import type { PrimaryEmotion } from './emotionData';

/** Zen Design System 2.0 emotion token stems (CSS / Tailwind). */
export type EmotionTokenStem =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'disgust'
  | 'surprise'
  | 'okay';

export const PRIMARY_TOKEN: Record<PrimaryEmotion, EmotionTokenStem> = {
  happy: 'joy',
  sad: 'sadness',
  angry: 'anger',
  fearful: 'fear',
  disgusted: 'disgust',
  surprised: 'surprise',
  bad: 'okay',
};

export const PRIMARY_LABEL: Record<PrimaryEmotion, string> = {
  happy: 'Joy',
  sad: 'Sadness',
  angry: 'Anger',
  fearful: 'Fear',
  disgusted: 'Disgust',
  surprised: 'Surprise',
  bad: 'Low',
};

/** Full class strings so Tailwind JIT can detect them. */
const SOFT_BG: Record<PrimaryEmotion, string> = {
  happy: 'bg-zen-emotion-joy-soft text-zen-emotion-joy',
  sad: 'bg-zen-emotion-sadness-soft text-zen-emotion-sadness',
  angry: 'bg-zen-emotion-anger-soft text-zen-emotion-anger',
  fearful: 'bg-zen-emotion-fear-soft text-zen-emotion-fear',
  disgusted: 'bg-zen-emotion-disgust-soft text-zen-emotion-disgust',
  surprised: 'bg-zen-emotion-surprise-soft text-zen-emotion-surprise',
  bad: 'bg-zen-emotion-okay-soft text-zen-emotion-okay',
};

const TEXT: Record<PrimaryEmotion, string> = {
  happy: 'text-zen-emotion-joy',
  sad: 'text-zen-emotion-sadness',
  angry: 'text-zen-emotion-anger',
  fearful: 'text-zen-emotion-fear',
  disgusted: 'text-zen-emotion-disgust',
  surprised: 'text-zen-emotion-surprise',
  bad: 'text-zen-emotion-okay',
};

/** Idle → hover → selected option surfaces (primary family accent). */
export const OPTION_IDLE =
  'bg-zen-surface text-zen-fg border-zen-border-soft/70';

export const OPTION_HOVER: Record<PrimaryEmotion, string> = {
  happy:
    'hover:bg-zen-emotion-joy-soft hover:border-zen-emotion-joy/45 hover:text-zen-emotion-joy hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-joy)/0.55)]',
  sad:
    'hover:bg-zen-emotion-sadness-soft hover:border-zen-emotion-sadness/45 hover:text-zen-emotion-sadness hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-sadness)/0.55)]',
  angry:
    'hover:bg-zen-emotion-anger-soft hover:border-zen-emotion-anger/45 hover:text-zen-emotion-anger hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-anger)/0.55)]',
  fearful:
    'hover:bg-zen-emotion-fear-soft hover:border-zen-emotion-fear/45 hover:text-zen-emotion-fear hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-fear)/0.55)]',
  disgusted:
    'hover:bg-zen-emotion-disgust-soft hover:border-zen-emotion-disgust/45 hover:text-zen-emotion-disgust hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-disgust)/0.55)]',
  surprised:
    'hover:bg-zen-emotion-surprise-soft hover:border-zen-emotion-surprise/45 hover:text-zen-emotion-surprise hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-surprise)/0.55)]',
  bad:
    'hover:bg-zen-emotion-okay-soft hover:border-zen-emotion-okay/45 hover:text-zen-emotion-okay hover:shadow-[0_8px_20px_-14px_hsl(var(--zen-emotion-okay)/0.55)]',
};

export const OPTION_SELECTED: Record<PrimaryEmotion, string> = {
  happy:
    'bg-zen-emotion-joy-soft text-zen-emotion-joy border-zen-emotion-joy/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-joy)/0.5)]',
  sad:
    'bg-zen-emotion-sadness-soft text-zen-emotion-sadness border-zen-emotion-sadness/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-sadness)/0.5)]',
  angry:
    'bg-zen-emotion-anger-soft text-zen-emotion-anger border-zen-emotion-anger/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-anger)/0.5)]',
  fearful:
    'bg-zen-emotion-fear-soft text-zen-emotion-fear border-zen-emotion-fear/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-fear)/0.5)]',
  disgusted:
    'bg-zen-emotion-disgust-soft text-zen-emotion-disgust border-zen-emotion-disgust/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-disgust)/0.5)]',
  surprised:
    'bg-zen-emotion-surprise-soft text-zen-emotion-surprise border-zen-emotion-surprise/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-surprise)/0.5)]',
  bad:
    'bg-zen-emotion-okay-soft text-zen-emotion-okay border-zen-emotion-okay/55 shadow-[0_8px_22px_-14px_hsl(var(--zen-emotion-okay)/0.5)]',
};

export const OPTION_FOCUS: Record<PrimaryEmotion, string> = {
  happy: 'focus-visible:outline-zen-emotion-joy',
  sad: 'focus-visible:outline-zen-emotion-sadness',
  angry: 'focus-visible:outline-zen-emotion-anger',
  fearful: 'focus-visible:outline-zen-emotion-fear',
  disgusted: 'focus-visible:outline-zen-emotion-disgust',
  surprised: 'focus-visible:outline-zen-emotion-surprise',
  bad: 'focus-visible:outline-zen-emotion-okay',
};

export const CTA_HOVER: Record<PrimaryEmotion, string> = {
  happy: 'hover:border-zen-emotion-joy/40 hover:bg-zen-emotion-joy-soft/70',
  sad: 'hover:border-zen-emotion-sadness/40 hover:bg-zen-emotion-sadness-soft/70',
  angry: 'hover:border-zen-emotion-anger/40 hover:bg-zen-emotion-anger-soft/70',
  fearful: 'hover:border-zen-emotion-fear/40 hover:bg-zen-emotion-fear-soft/70',
  disgusted: 'hover:border-zen-emotion-disgust/40 hover:bg-zen-emotion-disgust-soft/70',
  surprised: 'hover:border-zen-emotion-surprise/40 hover:bg-zen-emotion-surprise-soft/70',
  bad: 'hover:border-zen-emotion-okay/40 hover:bg-zen-emotion-okay-soft/70',
};

export const CTA_FOCUS: Record<PrimaryEmotion, string> = OPTION_FOCUS;

export function primarySoftBg(primary: PrimaryEmotion): string {
  return SOFT_BG[primary];
}

export function primaryText(primary: PrimaryEmotion): string {
  return TEXT[primary];
}

/** Solid emotion color for SVG fills / progress. */
export function primaryCssVar(primary: PrimaryEmotion): string {
  return `hsl(var(--zen-emotion-${PRIMARY_TOKEN[primary]}))`;
}

export function primarySoftCssVar(primary: PrimaryEmotion): string {
  return `hsl(var(--zen-emotion-${PRIMARY_TOKEN[primary]}-soft))`;
}

export function primaryGlowCss(primary: PrimaryEmotion, alpha = 0.45): string {
  return `hsl(var(--zen-emotion-${PRIMARY_TOKEN[primary]}) / ${alpha})`;
}

export const PRIMARY_ORDER: PrimaryEmotion[] = [
  'happy',
  'sad',
  'angry',
  'fearful',
  'disgusted',
  'surprised',
  'bad',
];
