import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotesService } from '../service/notes.services';
import { Store } from '@ngrx/store';
import { loadNotes, notesLoaded, setActiveNote } from '../store/note.actions';
import { Actions, ofType } from '@ngrx/effects';

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
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadNotes({ directory: 'C:\\Users\\nz3k4\\Downloads\\notes' })
    );

    this.actions$.pipe(ofType(notesLoaded)).subscribe(({ notes }) => {
      if (notes.length > 0) {
        this.store.dispatch(setActiveNote({ notePath: notes[0].path }));
      }
    });
  }
}
