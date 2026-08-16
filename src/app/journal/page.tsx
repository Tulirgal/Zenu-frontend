'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import type { JournalEntry } from '@/lib/types';
import { ZenPage, ZenButton } from '@/components/zen';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { JournalHeader } from './components/JournalHeader';
import { WritePromptCard } from './components/WritePromptCard';
import { RecentReflections } from './components/RecentReflections';
import { EntryReader } from './components/EntryReader';
import { WriteEditDialog, DeleteConfirmDialog } from './components/WriteEditDialog';
import {
  defaultFormState,
  type EntryFormMode,
  type EntryFormState,
} from './components/journalUtils';

function JournalContent() {
  const { user } = useAuth();
  const reducedMotion = usePrefersReducedMotion();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<EntryFormMode>('create');
  const [formValues, setFormValues] = useState<EntryFormState>(defaultFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
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

  const openCreateDialog = () => {
    setFormMode('create');
    setFormValues(defaultFormState);
    setFormOpen(true);
  };

  const openEditDialog = (entry: JournalEntry) => {
    setFormMode('edit');
    setFormValues({
      id: entry.id,
      mood: entry.mood ?? null,
      title: entry.title ?? '',
      content: entry.content ?? '',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormSubmitting(false);
  };

  const handleFormSubmit = async () => {
    if (!formValues.content.trim()) {
      toast.error('Please write something before saving.');
      return;
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
        setSelectedEntry(created);
        toast.success('Reflection saved.');
      } else if (formValues.id) {
        const updated = await apiClient.updateJournalEntry(formValues.id, {
          mood: formValues.mood || null,
          title: formValues.title || null,
          content: formValues.content,
        });
        setEntries((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
        setSelectedEntry(updated);
        toast.success('Reflection updated.');
      }
      closeForm();
    } catch (err) {
      console.error('Failed to save journal entry', err);
      toast.error('Unable to save your entry.');
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.deleteJournalEntry(deleteTarget.id);
      setEntries((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedEntry?.id === deleteTarget.id) setSelectedEntry(null);
      toast.success('Reflection deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete journal entry', err);
      toast.error('Could not delete this entry.');
    } finally {
      setDeleting(false);
    }
  };

  const reading = Boolean(selectedEntry);

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
              'radial-gradient(ellipse 900px 480px at 10% 0%, hsl(262 40% 72% / 0.1), transparent 60%), radial-gradient(ellipse 700px 400px at 90% 20%, hsl(40 50% 88% / 0.45), transparent 55%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {reading && selectedEntry ? (
            <motion.div
              key="reader"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.25 }}
            >
              <EntryReader
                entry={selectedEntry}
                onBack={() => setSelectedEntry(null)}
                onEdit={openEditDialog}
                onDelete={setDeleteTarget}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.25 }}
              className="space-y-10 md:space-y-12"
            >
              <JournalHeader />

              {loadError ? (
                <div className="rounded-zen-xl border border-zen-danger/20 bg-zen-danger-soft/40 px-5 py-4 text-center">
                  <p className="font-ui text-sm text-zen-danger">
                    We couldn&apos;t load your reflections.
                  </p>
                  <ZenButton variant="outline" className="mt-4" onClick={loadEntries}>
                    Try again
                  </ZenButton>
                </div>
              ) : null}

              <WritePromptCard onWrite={openCreateDialog} />

              <RecentReflections
                entries={entries}
                loading={loading}
                onOpen={setSelectedEntry}
                onWrite={openCreateDialog}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WriteEditDialog
        open={formOpen}
        mode={formMode}
        values={formValues}
        submitting={formSubmitting}
        onOpenChange={(open) => (!open ? closeForm() : setFormOpen(open))}
        onChange={setFormValues}
        onSubmit={() => void handleFormSubmit()}
      />

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
