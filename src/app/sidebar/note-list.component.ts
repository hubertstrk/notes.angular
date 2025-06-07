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
import { differenceBy, intersectionBy } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
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
  @Input() mode: 'notes' | 'archived' = 'notes';
  notes$ = this.store.select(selectNotes);
  archived$ = this.store.select(selectArchived);
  notes: Note[] = [];
  activeNote$ = this.store.select(selectActiveNote);
  activeNote: Note | null = null;
  private notesSubscription: Subscription | null = null;
  private activeNoteSubscription: Subscription | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateNotesBasedOnMode();

    this.activeNoteSubscription = this.activeNote$.subscribe(note => {
      this.activeNote = note;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.updateNotesBasedOnMode();
    }
  }

  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.activeNoteSubscription) {
      this.activeNoteSubscription.unsubscribe();
    }
  }

  onNoteClick(note: Note) {
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }

  private updateNotesBasedOnMode(): void {
    // Unsubscribe from previous subscription if it exists
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }

    // Create new subscription
    this.notesSubscription = combineLatest([this.archived$, this.notes$])
      .pipe(
        map(([archived, notes]) => {
          if (this.mode === 'notes') {
            // For 'notes' mode: show all notes except archived
            this.notes = differenceBy(
              notes,
              archived.map(x => ({ path: x })),
              'path'
            );
          } else if (this.mode === 'archived') {
            this.notes = intersectionBy(
              notes,
              archived.map(x => ({ path: x })),
              'path'
            );
          }
        })
      )
      .subscribe();
  }
}
