import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Note } from '../../model/note.model';

import { selectNotes, selectActiveNote } from '../../store/note.selectors';
import { setActiveNote } from '../../store/note.actions';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(private store: Store) {}

  notes$ = this.store.select(selectNotes);
  notes: Note[] = [];

  activeNote$ = this.store.select(selectActiveNote);
  activeNote: Note | null = null;

  ngOnInit(): void {
    this.notes$.subscribe((notes: Note[]) => {
      this.notes = notes;
    });

    this.activeNote$.subscribe(note => {
      this.activeNote = note;
    });
  }

  onNoteClick(note: Note) {
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }
}
