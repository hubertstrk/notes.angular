import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectNotes } from '../../store/note.selectors';
import { Note } from '../../model/note.model';
import { Heading, Text } from 'mdast';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Output() noteSelected = new EventEmitter<Note>();

  constructor(private store: Store) {}

  notes$ = this.store.select(selectNotes);

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
    this.noteSelected.emit(note);
  }
}
