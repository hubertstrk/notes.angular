import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveNote } from '@store/note/note.selectors';
import { selectCursorPosition } from '@store/editor/editor.selectors';
import { CommonModule } from '@angular/common';
import { Note } from '@models/note.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent implements OnInit {
  activeNote$ = this.store.select(selectActiveNote);
  cursorPosition$ = this.store.select(selectCursorPosition);
  activeNote: Note | null = null;
  cursorPosition: { line: number; column: number } = { line: 0, column: 0 };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.activeNote$.subscribe(note => {
      this.activeNote = note;
    });
    this.cursorPosition$.subscribe(position => {
      this.cursorPosition = position;
    });
  }
}
