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
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const selectedNote$ = this.store.select(selectActiveNote);
    selectedNote$.subscribe((note: Note | null) => {
      if (note) {
        const html = marked(note.content) as string;
        const iframeWindow = this.iframe.nativeElement.contentWindow;

        iframeWindow?.postMessage({ type: 'html', html }, '*');
      }
    });
  }
}
