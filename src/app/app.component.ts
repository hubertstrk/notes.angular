import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotesService } from '../service/notes.services';
import { Store } from '@ngrx/store';
import { loadNotes, notesLoaded, setActiveNote } from '../store/note.actions';
import { Actions, ofType } from '@ngrx/effects';
import { filter, take } from 'rxjs';
import { selectBasePath } from './store/settings.selectors';
import { loadSettings } from './store/settings.actions';
import { Router } from '@angular/router';

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
    private notesService: NotesService,
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

    this.actions$.pipe(ofType(notesLoaded)).subscribe(({ notes }) => {
      if (notes.length > 0) {
        this.store.dispatch(setActiveNote({ notePath: notes[0].path }));
      }
      // Route to home after notes are fully read
      this.router.navigate(['/home']);
    });
  }
}
