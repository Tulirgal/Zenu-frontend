'use client';

import { useEffect, useState } from 'react';
import { trackEngagement } from '@/lib/signals';
import CanvasArea from './components/CanvasArea';
import StickerPanel from './components/modals/StickerPanel';
import { ScribbleHeader } from './components/ScribbleHeader';
import { DesktopToolRail } from './components/DesktopToolRail';
import { MobileFloatingToolbar } from './components/MobileFloatingToolbar';
import { ZoomPill } from './components/ZoomPill';
import { ScribbleCompanion } from './components/ScribbleCompanion';
import { useCanvasStore } from './store/canvasStore';
import { useToolStore } from './store/toolStore';
import { useAutosave } from './utils/autosave';
import { useShortcuts } from './utils/shortcuts';
import { cn } from '@/lib/utils';

export default function Page() {
  const { setTool } = useToolStore();
  const { loadFromLocalStorage } = useCanvasStore();
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [savedPulse, setSavedPulse] = useState(0);
  const [savedToast, setSavedToast] = useState(false);
  const { showStickerPanel, setShowStickerPanel } = useToolStore();

  useAutosave();
  useShortcuts(setTool);

  useEffect(() => {
    trackEngagement('arts_scribble', 'opened');
    const start = Date.now();
    loadFromLocalStorage();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('arts_scribble', 'completed', duration);
    };
  }, [loadFromLocalStorage]);

  const handleSaved = () => {
    setSavedPulse((n) => n + 1);
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 1800);
  };

  return (
    <div
      className={cn(
        'flex flex-col w-full overflow-hidden bg-[hsl(40,35%,99%)]',
        // Mobile: main only has min-height — percentage height collapses.
        // Absolute fill gives the canvas a real measured box above the bottom nav.
        'max-md:absolute max-md:inset-0',
        'max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]',
        // Desktop: main is h-full — participate in that flex column.
        'md:relative md:h-full md:min-h-0 md:flex-1',
      )}
      data-zen-atmosphere="home"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-16 top-8 h-56 w-56 rounded-full bg-zen-secondary-soft opacity-40 blur-3xl" />
        <div className="absolute -left-12 bottom-24 h-48 w-48 rounded-full bg-zen-emotion-surprise-soft opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 min-h-0 gap-3 md:gap-4 px-3 pt-3 pb-2 md:px-5 md:pt-4 md:pb-4">
        <DesktopToolRail onSaved={handleSaved} />

        <div className="relative flex flex-1 min-w-0 min-h-0 flex-col">
          <ScribbleHeader />

          {/* Absolute canvas frame: flex-1 alone can still report 0 height on mobile. */}
          <div className="relative flex-1 min-h-0">
            <div className="absolute inset-0 pb-[4.5rem] md:pb-14">
              <CanvasArea selectedSticker={selectedSticker} />
            </div>

            <MobileFloatingToolbar onSaved={handleSaved} />

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 md:block">
              <div className="pointer-events-auto">
                <ZoomPill />
              </div>
            </div>

            <ScribbleCompanion savedPulse={savedPulse} />
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

      <StickerPanel
        isOpen={showStickerPanel}
        onClose={() => setShowStickerPanel(false)}
        onSelectSticker={(sticker) => {
          setSelectedSticker(sticker);
          useToolStore.getState().setTool('Sticker');
          setShowStickerPanel(false);
        }}
        onPlaceSticker={(sticker) => {
          setSelectedSticker(sticker);
          useToolStore.getState().setTool('Sticker');
          setShowStickerPanel(false);
        }}
      />
    </div>
  );
}
