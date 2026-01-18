import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import markdownToTxt from 'markdown-to-txt';

import { ButtonComponent } from '@app/shared/button/button.component';

import { Note } from '@models/note.model';
import { selectNotes } from '@store/note/note.selectors';
import { selectArchived } from '@store/settings/settings.selectors';
import { SvgIconService } from '@services/svg-icon.service';

import { differenceBy } from 'lodash';

type SearchResult = {
  note: Note;
  preview: string;
};

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './search.component.html',
  providers: [SvgIconService],
})
export class AppSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeClicked = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  notes$ = this.store.select(selectNotes);
  archived$ = this.store.select(selectArchived);
  notes: Note[] = [];
  searchResults: SearchResult[] = [];
  icons: { [key: string]: SafeHtml } = {};
  value: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private iconService: SvgIconService,
    private store: Store
  ) {}

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  ngOnInit(): void {
    this.iconService
      .getIcons(['material-symbols-light--close-rounded'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(icons => {
        this.icons = icons;
      });

    combineLatest([this.notes$, this.archived$])
      .pipe(
        takeUntil(this.destroy$),
        map(([notes, archived]) => {
          // Filter out archived notes
          return differenceBy(
            notes,
            archived.map(x => ({ path: x })),
            'path'
          );
        })
      )
      .subscribe(activeNotes => {
        this.notes = activeNotes;
      });
  }

  onSearchInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    const searchValue: string = this.value.trim();

    if (searchValue.length === 0) {
      this.searchResults = [];
      return;
    }

    const regex = new RegExp(`${searchValue}`, 'i');

    this.searchResults = this.notes
      .map(note => ({
        note,
        plainText: markdownToTxt(note.content),
      }))
      .filter(({ plainText }) => regex.test(plainText))
      .map(({ note, plainText }) => {
        const match = regex.exec(plainText);

        if (!match) return { note, preview: '' };

        const matchIndex = match.index;

        // highlight the matched text
        const highlighted = match.input.substring(
          matchIndex,
          matchIndex + searchValue.length
        );

        // text before match
        const front = match.input.substring(
          Math.max(0, matchIndex - 120),
          matchIndex
        );

        // text after match
        const tail = match.input.substring(
          matchIndex + searchValue.length,
          Math.min(plainText.length, matchIndex + searchValue.length + 120)
        );

        return {
          note,
          preview: `${front}<mark>${highlighted}</mark>${tail}`,
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

  trackByFn(index: number, item: SearchResult) {
    return item.note?.path;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
