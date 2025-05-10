import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { marked } from 'marked';
import { selectActiveNote } from '../../store/note.selectors';
import { Note } from '../../model/note.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {
  @ViewChild('preview') preview: ElementRef<HTMLElement>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const base = `bg-white text-black border border-gray-200 rounded-lg shadow-sm`;
    const selectedNote$ = this.store.select(selectActiveNote);
    selectedNote$.subscribe((note: Note | null) => {
      if (note) {
        this.preview.nativeElement.innerHTML = marked(note.content) as string;
        this.preview.nativeElement.className = base;
      }
    });
  }
}
