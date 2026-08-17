export type BookPhase =
  | 'closed'
  | 'opening'
  | 'open'
  | 'turning'
  | 'saving'
  | 'closing';

export type SpreadMode = 'toc' | 'reading' | 'writing';

export type PageTurnDirection = 'forward' | 'back';

export type JournalPandaPhase =
  | 'closed'
  | 'hover'
  | 'opening'
  | 'writing'
  | 'thinking'
  | 'saving'
  | 'reading'
  | 'closing';
