export const NEW_NOTE_TITLE = 'New Note';
export const NO_TITLE = 'No Title';

export interface Note {
  content: string;
  path: string;
  heading: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
