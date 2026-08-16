import { useCanvasStore } from '../store/canvasStore';

/**
 * Export the Konva canvas as PNG — same behavior as the previous Sidebar save.
 */
export function exportScribblePng(filename = 'scribble-pad.png'): boolean {
  const canvas =
    (document.querySelector('.konvajs-content canvas') as HTMLCanvasElement | null) ??
    document.querySelector('canvas');
  if (!canvas) return false;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}

export function clearScribbleCanvas(): void {
  useCanvasStore.setState({
    elements: [],
    history: [[]],
    historyIndex: 0,
    selectedElement: null,
  });
  useCanvasStore.getState().saveToHistory();
}
