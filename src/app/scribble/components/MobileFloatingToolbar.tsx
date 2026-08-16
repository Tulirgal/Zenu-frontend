'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Circle,
  Download,
  Eraser,
  Grid3x3,
  MoreHorizontal,
  MousePointer,
  Pen,
  RectangleHorizontal,
  Redo,
  Sticker,
  Trash2,
  Type,
  Undo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ZenDialog,
  ZenDialogContent,
  ZenDialogDescription,
  ZenDialogFooter,
  ZenDialogHeader,
  ZenDialogTitle,
  ZenSheet,
  ZenSheetContent,
  ZenSheetHeader,
  ZenSheetTitle,
} from '@/components/zen';
import { useCanvasStore } from '../store/canvasStore';
import { useToolStore } from '../store/toolStore';
import { clearScribbleCanvas, exportScribblePng } from '../utils/exportCanvas';
import { ZoomPill } from './ZoomPill';

const chip = (active: boolean) =>
  cn(
    'inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-zen-full',
    'transition-colors duration-200 ease-out active:scale-[0.97]',
    'focus-visible:outline-2 focus-visible:outline-zen-secondary focus-visible:outline-offset-2',
    active
      ? 'bg-zen-secondary-soft text-zen-secondary ring-1 ring-zen-secondary/25'
      : 'text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg',
  );

type PanelMode = 'pen' | 'eraser' | null;

