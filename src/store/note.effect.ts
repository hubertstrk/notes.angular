import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { NotesService } from '../service/notes.services';
import {
  loadNotes,
  notesLoaded,
  loadNotesFailed,
  noteSaved,
  saveNoteFailed,
  updateContent,
} from './note.actions';

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
        from(this.notesService.importFiles(action.directory)).pipe(
          map(notes => {
            return notesLoaded({ notes });
          }),
          catchError(error => of(loadNotesFailed({ error })))
        )
      )
    );
  });

  autoSave$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateContent),
      debounceTime(100),
      switchMap(action =>
        from(this.notesService.saveFile(action.notePath, action.content)).pipe(
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
}
