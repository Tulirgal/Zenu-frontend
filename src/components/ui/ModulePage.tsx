'use client';

import { ReactNode } from 'react';
import { ModuleTheme } from '@/lib/moduleThemes';
import LiveBackground from './LiveBackground';
import { cn } from '@/lib/utils';

interface Props {
  theme: ModuleTheme;
  children: ReactNode;
  className?: string;
}

/**
 * Full-bleed module shell.
 * Gradient paints every layer so cream body/`main` padding never shows through.
 */
export default function ModulePage({ theme, children, className }: Props) {
  return (
    <div
      className={cn(
        'relative isolate flex h-full min-h-full w-full flex-1 flex-col',
        className,
      )}
      style={{
        background: theme.gradient,
        color: theme.textPrimary,
      }}
    >
      {/* Extra document-tall paint (covers scroll + absolute fill shells) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 min-h-full"
        style={{ background: theme.gradient }}
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <LiveBackground theme={theme} />
      </div>

      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
