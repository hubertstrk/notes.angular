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
  addNote,
  deleteNote,
  deleteNoteSuccess,
  deleteNoteFailed,
} from './note.actions';

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
      debounceTime(300),
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

  addNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addNote),
      switchMap(action =>
        from(
          this.notesService.saveFile(action.note.path, action.note.content)
        ).pipe(
          map(() => noteSaved({ notePath: action.note.path })),
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

  deleteNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteNote),
      switchMap(action =>
        from(this.notesService.deleteFile(action.notePath)).pipe(
          map(() => deleteNoteSuccess({ notePath: action.notePath })),
          catchError(error =>
            of(
              deleteNoteFailed({
                error: error.message,
              })
            )
          )
        )
      )
    );
  });
}
