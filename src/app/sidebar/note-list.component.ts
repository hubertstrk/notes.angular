import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Note } from '@models/note.model';
import { NoteMode } from '@models/mode.model';
import { differenceBy, intersectionBy } from 'lodash';
import { combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { selectActiveNote, selectNotes } from '@store/note/note.selectors';
import { setActiveNote } from '@store/note/note.actions';
import { selectArchived } from '@store/settings/settings.selectors';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.component.html',
})
export class NoteListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: NoteMode = NoteMode.Notes;

  notes$ = this.store.select(selectNotes);
  archived$ = this.store.select(selectArchived);
  displayNotes: Note[] = [];

  activeNote$ = this.store.select(selectActiveNote);
  activeNote: Note | null = null;

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateNotesBasedOnMode();

    this.activeNote$.pipe(takeUntil(this.destroy$)).subscribe(note => {
      this.activeNote = note;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.updateNotesBasedOnMode();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNoteClick(note: Note) {
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }

  private updateNotesBasedOnMode(): void {
    combineLatest([this.archived$, this.notes$])
      .pipe(
        takeUntil(this.destroy$),
        map(([archived, notes]) => {
          const withoutArchived = () => {
            return differenceBy(
              notes,
              archived.map(x => ({ path: x })),
              'path'
            );
          };

          const archvied = () => {
            return intersectionBy(
              notes,
              archived.map(x => ({ path: x })),
              'path'
            );
          };

          return this.mode === NoteMode.Archived
            ? archvied()
            : withoutArchived();
        }),
        tap(filteredNotes => {
          this.displayNotes = filteredNotes;
        })
      )
      .subscribe();
  }

  trackByFn(index: number, item: Note) {
    return item.path;
  }
}
