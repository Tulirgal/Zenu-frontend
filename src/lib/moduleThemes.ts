export interface ModuleTheme {
  gradient: string; // CSS gradient for page background
  accentColor: string; // Primary accent (buttons, highlights)
  accentLight: string; // Light version for cards/panels
  textPrimary: string; // Main text color
  textSecondary: string; // Secondary text
  cardBg: string; // Card background
  cardBorder: string; // Card border
  particles: ParticleConfig;
  liveEffect: 'bubbles' | 'stars' | 'leaves' | 'fireflies' | 'ripples' | 'clouds' | 'aurora' | 'petals' | 'none';
}

interface ParticleConfig {
  color: string;
  count: number;
  size: [number, number]; // [min, max]
  speed: number;
}

export const MODULE_THEMES: Record<string, ModuleTheme> = {
  // HOME / DASHBOARD — soft dawn aurora
  home: {
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
    accentColor: '#a78bfa',
    accentLight: 'rgba(167,139,250,0.12)',
    textPrimary: '#f1f0ff',
    textSecondary: '#c4b5fd',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(167,139,250,0.2)',
    particles: { color: '#c4b5fd', count: 30, size: [1, 3], speed: 0.3 },
    liveEffect: 'aurora',
  },
  // BREATHING — ocean blues, expansive
  breathing: {
    gradient: 'linear-gradient(180deg, #001a2c 0%, #003d5c 40%, #00688b 80%, #0099bb 100%)',
    accentColor: '#38bdf8',
    accentLight: 'rgba(56,189,248,0.12)',
    textPrimary: '#e0f7ff',
    textSecondary: '#7dd3fc',
    cardBg: 'rgba(0,100,150,0.25)',
    cardBorder: 'rgba(56,189,248,0.25)',
    particles: { color: '#38bdf8', count: 20, size: [2, 5], speed: 0.2 },
    liveEffect: 'ripples',
  },
  // MINDFULNESS — deep forest green, grounding
  mindfulness: {
    gradient: 'linear-gradient(160deg, #0d1f12 0%, #1a3a22 35%, #2d5a3d 70%, #1a3a22 100%)',
    accentColor: '#4ade80',
    accentLight: 'rgba(74,222,128,0.1)',
    textPrimary: '#dcfce7',
    textSecondary: '#86efac',
    cardBg: 'rgba(20,60,30,0.4)',
    cardBorder: 'rgba(74,222,128,0.2)',
    particles: { color: '#86efac', count: 25, size: [2, 6], speed: 0.15 },
    liveEffect: 'leaves',
  },
  // GRATITUDE — warm golden sunrise
  gratitude: {
    gradient: 'linear-gradient(160deg, #1a0a00 0%, #3d1f00 30%, #7c4000 60%, #c8740a 85%, #f2c14e 100%)',
    accentColor: '#f59e0b',
    accentLight: 'rgba(245,158,11,0.12)',
    textPrimary: '#fef9ee',
    textSecondary: '#fcd34d',
    cardBg: 'rgba(120,60,0,0.3)',
    cardBorder: 'rgba(245,158,11,0.25)',
    particles: { color: '#fcd34d', count: 20, size: [1, 3], speed: 0.2 },
    liveEffect: 'petals',
  },
  // DIARY / MY DIARY — twilight purple, introspective
  diary: {
    gradient: 'linear-gradient(150deg, #0f0817 0%, #1e1035 40%, #2d1b69 75%, #1e1035 100%)',
    accentColor: '#818cf8',
    accentLight: 'rgba(129,140,248,0.12)',
    textPrimary: '#eef2ff',
    textSecondary: '#a5b4fc',
    cardBg: 'rgba(30,16,53,0.5)',
    cardBorder: 'rgba(129,140,248,0.2)',
    particles: { color: '#a5b4fc', count: 40, size: [1, 2], speed: 0.1 },
    liveEffect: 'stars',
  },
  // DOODLE DREAMS — vibrant creative rainbow
  doodle: {
    gradient: 'linear-gradient(135deg, #1a0533 0%, #2d0d5e 25%, #1e3a8a 55%, #065f46 85%, #1a0533 100%)',
    accentColor: '#f0abfc',
    accentLight: 'rgba(240,171,252,0.12)',
    textPrimary: '#fdf4ff',
    textSecondary: '#e879f9',
    cardBg: 'rgba(45,13,94,0.4)',
    cardBorder: 'rgba(240,171,252,0.2)',
    particles: { color: '#f0abfc', count: 35, size: [2, 5], speed: 0.25 },
    liveEffect: 'bubbles',
  },
  // BUBBLE CANVAS — playful aqua
  bubble: {
    gradient: 'linear-gradient(160deg, #001219 0%, #005f73 40%, #0a9396 75%, #94d2bd 100%)',
    accentColor: '#94d2bd',
    accentLight: 'rgba(148,210,189,0.12)',
    textPrimary: '#e8f8f5',
    textSecondary: '#94d2bd',
    cardBg: 'rgba(0,95,115,0.3)',
    cardBorder: 'rgba(148,210,189,0.25)',
    particles: { color: '#94d2bd', count: 18, size: [8, 24], speed: 0.3 },
    liveEffect: 'bubbles',
  },
  // BURST IT OUT — deep cosmic release
  burst: {
    gradient: 'linear-gradient(160deg, #0a0514 0%, #1e1035 35%, #3b1c7a 70%, #2d1b69 100%)',
    accentColor: '#c084fc',
    accentLight: 'rgba(192,132,252,0.12)',
    textPrimary: '#faf5ff',
    textSecondary: '#d8b4fe',
    cardBg: 'rgba(30,16,53,0.5)',
    cardBorder: 'rgba(192,132,252,0.25)',
    particles: { color: '#e9d5ff', count: 45, size: [1, 3], speed: 0.8 },
    liveEffect: 'stars',
  },
  // SCRIBBLE PAD — warm cream with ink
  scribble: {
    gradient: 'linear-gradient(150deg, #1c1410 0%, #2d1f14 40%, #3d2a1a 70%, #1c1410 100%)',
    accentColor: '#d97706',
    accentLight: 'rgba(217,119,6,0.12)',
    textPrimary: '#fef3c7',
    textSecondary: '#fcd34d',
    cardBg: 'rgba(45,30,20,0.5)',
    cardBorder: 'rgba(217,119,6,0.2)',
    particles: { color: '#fcd34d', count: 12, size: [1, 3], speed: 0.15 },
    liveEffect: 'none',
  },
  // SEVIYAN CHAT — calming midnight blue
  chat: {
    gradient: 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #1e3a5f 75%, #0f172a 100%)',
    accentColor: '#60a5fa',
    accentLight: 'rgba(96,165,250,0.1)',
    textPrimary: '#eff6ff',
    textSecondary: '#93c5fd',
    cardBg: 'rgba(15,23,42,0.6)',
    cardBorder: 'rgba(96,165,250,0.2)',
    particles: { color: '#93c5fd', count: 25, size: [1, 2], speed: 0.1 },
    liveEffect: 'stars',
  },
  // HEALING GARDEN — deep forest night
  'healing-garden': {
    gradient: 'linear-gradient(180deg, #0a1628 0%, #0d2137 30%, #0f3d2a 65%, #0a1628 100%)',
    accentColor: '#4ade80',
    accentLight: 'rgba(74,222,128,0.1)',
    textPrimary: '#f0fff4',
    textSecondary: '#86efac',
    cardBg: 'rgba(10,22,40,0.5)',
    cardBorder: 'rgba(74,222,128,0.15)',
    particles: { color: '#f2c14e', count: 8, size: [3, 5], speed: 0.15 },
    liveEffect: 'fireflies',
  },
  // INNER COMPASS — light pink
  innercompass: {
    gradient: 'linear-gradient(160deg, #FFF0F5 0%, #FFE1E9 50%, #FFD1DF 100%)',
    accentColor: '#ec4899',
    accentLight: 'rgba(236,72,153,0.1)',
    textPrimary: '#831843',
    textSecondary: '#be185d',
    cardBg: 'rgba(255,255,255,0.6)',
    cardBorder: 'rgba(236,72,153,0.2)',
    particles: { color: '#fbcfe8', count: 30, size: [2, 5], speed: 0.15 },
    liveEffect: 'petals',
  },
};

export function getTheme(moduleKey: string): ModuleTheme {
  return MODULE_THEMES[moduleKey] || MODULE_THEMES.home;
}
