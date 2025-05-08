import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take } from 'rxjs/operators';
import { NotesService } from '../service/notes.services';
import {
  loadNotes,
  notesLoaded,
  loadNotesFailed,
  saveNote,
  noteSaved,
  saveNoteFailed,
  updateNoteContent,
} from './note.actions';

import { selectNote } from './note.selectors';

import { Store } from '@ngrx/store';

@Injectable()
export class NoteEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private notesService: NotesService
  ) {}
  loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadNotes),
      switchMap(action =>
        from(this.notesService.getMarkdownFiles(action.directory)).pipe(
          map(notes => {
            return notesLoaded({ notes });
          }),
          catchError(error => of(loadNotesFailed({ error })))
        )
      )
    );
  });

  saveNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveNote),
      switchMap(action =>
        from(
          this.notesService.saveMarkdownFile(action.notePath, action.content)
        ).pipe(
          map(() => noteSaved({ notePath: action.notePath })),
          catchError(error =>
            of(
              saveNoteFailed({
                error: error.message,
              })
            )
          )
        )
      )
    );
  });

  autoSave$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateNoteContent),
      debounceTime(1000),
      switchMap(action =>
        this.store.select(selectNote(action.notePath)).pipe(
          take(1),
          map(note =>
            saveNote({ notePath: action.notePath, content: action.content })
          )
        )
      )
    );
  });
}
