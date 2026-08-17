'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING = { type: 'spring' as const, bounce: 0, duration: 0.4 };

/**
 * Organic chat bubble. Bloom only when `bloom` is true (newest assistant reply).
 */
export function ChatBubble({
  role,
  content,
  bloom = false,
  className,
}: {
  role: 'user' | 'assistant';
  content: string;
  bloom?: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isUser = role === 'user';

  const bloomMotion =
    bloom && !reducedMotion
      ? {
          initial: { opacity: 0, scale: 0.95, y: 15 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: SPRING,
        }
      : bloom && reducedMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.18 },
          }
        : {
            initial: false as const,
            animate: { opacity: 1, scale: 1, y: 0 },
          };

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start', className)}>
      <motion.div
        {...bloomMotion}
        style={{
          transformOrigin: isUser ? 'bottom right' : 'bottom left',
        }}
        className={cn(
          'relative max-w-[85%] px-5 py-4 shadow-zen-subtle lg:max-w-[70%]',
          isUser
            ? 'ml-8 rounded-[1.25rem_1.25rem_0.5rem_1.25rem] bg-zen-primary text-white lg:ml-16'
            : 'mr-8 rounded-[1.25rem_1.25rem_1.25rem_0.5rem] border border-zen-border bg-white text-zen-fg lg:mr-16',
        )}
      >
        <p className="zen-body whitespace-pre-wrap leading-relaxed md:text-lg">{content}</p>
      </motion.div>
    </div>
  );
}
