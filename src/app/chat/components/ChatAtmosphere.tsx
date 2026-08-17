'use client';

import { motion } from 'framer-motion';
import type { PandaEmotion } from '@/components/panda/types';
import { atmosphereWash } from './mapChatSentiment';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Subtle emotional wash over the existing ModulePage theme — never replaces it.
 */
export function ChatAtmosphere({ emotion }: { emotion: PandaEmotion }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-50"
      key={emotion}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { duration: 2.2, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ background: atmosphereWash(emotion) }}
    />
  );
}
