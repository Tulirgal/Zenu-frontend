import { create } from 'zustand';

interface ToolState {
  activeTool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;

  /** Pen stroke width (independent from eraser). */
  penSize: number;
  setPenSize: (size: number) => void;
  /** Pen stroke opacity 0–1. */
  penOpacity: number;
  setPenOpacity: (opacity: number) => void;
  /** Eraser stroke width (independent from pen). */
  eraserSize: number;
  setEraserSize: (size: number) => void;
  /** Eraser opacity 0–1 (independent from pen). */
  eraserOpacity: number;
  setEraserOpacity: (opacity: number) => void;

  /**
   * @deprecated Prefer penSize / setPenSize. Kept as aliases so legacy UI still compiles.
   */
  brushSize: number;
  setBrushSize: (size: number) => void;
  /** @deprecated Prefer penOpacity / setPenOpacity. */
  opacity: number;
  setOpacity: (opacity: number) => void;

  gridEnabled: boolean;
  toggleGrid: () => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  toolPaletteVisible: boolean;
  toggleToolPalette: () => void;
  showStickerPanel: boolean;
  setShowStickerPanel: (show: boolean) => void;
  textFontFamily: string;
  setTextFontFamily: (font: string) => void;
  textFontStyle: string;
  setTextFontStyle: (style: string) => void;
  textFontWeight: string;
  setTextFontWeight: (weight: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'Draw',
  setTool: (tool) => set({ activeTool: tool }),
  color: '#334155',
  setColor: (color) => set({ color }),

  penSize: 3,
  setPenSize: (size) => set({ penSize: size, brushSize: size }),
  penOpacity: 1,
  setPenOpacity: (opacity) => set({ penOpacity: opacity, opacity }),
  eraserSize: 20,
  setEraserSize: (size) => set({ eraserSize: size }),
  eraserOpacity: 1,
  setEraserOpacity: (opacity) => set({ eraserOpacity: opacity }),

  // Aliases mirror pen settings for any leftover consumers.
  brushSize: 3,
  setBrushSize: (size) => set({ brushSize: size, penSize: size }),
  opacity: 1,
  setOpacity: (opacity) => set({ opacity, penOpacity: opacity }),

  gridEnabled: false,
  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  gridSize: 20,
  setGridSize: (size) => set({ gridSize: size }),
  fillColor: 'transparent',
  setFillColor: (color) => set({ fillColor: color }),
  strokeWidth: 3,
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  toolPaletteVisible: false,
  toggleToolPalette: () =>
    set((state) => ({ toolPaletteVisible: !state.toolPaletteVisible })),
  showStickerPanel: false,
  setShowStickerPanel: (show) => set({ showStickerPanel: show }),
  textFontFamily: 'Arial',
  setTextFontFamily: (font) => set({ textFontFamily: font }),
  textFontStyle: 'normal',
  setTextFontStyle: (style) => set({ textFontStyle: style }),
  textFontWeight: 'normal',
  setTextFontWeight: (weight) => set({ textFontWeight: weight }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.1, zoom)) }),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
