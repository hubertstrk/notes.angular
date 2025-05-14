import { createReducer, on } from '@ngrx/store';
import {
  notesLoaded,
  loadNotesFailed,
  setActiveNote,
  updateContent,
  saveNoteFailed,
  addNote,
} from './note.actions';
import { Note } from '../model/note.model';

export interface NoteState {
  notes: Note[];
  activeNotePath: string | null;
  isSaving: boolean;
  error: string | null;
}

export const initialState: NoteState = {
  notes: [],
  activeNotePath: null,
  isSaving: false,
  error: null,
};

export const noteReducer = createReducer(
  initialState,
  on(
    notesLoaded,
    (state, { notes }): NoteState => ({
      ...state,
      notes,
    })
  ),
  on(
    loadNotesFailed,
    (state, { error }): NoteState => ({
      ...state,
      error,
    })
  ),
  on(
    setActiveNote,
    (state, { notePath }): NoteState => ({
      ...state,
      activeNotePath: notePath,
    })
  ),
  on(updateContent, (state, { notePath, content, heading }): NoteState => {
    const notes = state.notes.map(note =>
      note.path === notePath ? { ...note, content, heading } : note
    );
    return {
      ...state,
      notes,
    };
  }),
  on(
    saveNoteFailed,
    (state, { error }): NoteState => ({
      ...state,
      error,
    })
  ),
  on(addNote, (state, { heading, basePath }): NoteState => {
    const newNote: Note = {
      content: `# ${heading}`,
      heading,
      path: `${basePath}\\${heading}.md`,
    };
    return {
      ...state,
      notes: [...state.notes, newNote],
      activeNotePath: newNote.path,
    };
  })
);