export function MobileFloatingToolbar({ onSaved }: { onSaved?: () => void }) {
  const {
    activeTool,
    setTool,
    color,
    setColor,
    penSize,
    setPenSize,
    penOpacity,
    setPenOpacity,
    eraserSize,
    setEraserSize,
    eraserOpacity,
    setEraserOpacity,
    gridEnabled,
    toggleGrid,
    setShowStickerPanel,
    zoom,
  } = useToolStore();
  const { undo, redo } = useCanvasStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [panel, setPanel] = useState<PanelMode>(null);
  const kitRef = useRef<HTMLDivElement>(null);

  const isDraw = activeTool === 'Draw';
  const isErase = activeTool === 'Erase';

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
    setTool('Draw');
    setPanel('pen');
  };

  const selectEraser = () => {
    if (isErase && panel === 'eraser') {
      setPanel(null);
      return;
    }
    setTool('Erase');
    setPanel('eraser');
  };

  return (
    <>
      <div
        className={cn(
          'md:hidden pointer-events-none absolute inset-x-0 z-30 overflow-x-hidden',
          'bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))]',
          'flex justify-center px-3',
        )}
      >
        <div
          ref={kitRef}
          className="pointer-events-auto flex w-full max-w-[20rem] flex-col items-stretch gap-2 overflow-x-hidden"
        >
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
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Pen color"
                  />
                </label>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="mobile-pen-size" className="font-ui text-sm text-zen-fg-muted">
                    Size
                  </label>
                  <span className="font-ui text-sm tabular-nums text-zen-fg">{penSize}px</span>
                </div>
                <input
                  id="mobile-pen-size"
                  type="range"
                  min={1}
                  max={40}
                  value={penSize}
                  onChange={(e) => setPenSize(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--zen-secondary))]"
                  aria-label="Pen size"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="mobile-pen-opacity" className="font-ui text-sm text-zen-fg-muted">
                    Opacity
                  </label>
                  <span className="font-ui text-sm tabular-nums text-zen-fg">
                    {penOpacity.toFixed(2)}
                  </span>
                </div>
                <input
                  id="mobile-pen-opacity"
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={penOpacity}
                  onChange={(e) => setPenOpacity(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--zen-secondary))]"
                  aria-label="Pen opacity"
                />
              </div>
            </div>
          ) : null}

          {panel === 'eraser' ? (
            <div className="rounded-zen-2xl border border-zen-border-soft/70 bg-white px-3.5 py-3 shadow-[0_10px_28px_-14px_rgba(30,41,90,0.2)]">
              <p className="font-ui text-[0.6875rem] font-semibold uppercase tracking-wider text-zen-fg-subtle mb-2.5">
                Eraser
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="mobile-eraser-size" className="font-ui text-sm text-zen-fg-muted">
                    Size
                  </label>
                  <span className="font-ui text-sm tabular-nums text-zen-fg">{eraserSize}px</span>
                </div>
                <input
                  id="mobile-eraser-size"
                  type="range"
                  min={1}
                  max={60}
                  value={eraserSize}
                  onChange={(e) => setEraserSize(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--zen-secondary))]"
                  aria-label="Eraser size"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="mobile-eraser-opacity" className="font-ui text-sm text-zen-fg-muted">
                    Opacity
                  </label>
                  <span className="font-ui text-sm tabular-nums text-zen-fg">
                    {eraserOpacity.toFixed(2)}
                  </span>
                </div>
                <input
                  id="mobile-eraser-opacity"
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={eraserOpacity}
                  onChange={(e) => setEraserOpacity(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--zen-secondary))]"
                  aria-label="Eraser opacity"
                />
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              'mx-auto flex max-w-full items-center gap-1 overflow-x-hidden rounded-zen-full border border-zen-border-soft/70',
              'bg-white/95 backdrop-blur-md px-2 py-1.5',
              'shadow-[0_8px_24px_-14px_rgba(30,41,90,0.22)]',
            )}
            role="toolbar"
            aria-label="Drawing tools"
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
            <button type="button" className={chip(false)} aria-label="Undo" onClick={undo}>
              <Undo className="h-4 w-4" aria-hidden="true" />
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
        <ZenSheetContent side="bottom" className="rounded-t-zen-2xl max-h-[70dvh] overflow-x-hidden">
          <ZenSheetHeader>
            <ZenSheetTitle className="font-ui text-base">More tools</ZenSheetTitle>
          </ZenSheetHeader>

          <div className="mt-4 space-y-5 pb-6 overflow-x-hidden">
            <div>
              <p className="font-ui text-[0.6875rem] uppercase tracking-wider text-zen-fg-subtle mb-2">
                Create
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border font-ui text-sm',
                    activeTool === 'Select'
                      ? 'border-zen-secondary/40 bg-zen-secondary-soft text-zen-secondary'
                      : 'border-zen-border-soft text-zen-fg',
                  )}
                  onClick={() => {
                    setTool('Select');
                    setMoreOpen(false);
                  }}
                >
                  <MousePointer className="h-4 w-4" aria-hidden="true" />
                  Select
                </button>
                {(
                  [
                    ['Rectangle', RectangleHorizontal],
                    ['Circle', Circle],
                    ['Text', Type],
                  ] as const
                ).map(([label, Icon]) => (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border font-ui text-sm',
                      activeTool === label
                        ? 'border-zen-secondary/40 bg-zen-secondary-soft text-zen-secondary'
                        : 'border-zen-border-soft text-zen-fg',
                    )}
                    aria-pressed={activeTool === label}
                    onClick={() => {
                      setTool(label);
                      setMoreOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg"
                  onClick={() => {
                    setShowStickerPanel(true);
                    setTool('Sticker');
                    setMoreOpen(false);
                  }}
                >
                  <Sticker className="h-4 w-4" aria-hidden="true" />
                  Stickers
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border font-ui text-sm',
                  gridEnabled
                    ? 'border-zen-secondary/40 bg-zen-secondary-soft text-zen-secondary'
                    : 'border-zen-border-soft text-zen-fg',
                )}
                aria-pressed={gridEnabled}
                onClick={toggleGrid}
              >
                <Grid3x3 className="h-4 w-4" aria-hidden="true" />
                Grid
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 min-h-11 px-3 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg"
                onClick={redo}
              >
                <Redo className="h-4 w-4" aria-hidden="true" />
                Redo
              </button>
            </div>

            <div>
              <p className="font-ui text-[0.6875rem] uppercase tracking-wider text-zen-fg-subtle mb-2">
                Zoom ({Math.round(zoom * 100)}%)
              </p>
              <ZoomPill />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 min-h-11 rounded-zen-xl bg-zen-secondary-soft text-zen-secondary font-ui text-sm font-medium"
                onClick={() => {
                  if (exportScribblePng()) {
                    onSaved?.();
                    setMoreOpen(false);
                  }
                }}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Save drawing
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 min-h-11 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg-muted"
                onClick={() => {
                  setMoreOpen(false);
                  setConfirmClear(true);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear canvas
              </button>
            </div>
          </div>
        </ZenSheetContent>
      </ZenSheet>

      <ZenDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <ZenDialogContent className="max-w-sm mx-4">
          <ZenDialogHeader>
            <ZenDialogTitle className="font-ui">Clear this drawing?</ZenDialogTitle>
            <ZenDialogDescription className="font-ui">
              This removes everything on the canvas.
            </ZenDialogDescription>
          </ZenDialogHeader>
          <ZenDialogFooter className="pb-[env(safe-area-inset-bottom,0px)]">
            <button
              type="button"
              className="min-h-11 rounded-zen-xl px-4 font-ui text-sm text-zen-fg-muted hover:bg-zen-bg-subtle active:scale-[0.97]"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="min-h-11 rounded-zen-xl px-4 bg-zen-danger-soft text-zen-danger font-ui text-sm font-medium active:scale-[0.97]"
              onClick={() => {
                clearScribbleCanvas();
                setConfirmClear(false);
              }}
            >
              Clear
            </button>
          </ZenDialogFooter>
        </ZenDialogContent>
      </ZenDialog>
    </>
  );
}
