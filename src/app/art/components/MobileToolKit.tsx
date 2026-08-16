'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eraser,
  Grid3x3,
  MoreHorizontal,
  Paintbrush,
  Pen,
  Redo2,
  Trash2,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ZenSheet,
  ZenSheetContent,
  ZenSheetHeader,
  ZenSheetTitle,
} from '@/components/zen';
import type { DoodleTool } from './SymmetryCanvas';
import { DOODLE_PALETTE } from './DesktopToolKit';

const chip = (active: boolean) =>
  cn(
    'inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-zen-full',
    'transition-colors duration-200 ease-out active:scale-[0.97]',
    'focus-visible:outline-2 focus-visible:outline-zen-secondary focus-visible:outline-offset-2',
    active
      ? 'bg-zen-secondary-soft text-zen-secondary ring-1 ring-zen-secondary/25'
      : 'text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg',
  );

type PanelMode = 'pen' | 'eraser' | null;

type MobileToolKitProps = {
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
  zoom?: number;
  onZoomChange?: (z: number) => void;
};

export function MobileToolKit({
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
  zoom = 1,
  onZoomChange,
}: MobileToolKitProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [panel, setPanel] = useState<PanelMode>(null);
  const kitRef = useRef<HTMLDivElement>(null);

  const isDraw = tool === 'draw';
  const isErase = tool === 'eraser';

  useEffect(() => {
    if (!panel) return;
    const onPointer = (e: PointerEvent) => {
      if (kitRef.current && !kitRef.current.contains(e.target as Node)) {
        setPanel(null);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [panel]);

  const selectPen = () => {
    if (isDraw && panel === 'pen') {
      setPanel(null);
      return;
    }
    onToolChange('draw');
    setPanel('pen');
  };

  const selectEraser = () => {
    if (isErase && panel === 'eraser') {
      setPanel(null);
      return;
    }
    onToolChange('eraser');
    setPanel('eraser');
  };

  return (
    <>
      <div
        className={cn(
          'md:hidden pointer-events-none absolute inset-x-0 z-30',
          'bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))]',
          'flex justify-center px-3',
        )}
      >
        <div ref={kitRef} className="pointer-events-auto flex w-full max-w-[22rem] flex-col items-stretch gap-2">
          {panel === 'pen' ? (
            <div className="rounded-zen-2xl border border-zen-border-soft/70 bg-white px-3.5 py-3 shadow-[0_10px_28px_-14px_rgba(30,41,90,0.2)]">
              <p className="font-ui text-[0.6875rem] font-semibold uppercase tracking-wider text-zen-fg-subtle mb-2.5">
                Pen
              </p>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-ui text-sm text-zen-fg-muted">Color</span>
                <label className="relative inline-flex h-11 w-11 cursor-pointer overflow-hidden rounded-full border border-zen-border-soft">
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
              <div className="grid grid-cols-8 gap-1 mb-3">
                {DOODLE_PALETTE.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    className="h-8 rounded-zen-md border border-zen-border-soft/80 active:scale-[0.97]"
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={swatch.name}
                    onClick={() => onColorChange(swatch.hex)}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="mobile-doodle-pen" className="font-ui text-sm text-zen-fg-muted">
                  Size
                </label>
                <span className="font-ui text-sm tabular-nums text-zen-fg">{brushSize}px</span>
              </div>
              <input
                id="mobile-doodle-pen"
                type="range"
                min={1}
                max={40}
                value={brushSize}
                onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                className="w-full accent-[hsl(var(--zen-secondary))]"
                aria-label="Pen size"
              />
            </div>
          ) : null}

          {panel === 'eraser' ? (
            <div className="rounded-zen-2xl border border-zen-border-soft/70 bg-white px-3.5 py-3 shadow-[0_10px_28px_-14px_rgba(30,41,90,0.2)]">
              <p className="font-ui text-[0.6875rem] font-semibold uppercase tracking-wider text-zen-fg-subtle mb-2.5">
                Eraser
              </p>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="mobile-doodle-eraser" className="font-ui text-sm text-zen-fg-muted">
                  Size
                </label>
                <span className="font-ui text-sm tabular-nums text-zen-fg">{eraserSize}px</span>
              </div>
              <input
                id="mobile-doodle-eraser"
                type="range"
                min={4}
                max={120}
                value={eraserSize}
                onChange={(e) => onEraserSizeChange(Number(e.target.value))}
                className="w-full accent-[hsl(var(--zen-secondary))]"
                aria-label="Eraser size"
              />
            </div>
          ) : null}

          <div
            className={cn(
              'mx-auto flex items-center gap-1 rounded-zen-full border border-zen-border-soft/70',
              'bg-white/95 backdrop-blur-md px-2 py-1.5',
              'shadow-[0_8px_24px_-14px_rgba(30,41,90,0.22)]',
            )}
            role="toolbar"
            aria-label="Doodle tools"
          >
            <button
              type="button"
              className={chip(isDraw)}
              aria-label="Pen"
              aria-pressed={isDraw}
              aria-expanded={panel === 'pen'}
              onClick={selectPen}
            >
              <Pen className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={chip(isErase)}
              aria-label="Eraser"
              aria-pressed={isErase}
              aria-expanded={panel === 'eraser'}
              onClick={selectEraser}
            >
              <Eraser className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={chip(false)}
              aria-label="Undo"
              disabled={!canUndo}
              onClick={onUndo}
            >
              <Undo2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={chip(moreOpen)}
              aria-label="More tools"
              aria-expanded={moreOpen}
              onClick={() => {
                setPanel(null);
                setMoreOpen(true);
              }}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ZenSheet open={moreOpen} onOpenChange={setMoreOpen}>
        <ZenSheetContent side="bottom" className="rounded-t-zen-2xl max-h-[70dvh]">
          <ZenSheetHeader>
            <ZenSheetTitle className="font-ui text-base">More tools</ZenSheetTitle>
          </ZenSheetHeader>
          <div className="mt-4 space-y-4 pb-6">
            <p className="font-ui text-xs text-zen-fg-subtle">12-fold symmetry</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border font-ui text-sm',
                  tool === 'fill'
                    ? 'border-zen-secondary/40 bg-zen-secondary-soft text-zen-secondary'
                    : 'border-zen-border-soft text-zen-fg',
                )}
                onClick={() => {
                  onToolChange('fill');
                  setMoreOpen(false);
                }}
              >
                <Paintbrush className="h-4 w-4" aria-hidden="true" />
                Fill
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border font-ui text-sm',
                  showGuides
                    ? 'border-zen-secondary/40 bg-zen-secondary-soft text-zen-secondary'
                    : 'border-zen-border-soft text-zen-fg',
                )}
                onClick={onToggleGuides}
              >
                <Grid3x3 className="h-4 w-4" aria-hidden="true" />
                Guides
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg disabled:opacity-40"
                disabled={!canRedo}
                onClick={onRedo}
              >
                <Redo2 className="h-4 w-4" aria-hidden="true" />
                Redo
              </button>
            </div>

            {onZoomChange ? (
              <div>
                <p className="font-ui text-[0.6875rem] uppercase tracking-wider text-zen-fg-subtle mb-2">
                  Zoom ({Math.round(zoom * 100)}%)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="min-h-11 min-w-11 rounded-zen-xl border border-zen-border-soft font-ui text-lg"
                    aria-label="Zoom out"
                    onClick={() => onZoomChange(Math.max(zoom - 0.1, 0.5))}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="min-h-11 min-w-11 rounded-zen-xl border border-zen-border-soft font-ui text-lg"
                    aria-label="Zoom in"
                    onClick={() => onZoomChange(Math.min(zoom + 0.1, 2))}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-zen-xl bg-zen-secondary-soft text-zen-secondary font-ui text-sm font-medium"
              onClick={() => {
                onSave();
                setMoreOpen(false);
              }}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Save drawing
            </button>

            {!confirmClear ? (
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg-muted"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear canvas
              </button>
            ) : (
              <div className="rounded-zen-xl border border-zen-border-soft p-3">
                <p className="font-ui text-sm text-zen-fg mb-2">Clear this pattern?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 min-h-11 rounded-zen-lg font-ui text-sm text-zen-fg-muted"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-h-11 rounded-zen-lg bg-zen-danger-soft text-zen-danger font-ui text-sm font-medium"
                    onClick={() => {
                      onClear();
                      setConfirmClear(false);
                      setMoreOpen(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </ZenSheetContent>
      </ZenSheet>
    </>
  );
}
