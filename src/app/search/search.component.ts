import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from '../../service/icon.service';
import Fuse, { FuseResult } from 'fuse.js';
import { Note } from '../../model/note.model';

import { Store } from '@ngrx/store';
import { selectNotes } from '../../store/note.selectors';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: [],
  providers: [IconService],
})
export class AppSearchComponent {
  @Output() noteClicked = new EventEmitter<Note>();

  notes$ = this.store.select(selectNotes);
  fuse: Fuse<Note> | null = null;
  allNotes: Note[] = [];
  searchResults: Note[] = [];

  constructor(
    private iconService: IconService,
    private store: Store
  ) {
    this.notes$.subscribe(notes => {
      this.allNotes = notes;
      this.fuse = new Fuse(notes, {
        keys: ['content'],
        threshold: 0.3,
        minMatchCharLength: 2,
      });
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchResults = this.fuse
      ? (this.searchResults = this.fuse
          .search(value)
          .map((result: FuseResult<Note>) => result.item))
      : [];
  }

  openNote(note: Note) {
    this.noteClicked.emit(note);
    this.searchResults = [];
  }
}
