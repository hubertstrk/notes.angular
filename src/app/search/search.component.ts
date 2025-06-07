import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '@models/note.model';
import { Store } from '@ngrx/store';
import { selectNotes } from '@store/note/note.selectors';
import { SvgIconService } from '@services/svg-icon.service';
import { SafeHtml } from '@angular/platform-browser';
import { ButtonComponent } from '@app/shared/button/button.component';

type SearchResult = {
  item: Note;
  preview: string;
};

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './search.component.html',
  providers: [SvgIconService],
})
export class AppSearchComponent implements OnInit, AfterViewInit {
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeClicked = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  notes$ = this.store.select(selectNotes);
  notes: Note[] = [];
  searchResults: SearchResult[] = [];
  icons: { [key: string]: SafeHtml } = {};
  cancelIcon: SafeHtml;

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
      .subscribe(icons => {
        this.icons = icons;
      });

    this.notes$.subscribe(notes => {
      this.notes = notes;
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const searchValue: string = value.trim();

    if (searchValue.length === 0) return;

    const regex = new RegExp(`${searchValue}`, 'i');

    this.searchResults = this.notes
      .filter(note => regex.test(note.content))
      .map(note => {
        const match = regex.exec(note.content);

        if (!match) return { item: note, preview: '' };

        const matchIndex = match.index;

        // highlight the matched text
        const highlighted = match.input.substring(
          matchIndex,
          matchIndex + searchValue.length
        );

        // text before match
        const front = match.input.substring(
          Math.max(0, matchIndex - 60),
          matchIndex
        );

        // text after match
        const tail = match.input.substring(
          matchIndex + searchValue.length,
          Math.min(note.content.length, matchIndex + searchValue.length + 60)
        );

        return {
          item: note,
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
    return item.item.path;
  }
}
