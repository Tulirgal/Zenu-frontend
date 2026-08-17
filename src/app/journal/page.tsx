'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { JournalEntry } from '@/lib/types';
import { ZenPage, ZenBackLink } from '@/components/zen';
import { cn } from '@/lib/utils';
import { DeleteConfirmDialog } from './components/WriteEditDialog';
import { JournalBook } from './components/book/JournalBook';
import {
  defaultFormState,
  type EntryFormMode,
  type EntryFormState,
} from './components/journalUtils';

function JournalContent() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [formMode, setFormMode] = useState<EntryFormMode>('create');
  const [formValues, setFormValues] = useState<EntryFormState>(defaultFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await apiClient.getJournalEntries({ limit: 100 });
      setEntries(data);
    } catch (err) {
      console.error('Failed to load journal entries', err);
      setLoadError(true);
      toast.error('Could not load your journal right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadEntries();
  }, [user, loadEntries]);

  const handleSave = async (): Promise<boolean> => {
    if (!formValues.content.trim()) {
      toast.error('Please write something before saving.');
      return false;
    }
    setFormSubmitting(true);
    try {
      if (formMode === 'create') {
        const created = await apiClient.createJournalEntry({
          mood: formValues.mood || null,
          title: formValues.title || null,
          content: formValues.content,
        });
        setEntries((prev) => [created, ...prev]);
        toast.success('Kept safely.');
      } else if (formValues.id) {
        const updated = await apiClient.updateJournalEntry(formValues.id, {
          mood: formValues.mood || null,
          title: formValues.title || null,
          content: formValues.content,
        });
        setEntries((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
        toast.success('Kept safely.');
      } else {
        setFormSubmitting(false);
        return false;
      }
      setFormSubmitting(false);
      setFormValues(defaultFormState);
      return true;
    } catch (err) {
      console.error('Failed to save journal entry', err);
      toast.error('Unable to save your entry.');
      setFormSubmitting(false);
      return false;
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.deleteJournalEntry(deleteTarget.id);
      setEntries((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success('Reflection deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete journal entry', err);
      toast.error('Could not delete this entry.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ZenPage
      atmosphere="home"
      className={cn(
        'relative min-h-dvh overflow-x-hidden',
        'bg-[hsl(40,35%,99%)]',
        'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-16',
        'pt-6 md:pt-10',
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 900px 480px at 10% 0%, hsl(32 40% 78% / 0.16), transparent 60%), radial-gradient(ellipse 700px 400px at 90% 20%, hsl(40 50% 88% / 0.45), transparent 55%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] space-y-6 px-4 sm:px-6 lg:px-8">
        <ZenBackLink section="Journal" className="mb-2" />

        {loadError ? (
          <div className="rounded-zen-xl border border-zen-danger/20 bg-zen-danger-soft/40 px-5 py-4 text-center">
            <p className="font-ui text-sm text-zen-danger">
              We couldn&apos;t load your reflections.
            </p>
            <button
              type="button"
              className="mt-4 font-ui text-sm text-zen-fg underline"
              onClick={() => void loadEntries()}
            >
              Try again
            </button>
          </div>
        ) : null}

        <JournalBook
          entries={entries}
          loading={loading}
          loadError={loadError}
          onRetry={loadEntries}
          formMode={formMode}
          formValues={formValues}
          formSubmitting={formSubmitting}
          onFormChange={setFormValues}
          onFormModeChange={setFormMode}
          onSave={handleSave}
          onRequestDelete={setDeleteTarget}
        />
      </div>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        deleting={deleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </ZenPage>
  );
}

export default function JournalPage() {
  return (
    <RequireAuth>
      <JournalContent />
    </RequireAuth>
  );
}
