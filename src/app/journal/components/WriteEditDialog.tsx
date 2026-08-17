'use client';

import {
  ZenButton,
  ZenDialog,
  ZenDialogContent,
  ZenDialogDescription,
  ZenDialogFooter,
  ZenDialogHeader,
  ZenDialogTitle,
} from '@/components/zen';

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
