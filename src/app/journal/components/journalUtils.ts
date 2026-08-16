export const MOOD_OPTIONS = ['Calm', 'Happy', 'Okay', 'Anxious', 'Overwhelmed', 'Drained'] as const;

export type EntryFormMode = 'create' | 'edit';

export interface EntryFormState {
  id?: string;
  mood: string | null;
  title: string;
  content: string;
}

export const defaultFormState: EntryFormState = { mood: null, title: '', content: '' };

export function formatJournalDate(iso: string | null | undefined) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getExcerpt(content: string, max = 110) {
  if (!content) return '';
  const trimmed = content.replace(/\s+/g, ' ').trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}
