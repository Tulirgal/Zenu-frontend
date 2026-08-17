'use client';

import { useEffect } from 'react';
import { ZenButton, ZenInput, ZenTextarea } from '@/components/zen';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  MOOD_OPTIONS,
  type EntryFormMode,
  type EntryFormState,
} from '../journalUtils';

export function JournalWritePage({
  mode,
  values,
  submitting,
  onChange,
  onSave,
  onCancel,
  onTypingActivity,
  className,
}: {
  mode: EntryFormMode;
  values: EntryFormState;
  submitting: boolean;
  onChange: (next: EntryFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  onTypingActivity?: () => void;
  className?: string;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = document.getElementById('journal-book-content') as HTMLTextAreaElement | null;
      el?.focus();
    }, 280);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="shrink-0">
        <p className="font-ui text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zen-fg-subtle">
          {mode === 'create' ? 'New page' : 'Editing'}
        </p>
        <h2 className="mt-1 font-display text-xl tracking-[-0.01em] text-zen-fg md:text-2xl">
          {mode === 'create' ? 'Write a reflection' : 'Edit reflection'}
        </h2>
        <p className="mt-1 font-ui text-sm text-zen-fg-muted">
          Only you can see this. You don&apos;t have to make it perfect.
        </p>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain">
        <ZenInput
          label="Title"
          placeholder="A thought for today…"
          value={values.title}
          onChange={(e) => {
            onTypingActivity?.();
            onChange({ ...values, title: e.target.value });
          }}
        />

        <div className="flex flex-col gap-1.5">
          <label className="zen-label text-zen-fg-muted" htmlFor="journal-book-mood">
            Mood / feeling
            <span className="ml-1 font-normal text-zen-fg-subtle">(optional)</span>
          </label>
          <Select
            value={values.mood ?? undefined}
            onValueChange={(val) => {
              onTypingActivity?.();
              onChange({ ...values, mood: val === 'none' ? null : val });
            }}
          >
            <SelectTrigger
              id="journal-book-mood"
              className="h-11 rounded-zen-sm border-zen-border bg-white focus:ring-zen-primary/15"
            >
              <SelectValue placeholder="How are you arriving?" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className={cn(
                'z-[200] max-h-64 overflow-auto rounded-zen-sm',
                'border border-zen-border bg-white text-zen-fg',
                'shadow-[0_12px_40px_-12px_rgba(40,30,20,0.35)]',
              )}
            >
              <SelectItem value="none">No label</SelectItem>
              {MOOD_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <ZenTextarea
            id="journal-book-content"
            label="Start writing"
            rows={10}
            placeholder="Start writing…"
            value={values.content}
            onChange={(e) => {
              onTypingActivity?.();
              onChange({ ...values, content: e.target.value });
            }}
            className={cn(
              'min-h-[12rem] flex-1 font-ui leading-[1.75]',
              'bg-[repeating-linear-gradient(transparent,transparent_27px,hsl(28_20%_70%/0.15)_28px)]',
            )}
          />
        </div>
      </div>

      <div className="mt-4 flex shrink-0 flex-wrap gap-2 border-t border-[hsl(32_20%_85%)] pt-3">
        <ZenButton
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </ZenButton>
        <ZenButton type="button" className="min-h-11" onClick={onSave} loading={submitting}>
          Save
        </ZenButton>
      </div>
    </div>
  );
}
