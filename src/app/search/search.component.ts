import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon, IconService } from '../../service/icon.service';
import Fuse, { FuseResult, FuseResultMatch } from 'fuse.js';
import { Note } from '../../model/note.model';
import { ButtonComponent } from '../shared/button/button.component';
import { Store } from '@ngrx/store';
import { selectNotes } from '../../store/note.selectors';
import { SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

type SearchResult = {
  item: Note;
  matches: readonly FuseResultMatch[] | undefined;
  previewText: string;
};

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './search.component.html',
  providers: [IconService],
})
export class AppSearchComponent implements OnInit {
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeClicked = new EventEmitter<void>();

  notes$ = this.store.select(selectNotes);
  notes: Note[] = [];
  fuse: Fuse<Note> | null = null;
  searchResults: SearchResult[] = [];

  cancelIcon: SafeHtml;

  constructor(
    private iconService: IconService,
    private store: Store
  ) {
    this.notes$.subscribe(notes => {
      this.notes = notes;
    });
  }

  ngOnInit(): void {
    this.cancelIcon = this.iconService.getIcon(Icon.Cancel);
  }

  preview(content: string, searchValue: string): string {
    if (!searchValue) return '';
    // Escape regex special characters in searchValue
    const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const match = regex.exec(content);
    if (!match) return '';
    const start = match.index;
    const end = start + match[0].length - 1;
    const context = 30;
    const previewStart = Math.max(0, start - context);
    const previewEnd = Math.min(content.length, end + 1 + context);
    const before = content.slice(previewStart, start);
    const matched = content.slice(start, end + 1);
    const after = content.slice(end + 1, previewEnd);
    const prefix = previewStart > 0 ? '...' : '';
    const suffix = previewEnd < content.length ? '...' : '';
    return `${prefix}${before}<mark>${matched}</mark>${after}${suffix}`;
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const searchValue: string = value.trim();

    if (searchValue.length === 0) return;

    this.fuse = new Fuse(this.notes, {
      keys: ['content'],
      threshold: 1,
      minMatchCharLength: 3,
      includeMatches: true,
    });

    const result = this.fuse.search(searchValue);

    this.searchResults = result.map((res: FuseResult<Note>) => {
      const content = res.item.content;
      const previewText = this.preview(content, searchValue);
      return {
        item: res.item,
        matches: res.matches,
        previewText,
      };
    });
  }

  openNote(note: Note) {
    this.noteClicked.emit(note);
    this.searchResults = [];
  }

  close() {
    this.closeClicked.emit();
    this.searchResults = [];
  }
}
