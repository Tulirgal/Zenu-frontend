'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
};

function seedParticles(count: number, seed: number): Particle[] {
  const out: Particle[] = [];
  let s = seed || 1;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < count; i += 1) {
    const angle = next() * Math.PI * 2;
    const dist = 12 + next() * 28;
    out.push({
      id: i,
      x: Math.cos(angle) * (4 + next() * 8),
      y: Math.sin(angle) * (4 + next() * 8),
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 8,
      size: 2 + next() * 3,
      delay: next() * 0.2,
    });
  }
  return out;
}

export function GratitudeParticles({
  count = 10,
  seed = 42,
  className,
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const particles = useMemo(() => seedParticles(count, seed), [count, seed]);

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full bg-[hsl(40_80%_85%)]"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            boxShadow: '0 0 6px hsl(40 90% 70% / 0.6)',
          }}
          initial={{ x: p.x, y: p.y, opacity: 0.9, scale: 1 }}
          animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.85, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
