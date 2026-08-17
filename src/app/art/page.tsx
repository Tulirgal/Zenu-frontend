'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { trackEngagement } from '@/lib/signals';
import { cn } from '@/lib/utils';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';
import { DoodleHeader } from './components/DoodleHeader';
import { DoodleCompanion } from './components/DoodleCompanion';
import { DesktopToolKit } from './components/DesktopToolKit';
import { MobileToolKit } from './components/MobileToolKit';
import {
  SymmetryCanvas,
  type DoodleTool,
  type SymmetryCanvasHandle,
} from './components/SymmetryCanvas';

/** Local zoom for Doodle view — does not alter symmetry math (pointer uses getBoundingClientRect). */
function DoodleZoomPill({
  zoom,
  setZoom,
}: {
  zoom: number;
  setZoom: (z: number) => void;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-zen-full border border-zen-border-soft/70',
        'bg-zen-surface/90 backdrop-blur-md px-1.5 py-1',
        'shadow-[0_6px_18px_-12px_rgba(30,41,90,0.18)]',
      )}
    >
      <button
        type="button"
        onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97]"
        aria-label="Zoom out"
      >
        −
      </button>
      <span className="font-ui text-xs font-medium text-zen-fg min-w-[3rem] text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97]"
        aria-label="Zoom in"
      >
        +
      </button>
    </div>
  );
}

export default function DoodleDreamsPage() {
  const canvasRef = useRef<SymmetryCanvasHandle>(null);
  const [tool, setTool] = useState<DoodleTool>('draw');
  const [color, setColor] = useState('#5C4B8A');
  const [brushSize, setBrushSize] = useState(5);
  const [eraserSize, setEraserSize] = useState(20);
  const [showGuides, setShowGuides] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [savedPulse, setSavedPulse] = useState(0);
  const [savedToast, setSavedToast] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [viewZoom, setViewZoom] = useState(1);
  const completionShown = useRef(false);

  useEffect(() => {
    trackEngagement('arts_mandala', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('arts_mandala', 'completed', duration);
    };
  }, []);

  const onHistoryChange = useCallback((s: { canUndo: boolean; canRedo: boolean }) => {
    setCanUndo(s.canUndo);
    setCanRedo(s.canRedo);
  }, []);

  const onStrokeCommit = useCallback((count: number) => {
    setStrokeCount(count);
    if (count >= 5 && !completionShown.current) {
      completionShown.current = true;
      setCompletionOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (canvasRef.current?.save()) {
      setSavedPulse((n) => n + 1);
      setSavedToast(true);
      window.setTimeout(() => setSavedToast(false), 1800);
      setCompletionOpen(false);
    }
  };

  const clearAll = () => {
    canvasRef.current?.clear();
    setStrokeCount(0);
    completionShown.current = false;
    setCompletionOpen(false);
  };

  const theme = getTheme('doodle');

  return (
    <ModulePage
      theme={theme}
      className={cn(
        'max-md:absolute max-md:inset-0',
        'max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]',
        'md:relative md:h-full md:min-h-0 md:flex-1',
      )}
    >

      <div className="relative z-10 flex flex-1 min-h-0 gap-2 md:gap-3 px-2 pt-3 pb-2 md:px-4 md:pt-4 md:pb-3">
        <DesktopToolKit
          tool={tool}
          onToolChange={setTool}
          color={color}
          onColorChange={setColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          eraserSize={eraserSize}
          onEraserSizeChange={setEraserSize}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides((v) => !v)}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => canvasRef.current?.undo()}
          onRedo={() => canvasRef.current?.redo()}
          onClear={clearAll}
          onSave={handleSave}
        />

        <div className="relative flex flex-1 min-w-0 min-h-0 flex-col">
          <div className="flex items-start justify-between gap-3 shrink-0 px-0.5">
            <DoodleHeader />
            <span className="mt-1 inline-flex items-center rounded-zen-full border border-zen-border-soft/70 bg-white/80 px-2.5 py-1 font-ui text-[0.6875rem] text-zen-fg-muted shrink-0">
              12-fold symmetry
            </span>
          </div>

          <div className="relative flex-1 min-h-0">
            <div className="absolute inset-0 flex items-center justify-center pb-[4.75rem] md:pb-14">
              <div
                className="h-full w-full flex items-center justify-center"
                style={{
                  transform: viewZoom !== 1 ? `scale(${viewZoom})` : undefined,
                  transformOrigin: 'center center',
                }}
              >
                <SymmetryCanvas
                  ref={canvasRef}
                  tool={tool}
                  color={color}
                  brushSize={brushSize}
                  eraserSize={eraserSize}
                  showGuides={showGuides}
                  onHistoryChange={onHistoryChange}
                  onStrokeCommit={onStrokeCommit}
                  className="h-full w-full"
                />
              </div>
            </div>

            <MobileToolKit
              tool={tool}
              onToolChange={setTool}
              color={color}
              onColorChange={setColor}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              eraserSize={eraserSize}
              onEraserSizeChange={setEraserSize}
              showGuides={showGuides}
              onToggleGuides={() => setShowGuides((v) => !v)}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={() => canvasRef.current?.undo()}
              onRedo={() => canvasRef.current?.redo()}
              onClear={clearAll}
              onSave={handleSave}
              zoom={viewZoom}
              onZoomChange={setViewZoom}
            />

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 md:block">
              <div className="pointer-events-auto">
                <DoodleZoomPill zoom={viewZoom} setZoom={setViewZoom} />
              </div>
            </div>

            <DoodleCompanion strokeCount={strokeCount} savedPulse={savedPulse} />
          </div>
        </div>
      </div>

      {savedToast ? (
        <p
          role="status"
          className="pointer-events-none absolute top-4 left-1/2 z-40 -translate-x-1/2 rounded-zen-full border border-zen-border-soft bg-zen-surface px-4 py-2 font-ui text-sm text-zen-fg shadow-zen-elevated"
        >
          Saved.
        </p>
      ) : null}

      {completionOpen ? (
        <div
          className="absolute bottom-24 md:bottom-8 left-1/2 z-30 -translate-x-1/2 w-[min(92vw,22rem)] rounded-zen-2xl border border-zen-border-soft bg-white/95 px-4 py-3 shadow-zen-elevated backdrop-blur-md"
          role="status"
        >
          <p className="font-ui text-sm text-zen-fg mb-2.5 text-center">Your pattern is yours.</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 min-h-11 rounded-zen-xl border border-zen-border-soft font-ui text-sm text-zen-fg-muted active:scale-[0.97]"
              onClick={() => setCompletionOpen(false)}
            >
              Keep drawing
            </button>
            <button
              type="button"
              className="flex-1 min-h-11 rounded-zen-xl bg-zen-secondary-soft text-zen-secondary font-ui text-sm font-medium active:scale-[0.97]"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
    </ModulePage>
  );
}
