'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Eraser,
  Grid3x3,
  Paintbrush,
  Pen,
  Redo2,
  Trash2,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DoodleTool } from './SymmetryCanvas';

export const DOODLE_PALETTE = [
  { name: 'Lavender', hex: '#8B7EC8' },
  { name: 'Blue', hex: '#5B8DEF' },
  { name: 'Teal', hex: '#2A9D8F' },
  { name: 'Mint', hex: '#7BC9A6' },
  { name: 'Peach', hex: '#F4A261' },
  { name: 'Coral', hex: '#E76F51' },
  { name: 'Warm yellow', hex: '#E9C46A' },
  { name: 'Deep violet', hex: '#5C4B8A' },
] as const;

const toolBtn = (active: boolean) =>
  cn(
    'inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-zen-xl',
    'transition-colors duration-200 ease-out active:scale-[0.97]',
    'focus-visible:outline-2 focus-visible:outline-zen-secondary focus-visible:outline-offset-2',
    'disabled:opacity-40 disabled:pointer-events-none',
    active
      ? 'bg-zen-secondary-soft text-zen-secondary ring-1 ring-zen-secondary/25'
      : 'text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg',
  );

function Sep() {
  return <div className="w-8 h-px bg-zen-border-soft my-1 shrink-0" aria-hidden="true" />;
}

type DesktopToolKitProps = {
  tool: DoodleTool;
  onToolChange: (t: DoodleTool) => void;
  color: string;
  onColorChange: (c: string) => void;
  brushSize: number;
  onBrushSizeChange: (n: number) => void;
  eraserSize: number;
  onEraserSizeChange: (n: number) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
};

export function DesktopToolKit({
  tool,
  onToolChange,
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  eraserSize,
  onEraserSizeChange,
  showGuides,
  onToggleGuides,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSave,
}: DesktopToolKitProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const isDraw = tool === 'draw';
  const isErase = tool === 'eraser';
  const showStyle = isDraw || isErase;

  useEffect(() => {
    if (!confirmClear) return;
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setConfirmClear(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [confirmClear]);

  return (
    <aside
      ref={panelRef}
      className="relative hidden md:block shrink-0 w-[3.5rem] min-w-[3.5rem]"
      aria-label="Doodle tools"
    >
      <div
        className={cn(
          'flex max-h-full flex-col items-center gap-1 overflow-y-auto overflow-x-hidden overscroll-contain',
          'rounded-zen-2xl border border-zen-border-soft/70 bg-white px-1.5 py-3',
          'shadow-[0_10px_30px_-14px_rgba(30,41,90,0.18)]',
        )}
      >
          <Link href="/" className={toolBtn(false)} aria-label="Back to home" title="Back">
            <ArrowLeft className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </Link>

          <Sep />

          <button
            type="button"
            className={toolBtn(isDraw)}
            aria-label="Pen"
            aria-pressed={isDraw}
            title="Pen"
            onClick={() => onToolChange('draw')}
          >
            <Pen className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(isErase)}
            aria-label="Eraser"
            aria-pressed={isErase}
            title="Eraser"
            onClick={() => onToolChange('eraser')}
          >
            <Eraser className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(tool === 'fill')}
            aria-label="Fill"
            aria-pressed={tool === 'fill'}
            title="Fill"
            onClick={() => onToolChange('fill')}
          >
            <Paintbrush className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(showGuides)}
            aria-label="Toggle symmetry guides"
            aria-pressed={showGuides}
            title="Guides"
            onClick={onToggleGuides}
          >
            <Grid3x3 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>

          <Sep />

          <button
            type="button"
            className={toolBtn(false)}
            aria-label="Undo"
            title="Undo"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo2 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(false)}
            aria-label="Redo"
            title="Redo"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo2 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              type="button"
              className={toolBtn(confirmClear)}
              aria-label="Clear canvas"
              title="Clear"
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
            </button>
            {confirmClear ? (
              <div
                role="dialog"
                aria-label="Clear this pattern?"
                className="absolute left-full bottom-0 ml-2 z-40 w-44 rounded-zen-xl border border-zen-border-soft bg-white p-3 shadow-zen-elevated"
              >
                <p className="font-ui text-xs text-zen-fg mb-2">Clear this pattern?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 min-h-10 rounded-zen-md px-2 py-1.5 font-ui text-xs text-zen-fg-muted hover:bg-zen-bg-subtle"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-h-10 rounded-zen-md px-2 py-1.5 font-ui text-xs font-medium bg-zen-danger-soft text-zen-danger"
                    onClick={() => {
                      onClear();
                      setConfirmClear(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className={toolBtn(false)}
            aria-label="Save pattern"
            title="Save PNG"
            onClick={onSave}
          >
            <Download className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
      </div>

      {/* Outside overflow clip — color / size for active pen or eraser */}
      {showStyle ? (
        <div
          className={cn(
            'absolute left-full top-20 z-40 ml-2 w-48',
            'rounded-zen-2xl border border-zen-border-soft/70 bg-white p-3',
            'shadow-[0_10px_30px_-14px_rgba(30,41,90,0.18)]',
          )}
        >
          <p className="font-ui text-[0.6875rem] font-semibold uppercase tracking-wider text-zen-fg-subtle mb-2">
            {isDraw ? 'Pen' : 'Eraser'}
          </p>

          {isDraw ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-ui text-xs text-zen-fg-muted">Color</span>
                <label className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-zen-border-soft shadow-sm">
                  <span className="sr-only">Pen color</span>
                  <span className="absolute inset-0" style={{ backgroundColor: color }} aria-hidden="true" />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Pen color"
                  />
                </label>
              </div>
              <div className="mb-3 grid grid-cols-4 gap-1.5">
                {DOODLE_PALETTE.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    className={cn(
                      'h-8 w-full rounded-zen-md border transition-transform active:scale-[0.97]',
                      color.toLowerCase() === swatch.hex.toLowerCase()
                        ? 'border-zen-secondary ring-1 ring-zen-secondary/40'
                        : 'border-zen-border-soft/80',
                    )}
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={swatch.name}
                    title={swatch.name}
                    onClick={() => onColorChange(swatch.hex)}
                  />
                ))}
              </div>
            </>
          ) : null}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="doodle-desktop-size" className="font-ui text-xs text-zen-fg-muted">
                Size
              </label>
              <span className="font-ui text-xs tabular-nums text-zen-fg">
                {isDraw ? brushSize : eraserSize}px
              </span>
            </div>
            <input
              id="doodle-desktop-size"
              type="range"
              min={isDraw ? 1 : 4}
              max={isDraw ? 40 : 120}
              value={isDraw ? brushSize : eraserSize}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (isDraw) onBrushSizeChange(v);
                else onEraserSizeChange(v);
              }}
              className="w-full accent-[hsl(var(--zen-secondary))]"
              aria-label={isDraw ? 'Pen size' : 'Eraser size'}
            />
          </div>
        </div>
      ) : null}
    </aside>
  );
}
