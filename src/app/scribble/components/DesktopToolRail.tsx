'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Circle,
  Download,
  Eraser,
  Grid3x3,
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
} from '@/components/zen';
import { useCanvasStore } from '../store/canvasStore';
import { useToolStore } from '../store/toolStore';
import { clearScribbleCanvas, exportScribblePng } from '../utils/exportCanvas';

const toolBtn = (active: boolean) =>
  cn(
    'inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-zen-xl',
    'transition-colors duration-200 ease-out active:scale-[0.97]',
    'focus-visible:outline-2 focus-visible:outline-zen-secondary focus-visible:outline-offset-2',
    active
      ? 'bg-zen-secondary-soft text-zen-secondary ring-1 ring-zen-secondary/25'
      : 'text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg',
  );

function Sep() {
  return <div className="w-8 h-px shrink-0 bg-zen-border-soft my-1" aria-hidden="true" />;
}

type DesktopToolRailProps = {
  onSaved?: () => void;
};

/**
 * Fixed-width vertical rail — vertical scroll only, never horizontal.
 * Pen/Eraser style panel docks beside the rail (outside the scroll clip).
 */
export function DesktopToolRail({ onSaved }: DesktopToolRailProps) {
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
  } = useToolStore();
  const { undo, redo } = useCanvasStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const isDraw = activeTool === 'Draw';
  const isErase = activeTool === 'Erase';
  const showStyle = isDraw || isErase;

  return (
    <>
      <aside
        className="relative hidden md:block shrink-0 w-[3.5rem] min-w-[3.5rem]"
        aria-label="Drawing tools"
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
            className={toolBtn(activeTool === 'Select')}
            aria-label="Select"
            aria-pressed={activeTool === 'Select'}
            title="Select"
            onClick={() => setTool('Select')}
          >
            <MousePointer className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(isDraw)}
            aria-label="Pen"
            aria-pressed={isDraw}
            title="Pen"
            onClick={() => setTool('Draw')}
          >
            <Pen className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(isErase)}
            aria-label="Eraser"
            aria-pressed={isErase}
            title="Eraser"
            onClick={() => setTool('Erase')}
          >
            <Eraser className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(activeTool === 'Rectangle')}
            aria-label="Rectangle"
            aria-pressed={activeTool === 'Rectangle'}
            title="Rectangle"
            onClick={() => setTool('Rectangle')}
          >
            <RectangleHorizontal className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(activeTool === 'Circle')}
            aria-label="Circle"
            aria-pressed={activeTool === 'Circle'}
            title="Circle"
            onClick={() => setTool('Circle')}
          >
            <Circle className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(activeTool === 'Sticker')}
            aria-label="Stickers"
            aria-pressed={activeTool === 'Sticker'}
            title="Stickers"
            onClick={() => {
              setShowStickerPanel(true);
              setTool('Sticker');
            }}
          >
            <Sticker className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(activeTool === 'Text')}
            aria-label="Text"
            aria-pressed={activeTool === 'Text'}
            title="Text"
          onClick={() => setTool('Text')}
          >
            <Type className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(gridEnabled)}
            aria-label="Toggle grid"
            aria-pressed={gridEnabled}
            title="Grid"
            onClick={toggleGrid}
          >
            <Grid3x3 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>

          <Sep />

          <button type="button" className={toolBtn(false)} aria-label="Undo" title="Undo" onClick={undo}>
            <Undo className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button type="button" className={toolBtn(false)} aria-label="Redo" title="Redo" onClick={redo}>
            <Redo className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(false)}
            aria-label="Clear canvas"
            title="Clear"
            onClick={() => setConfirmClear(true)}
          >
            <Trash2 className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={toolBtn(false)}
            aria-label="Save drawing"
            title="Save PNG"
            onClick={() => {
              if (exportScribblePng()) onSaved?.();
            }}
          >
            <Download className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </button>
        </div>

        {showStyle ? (
          <div
            className={cn(
              'absolute left-full top-16 z-40 ml-2 w-48',
              'rounded-zen-2xl border border-zen-border-soft/70 bg-white p-3',
              'shadow-[0_10px_30px_-14px_rgba(30,41,90,0.18)]',
            )}
          >
            <p className="font-ui text-[0.6875rem] font-semibold uppercase tracking-wider text-zen-fg-subtle mb-2">
              {isDraw ? 'Pen' : 'Eraser'}
            </p>

            {isDraw ? (
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-ui text-xs text-zen-fg-muted">Color</span>
                <label className="relative inline-flex h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-zen-border-soft shadow-sm">
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
            ) : null}

            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="scribble-desktop-size" className="font-ui text-xs text-zen-fg-muted">
                  Size
                </label>
                <span className="font-ui text-xs tabular-nums text-zen-fg">
                  {isDraw ? penSize : eraserSize}px
                </span>
              </div>
              <input
                id="scribble-desktop-size"
                type="range"
                min={1}
                max={isDraw ? 40 : 60}
                value={isDraw ? penSize : eraserSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (isDraw) setPenSize(v);
                  else setEraserSize(v);
                }}
                className="w-full accent-[hsl(var(--zen-secondary))]"
                aria-label={isDraw ? 'Pen size' : 'Eraser size'}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="scribble-desktop-opacity" className="font-ui text-xs text-zen-fg-muted">
                  Opacity
                </label>
                <span className="font-ui text-xs tabular-nums text-zen-fg">
                  {(isDraw ? penOpacity : eraserOpacity).toFixed(2)}
                </span>
              </div>
              <input
                id="scribble-desktop-opacity"
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={isDraw ? penOpacity : eraserOpacity}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (isDraw) setPenOpacity(v);
                  else setEraserOpacity(v);
                }}
                className="w-full accent-[hsl(var(--zen-secondary))]"
                aria-label={isDraw ? 'Pen opacity' : 'Eraser opacity'}
              />
            </div>
          </div>
        ) : null}
      </aside>

      <ZenDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <ZenDialogContent className="max-w-sm">
          <ZenDialogHeader>
            <ZenDialogTitle className="font-ui">Clear this drawing?</ZenDialogTitle>
            <ZenDialogDescription className="font-ui">
              This removes everything on the canvas. You can undo after if needed.
            </ZenDialogDescription>
          </ZenDialogHeader>
          <ZenDialogFooter>
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
