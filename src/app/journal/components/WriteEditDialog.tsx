'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MOOD_OPTIONS,
  type EntryFormMode,
  type EntryFormState,
} from './journalUtils';

export function WriteEditDialog({
  open,
  mode,
  values,
  submitting,
  onOpenChange,
  onChange,
  onSubmit,
}: {
  open: boolean;
  mode: EntryFormMode;
  values: EntryFormState;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (next: EntryFormState) => void;
  onSubmit: () => void;
}) {
  return (
    <ZenDialog open={open} onOpenChange={onOpenChange}>
      <ZenDialogContent className="sm:max-w-xl bg-[hsl(40,40%,99%)]">
        <ZenDialogHeader>
          <ZenDialogTitle className="font-display text-2xl tracking-[-0.01em]">
            {mode === 'create' ? 'Write a reflection' : 'Edit reflection'}
          </ZenDialogTitle>
          <ZenDialogDescription>
            Only you can see this. You don&apos;t have to make it perfect.
          </ZenDialogDescription>
        </ZenDialogHeader>

        <div className="my-2 space-y-4">
          <ZenInput
            label="Title"
            placeholder="A thought for today…"
            value={values.title}
            onChange={(e) => onChange({ ...values, title: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="zen-label text-zen-fg-muted" htmlFor="journal-mood">
              Mood / feeling
              <span className="ml-1 font-normal text-zen-fg-subtle">(optional)</span>
            </label>
            <Select
              value={values.mood ?? undefined}
              onValueChange={(val) =>
                onChange({ ...values, mood: val === 'none' ? null : val })
              }
            >
              <SelectTrigger
                id="journal-mood"
                className="h-11 rounded-zen-sm border-zen-border bg-white focus:ring-zen-primary/15"
              >
                <SelectValue placeholder="How are you arriving?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No label</SelectItem>
                {MOOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ZenTextarea
            label="Start writing"
            rows={10}
            placeholder="Start writing…"
            value={values.content}
            onChange={(e) => onChange({ ...values, content: e.target.value })}
            className="min-h-[12rem] font-ui leading-relaxed"
          />
        </div>

        <ZenDialogFooter>
          <ZenButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </ZenButton>
          <ZenButton onClick={onSubmit} loading={submitting}>
            Save
          </ZenButton>
        </ZenDialogFooter>
      </ZenDialogContent>
    </ZenDialog>
  );
}

export function DeleteConfirmDialog({
  open,
  deleting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ZenDialog open={open} onOpenChange={onOpenChange}>
      <ZenDialogContent>
        <ZenDialogHeader>
          <ZenDialogTitle>Delete this reflection?</ZenDialogTitle>
          <ZenDialogDescription>
            This removes the reflection permanently. This cannot be undone.
          </ZenDialogDescription>
        </ZenDialogHeader>
        <ZenDialogFooter>
          <ZenButton variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Keep it
          </ZenButton>
          <ZenButton variant="destructive" onClick={onConfirm} loading={deleting}>
            Delete
          </ZenButton>
        </ZenDialogFooter>
      </ZenDialogContent>
    </ZenDialog>
  );
}
