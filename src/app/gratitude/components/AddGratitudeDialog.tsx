'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  ZenButton,
  ZenDialog,
  ZenDialogContent,
  ZenDialogDescription,
  ZenDialogFooter,
  ZenDialogHeader,
  ZenDialogTitle,
  ZenInput,
  ZenTextarea,
} from '@/components/zen';

export function AddGratitudeDialog({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: { title: string; content: string }) => Promise<void>;
  submitting: boolean;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTitle('');
      setContent('');
    }
    onOpenChange(nextOpen);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Write a few lines before saving your gratitude moment.');
      return;
    }
    await onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <ZenDialog open={open} onOpenChange={handleClose}>
      <ZenDialogContent className="sm:max-w-xl">
        <ZenDialogHeader>
          <ZenDialogTitle className="font-display">Add a gratitude moment</ZenDialogTitle>
          <ZenDialogDescription>
            What happened, and why does it matter to you?
          </ZenDialogDescription>
        </ZenDialogHeader>

        <div className="my-2 space-y-4">
          <ZenInput
            label="Short title (optional)"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A tiny win from today"
            maxLength={120}
          />
          <ZenTextarea
            label="Your gratitude note"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Today I felt thankful because…"
            maxLength={5000}
            rows={8}
            className="font-display"
          />
        </div>

        <ZenDialogFooter>
          <ZenButton variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
            Cancel
          </ZenButton>
          <ZenButton variant="accent" onClick={() => void handleSave()} loading={submitting}>
            Save to jar
          </ZenButton>
        </ZenDialogFooter>
      </ZenDialogContent>
    </ZenDialog>
  );
}
