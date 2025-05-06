import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { selectNotes } from '../../store/note.selectors';
import { marked } from 'marked';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {
  constructor(private store: Store) {}

  notes$ = this.store.select(selectNotes);

  @ViewChild('preview') preview: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.notes$.subscribe(notes => {
      if (notes.length > 0) {
        const note = notes[2];
        this.preview.nativeElement.innerHTML = marked.parse(
          note.markdown
        ) as string;
      }
    });
  }
}
