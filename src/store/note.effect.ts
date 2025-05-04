// store/effects/note.effects.ts
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NotesService } from '../service/notes.services';
import { loadNotes, notesLoaded, loadNotesFailed } from './note.actions';

@Injectable()
export class NoteEffects {
  constructor(
    private actions$: Actions,
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
}
