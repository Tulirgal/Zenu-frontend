'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type DoodleTool = 'draw' | 'eraser' | 'fill';

export type SymmetryCanvasHandle = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  /** Export canvas PNG only (no UI / guides). */
  save: (filename?: string) => boolean;
};

type SymmetryCanvasProps = {
  tool: DoodleTool;
  color: string;
  brushSize: number;
  eraserSize: number;
  showGuides?: boolean;
  className?: string;
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
  onFirstStroke?: () => void;
  onStrokeCommit?: (strokeCount: number) => void;
};

const SYMMETRY = 12;
const ANGLE_STEP = (2 * Math.PI) / SYMMETRY;
const MAX_STACK = 25;
const BG = 'hsl(40, 40%, 99%)';

function hexToRgba(hex: string): [number, number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

function rotatePoint(cx: number, cy: number, x: number, y: number, theta: number) {
  const dx = x - cx;
  const dy = y - cy;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [dx * c - dy * s + cx, dx * s + dy * c + cy] as const;
}

function floodFill(
  imgData: ImageData,
  startX: number,
  startY: number,
  fillRGBA: number[],
) {
  const w = imgData.width;
  const h = imgData.height;
  const data = imgData.data;
  if (startX < 0 || startY < 0 || startX >= w || startY >= h) return;

  const startIdx = (startY * w + startX) * 4;
  const target = Array.from(data.slice(startIdx, startIdx + 4));
  if (target.every((v, i) => v === fillRGBA[i])) return;

  const stack: [number, number][] = [[startX, startY]];
  while (stack.length) {
    const point = stack.pop();
    if (!point) continue;
    const [x, y] = point;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;

    const idx = (y * w + x) * 4;
    if (target.every((v, i) => Math.abs(data[idx + i] - v) <= 16)) {
      data.set(fillRGBA, idx);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
}

/**
 * Preserved Doodle Dreams engine: 12-fold radial symmetry on a native canvas.
 */
export const SymmetryCanvas = forwardRef<SymmetryCanvasHandle, SymmetryCanvasProps>(
  function SymmetryCanvas(
    {
      tool,
      color,
      brushSize,
      eraserSize,
      showGuides = false,
      className,
      onHistoryChange,
      onFirstStroke,
      onStrokeCommit,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const undoStackRef = useRef<string[]>([]);
    const redoStackRef = useRef<string[]>([]);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const strokeCountRef = useRef(0);
    const hasDrawnRef = useRef(false);
    const toolRef = useRef(tool);
    const colorRef = useRef(color);
    const brushSizeRef = useRef(brushSize);
    const eraserSizeRef = useRef(eraserSize);
    const [empty, setEmpty] = useState(true);
    const [cssSize, setCssSize] = useState(0);

    toolRef.current = tool;
    colorRef.current = color;
    brushSizeRef.current = brushSize;
    eraserSizeRef.current = eraserSize;

    const emitHistory = useCallback(() => {
      onHistoryChange?.({
        canUndo: undoStackRef.current.length > 0,
        canRedo: redoStackRef.current.length > 0,
      });
    }, [onHistoryChange]);

    const fillBackground = useCallback((ctx: CanvasRenderingContext2D, css: number) => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, css, css);
    }, []);

    const restoreFromDataURL = useCallback(
      (url: string) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const img = new Image();
        img.onload = () => {
          const dpr = window.devicePixelRatio || 1;
          const css = canvas.width / dpr;
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          fillBackground(ctx, css);
          ctx.drawImage(img, 0, 0, css, css);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        };
        img.src = url;
      },
      [fillBackground],
    );

    const pushState = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (undoStackRef.current.length >= MAX_STACK) {
        undoStackRef.current.shift();
      }
      undoStackRef.current.push(canvas.toDataURL());
      redoStackRef.current = [];
      emitHistory();
    }, [emitHistory]);

    const drawSymmetricLine = useCallback(
      (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        overrideColor?: string,
        overrideSize?: number,
      ) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const centerX = canvas.width / dpr / 2;
        const centerY = canvas.height / dpr / 2;
        const dx1 = x1 - centerX;
        const dy1 = y1 - centerY;
        const dx2 = x2 - centerX;
        const dy2 = y2 - centerY;

        ctx.strokeStyle = overrideColor || colorRef.current;
        ctx.lineWidth = overrideSize || brushSizeRef.current;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.translate(centerX, centerY);
        for (let i = 0; i < SYMMETRY; i++) {
          ctx.rotate(ANGLE_STEP);
          ctx.beginPath();
          ctx.moveTo(dx1, dy1);
          ctx.lineTo(dx2, dy2);
          ctx.stroke();
        }
        ctx.restore();
      },
      [],
    );

    useEffect(() => {
      const el = containerRef.current;
      const canvas = canvasRef.current;
      if (!el || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let lastCss = 0;

      const applySize = (css: number, restoreUrl?: string | null) => {
        if (css < 2) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = `${css}px`;
        canvas.style.height = `${css}px`;
        canvas.width = Math.floor(css * dpr);
        canvas.height = Math.floor(css * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        fillBackground(ctx, css);
        setCssSize(css);
        lastCss = css;
        if (restoreUrl) {
          restoreFromDataURL(restoreUrl);
        }
      };

      const update = () => {
        const rect = el.getBoundingClientRect();
        const css = Math.floor(Math.min(rect.width, rect.height));
        if (css < 2) return;
        if (css === lastCss) return;
        const snapshot =
          canvas.width > 0 && undoStackRef.current.length > 0
            ? canvas.toDataURL()
            : null;
        applySize(css, snapshot);
      };

      update();
      const raf = window.requestAnimationFrame(update);
      const ro = new ResizeObserver(update);
      ro.observe(el);

      // Seed empty history once canvas has pixels
      if (undoStackRef.current.length === 0 && canvas.width > 0) {
        undoStackRef.current = [];
        emitHistory();
      }

      return () => {
        window.cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }, [emitHistory, fillBackground, restoreFromDataURL]);

    const getLocalPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const scaleX = canvas.width / dpr / rect.width;
      const scaleY = canvas.height / dpr / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const markDrawn = () => {
      if (!hasDrawnRef.current) {
        hasDrawnRef.current = true;
        setEmpty(false);
        onFirstStroke?.();
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.setPointerCapture(e.pointerId);
      pushState();
      const { x, y } = getLocalPos(e);
      const active = toolRef.current;

      if (active === 'fill') {
        const dpr = window.devicePixelRatio || 1;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / dpr / 2;
        const cy = canvas.height / dpr / 2;
        for (let i = 0; i < SYMMETRY; i++) {
          const [rx, ry] = rotatePoint(cx, cy, x, y, i * ANGLE_STEP);
          floodFill(imgData, Math.round(rx * dpr), Math.round(ry * dpr), hexToRgba(colorRef.current));
        }
        ctx.putImageData(imgData, 0, 0);
        markDrawn();
        strokeCountRef.current += 1;
        onStrokeCommit?.(strokeCountRef.current);
        return;
      }

      isDrawingRef.current = true;
      lastPosRef.current = { x, y };

      if (active === 'eraser') {
        drawSymmetricLine(x, y, x, y, BG, eraserSizeRef.current);
      } else {
        drawSymmetricLine(x, y, x, y);
      }
      markDrawn();
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;

      const { x, y } = getLocalPos(e);
      const active = toolRef.current;

      if (active === 'eraser') {
        drawSymmetricLine(
          lastPosRef.current.x,
          lastPosRef.current.y,
          x,
          y,
          BG,
          eraserSizeRef.current,
        );
      } else if (active === 'draw') {
        drawSymmetricLine(lastPosRef.current.x, lastPosRef.current.y, x, y);
      }

      lastPosRef.current = { x, y };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        strokeCountRef.current += 1;
        onStrokeCommit?.(strokeCountRef.current);
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        undo: () => {
          if (undoStackRef.current.length === 0) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          redoStackRef.current.push(canvas.toDataURL());
          const state = undoStackRef.current.pop()!;
          restoreFromDataURL(state);
          emitHistory();
        },
        redo: () => {
          if (redoStackRef.current.length === 0) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          undoStackRef.current.push(canvas.toDataURL());
          const state = redoStackRef.current.pop()!;
          restoreFromDataURL(state);
          emitHistory();
        },
        clear: () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!canvas || !ctx) return;
          pushState();
          const dpr = window.devicePixelRatio || 1;
          const css = canvas.width / dpr;
          fillBackground(ctx, css);
          strokeCountRef.current = 0;
          hasDrawnRef.current = false;
          setEmpty(true);
          emitHistory();
        },
        save: (filename = `doodle-dreams-${Date.now()}.png`) => {
          const canvas = canvasRef.current;
          if (!canvas) return false;
          const link = document.createElement('a');
          link.download = filename;
          link.href = canvas.toDataURL('image/png');
          link.click();
          return true;
        },
      }),
      [emitHistory, fillBackground, pushState, restoreFromDataURL],
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative flex h-full w-full min-h-0 min-w-0 items-center justify-center touch-none',
          className,
        )}
        style={{ touchAction: 'none' }}
      >
        {/*
          Square stage is sized from container min(w,h) and centered in the content
          region — never stretched with inset-0 (that skews desktop symmetry).
        */}
        <div
          className={cn(
            'relative shrink-0 overflow-hidden touch-none',
            'rounded-zen-2xl border border-zen-border-soft/60',
            'bg-[hsl(40,40%,99%)] shadow-[0_8px_28px_-18px_rgba(30,41,90,0.12)]',
          )}
          style={{
            width: cssSize > 0 ? cssSize : '100%',
            height: cssSize > 0 ? cssSize : '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            touchAction: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="block cursor-crosshair touch-none"
            style={{
              width: cssSize > 0 ? cssSize : undefined,
              height: cssSize > 0 ? cssSize : undefined,
              touchAction: 'none',
            }}
            aria-label="Doodle Dreams symmetry canvas"
            role="application"
          />

          {/* Opt-in only: tiny center mark — no astral radial spokes. */}
          {showGuides && cssSize > 0 ? (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zen-secondary/40"
              aria-hidden="true"
            />
          ) : null}

          {empty ? (
            <p
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-6 text-center font-ui text-sm text-zen-fg-subtle"
              aria-hidden="true"
            >
              Start anywhere. Watch it multiply.
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);
