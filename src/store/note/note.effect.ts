import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { NotesService } from '@services/notes.services';
import {
  addNote,
  deleteNote,
  deleteNoteFailed,
  deleteNoteSuccess,
  loadNotes,
  loadNotesFailed,
  noteSaved,
  notesLoaded,
  saveNoteFailed,
  updateContent,
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
        from(this.notesService.importNotes(action.directory)).pipe(
          map(notes => {
            return notesLoaded({ notes, basePath: action.directory });
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
