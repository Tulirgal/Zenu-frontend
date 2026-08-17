'use client';

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export function GratitudeOrb({
  size = 28,
  pulse = true,
  className,
  style,
}: {
  size?: number;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={cn('pointer-events-none relative', className)}
      style={{ width: size, height: size, ...style }}
      animate={pulse ? { scale: [1, 1.08, 1] } : undefined}
      transition={
        pulse
          ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
    >
      <div
        className="absolute inset-[-120%] rounded-full opacity-70 blur-md"
        style={{
          background:
            'radial-gradient(circle, hsl(40 90% 88% / 0.85) 0%, hsl(32 70% 70% / 0.35) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, hsl(0 0% 100%) 0%, hsl(40 60% 92%) 35%, hsl(32 55% 72%) 100%)',
          boxShadow: '0 0 18px hsl(40 80% 70% / 0.55)',
        }}
      />
    </motion.div>
  );
}
