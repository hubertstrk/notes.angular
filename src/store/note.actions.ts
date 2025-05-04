import { createAction, props } from '@ngrx/store';
import { Note } from '../model/note.model';

export const loadNotes = createAction(
  '[Note] Load Notes',
  props<{ directory: string }>()
);

export const notesLoaded = createAction(
  '[Note] Notes Loaded',
  props<{ notes: Note[] }>()
);

export const loadNotesFailed = createAction(
  '[Note] Load Notes Failed',
  props<{ error: string }>()
);
