'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToolStore } from '../store/toolStore';

export function ZoomPill({ className }: { className?: string }) {
  const { zoom, setZoom } = useToolStore();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-zen-full border border-zen-border-soft/70',
        'bg-zen-surface/90 backdrop-blur-md px-1.5 py-1',
        'shadow-[0_6px_18px_-12px_rgba(30,41,90,0.18)]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}
        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="font-ui text-xs font-medium text-zen-fg min-w-[3rem] text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
