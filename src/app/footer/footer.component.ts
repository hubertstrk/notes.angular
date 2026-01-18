import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { selectActiveNote } from '@store/note/note.selectors';
import { selectCursorPosition } from '@store/editor/editor.selectors';
import { Note } from '@models/note.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent implements OnInit, OnDestroy {
  activeNote$ = this.store.select(selectActiveNote);
  cursorPosition$ = this.store.select(selectCursorPosition);
  activeNote: Note | null = null;
  cursorPosition: { line: number; column: number } = { line: 0, column: 0 };

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    // get active note
    this.activeNote$.pipe(takeUntil(this.destroy$)).subscribe(note => {
      this.activeNote = note;
    });
    // set cursor position
    this.cursorPosition$.pipe(takeUntil(this.destroy$)).subscribe(position => {
      this.cursorPosition = position;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
