'use client';

export const JPMR_STEPS = [
  {
    muscle: 'Hands & Forearms',
    instruction: 'Clench your fists tightly for 5 seconds, then release completely',
  },
  {
    muscle: 'Upper Arms',
    instruction: 'Flex your biceps, hold for 5 seconds, then let go',
  },
  {
    muscle: 'Shoulders',
    instruction: 'Raise shoulders to ears, hold for 5 seconds, then drop',
  },
  {
    muscle: 'Face',
    instruction: 'Scrunch all facial muscles tightly, hold, then relax',
  },
  {
    muscle: 'Chest & Stomach',
    instruction: 'Take a deep breath, hold and tighten core, then exhale fully',
  },
  {
    muscle: 'Legs & Feet',
    instruction: 'Tense thighs, calves and curl toes, hold, then release',
  },
] as const;

export const PRACTICE_TIPS = [
  'Lie down or sit in a comfortable chair',
  "Find a quiet space where you won't be disturbed",
  'Remove glasses or contacts if comfortable',
  'Practice daily for 2 weeks to see lasting results',
  'Best done before sleep or after a stressful event',
] as const;

export function formatPracticeTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
