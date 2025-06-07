import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveNote } from '@store/note/note.selectors';
import { selectCursorPosition } from '@store/editor/editor.selectors';
import { CommonModule } from '@angular/common';
import { Note } from '@models/note.model';
import { Subject, takeUntil } from 'rxjs';

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
    this.activeNote$.pipe(takeUntil(this.destroy$)).subscribe(note => {
      this.activeNote = note;
    });
    this.cursorPosition$.pipe(takeUntil(this.destroy$)).subscribe(position => {
      this.cursorPosition = position;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
