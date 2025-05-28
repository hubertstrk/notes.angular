import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NotesService } from '@services/notes.services';
import { Store } from '@ngrx/store';
import {
  addNote,
  loadNotes,
  notesLoaded,
  setActiveNote,
} from '@store/note/note.actions';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { selectBasePath } from '@store/settings/settings.selectors';
import { loadSettings } from '@store/settings/settings.actions';
import { v4 as uuidv4 } from 'uuid';
import { NEW_NOTE_TITLE } from '@models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [NotesService, Store],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadSettings());

    this.store
      .select(selectBasePath)
      .pipe(filter(basePath => !!basePath))
      .subscribe(basePath => {
        if (basePath) this.store.dispatch(loadNotes({ directory: basePath }));
      });

    this.actions$.pipe(ofType(notesLoaded)).subscribe(({ notes, basePath }) => {
      void this.router.navigate(['/home']);

      notes.length > 0
        ? this.store.dispatch(setActiveNote({ notePath: notes[0].path }))
        : this.addNote(basePath);
    });
  }

  addNote(basePath: string) {
    this.store.dispatch(
      addNote({
        note: {
          content: `# ${NEW_NOTE_TITLE}`,
          heading: NEW_NOTE_TITLE,
          path: `${basePath}\\${uuidv4()}.md`,
        },
      })
    );
  }
}
