import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Note } from '../../model/note.model';
import { Heading, Text } from 'mdast';

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
    this.notes$.subscribe(notes => {
      this.notes = notes;
    });

    this.activeNote$.subscribe(note => {
      this.activeNote = note;
    });
  }

  extractHeading(note: Note): string {
    const headings = note.tree.children.filter(x => x.type === 'heading');

    if (headings.length === 0) {
      return 'No Title';
    }

    const text = (headings[0] as Heading).children.filter(
      x => x.type === 'text'
    );

    if (text.length === 0) {
      return 'No Title';
    }

    const title = (text[0] as Text).value;

    return title;
  }

  onNoteClick(note: Note) {
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }
}
