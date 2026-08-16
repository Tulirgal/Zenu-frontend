'use client';

import { Cloud, Heart, Moon, Smile, Star, Sun, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: string) => void;
  onPlaceSticker: (stickerName: string) => void;
}

const stickers = [
  { icon: Smile, name: 'smile' },
  { icon: Heart, name: 'heart' },
  { icon: Star, name: 'star' },
  { icon: Zap, name: 'zap' },
  { icon: Sun, name: 'sun' },
  { icon: Moon, name: 'moon' },
  { icon: Cloud, name: 'cloud' },
  { icon: Smile, name: 'cute_face' },
  { icon: Heart, name: 'love' },
  { icon: Star, name: 'sparkle' },
];

export default function StickerPanel({
  isOpen,
  onClose,
  onSelectSticker,
  onPlaceSticker,
}: StickerPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute top-16 left-3 md:left-24 z-50',
        'rounded-zen-2xl border border-zen-border-soft bg-zen-surface p-3',
        'shadow-[0_12px_32px_-16px_rgba(30,41,90,0.2)]',
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-ui text-sm font-semibold text-zen-fg">Stickers</h3>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-zen-lg text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg"
          aria-label="Close stickers"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {stickers.map((sticker) => (
          <button
            type="button"
            key={sticker.name}
            className="inline-flex h-11 w-11 items-center justify-center rounded-zen-lg hover:bg-zen-bg-subtle active:scale-[0.97]"
            onClick={() => {
              onSelectSticker(sticker.name);
              onPlaceSticker(sticker.name);
            }}
            aria-label={`Sticker ${sticker.name}`}
          >
            <sticker.icon className="h-5 w-5 text-zen-fg-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}
