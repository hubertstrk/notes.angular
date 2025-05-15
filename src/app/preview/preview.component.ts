import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { marked } from 'marked';
import { selectActiveNote } from '../../store/note.selectors';
import { Note } from '../../model/note.model';
import { ButtonComponent } from '../shared/button/button.component';
import { clamp } from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  currentFontSize = 1;
  minFontSize = 0.4;
  maxFontSize = 4;

  zoomInIcon: SafeHtml | undefined;
  zoomOutIcon: SafeHtml | undefined;
  deleteNoteIcon: SafeHtml | undefined;

  ngOnInit(): void {
    this.zoomInIcon = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
	      <path fill="currentColor" d="M7 4.5a.5.5 0 0 0-1 0V6H4.5a.5.5 0 0 0 0 1H6v1.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H7zM6.5 11a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
        </svg>`);

    this.zoomOutIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
	<path fill="currentColor" d="M4.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 5a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
</svg>`
    );
    this.deleteNoteIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
	<path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" />
</svg>`
    );

    const selectedNote$ = this.store.select(selectActiveNote);
    selectedNote$.subscribe((note: Note | null) => {
      if (note) {
        const html = marked(note.content) as string;
        const iframeWindow = this.iframe.nativeElement.contentWindow;

        iframeWindow?.postMessage({ type: 'html', html }, '*');
      }
    });

    const iframeWindow = this.iframe.nativeElement.contentWindow;
    iframeWindow?.postMessage(
      { type: 'font-size', value: this.currentFontSize },
      '*'
    );
  }

  increaseFontSize() {
    this.currentFontSize = clamp(
      this.currentFontSize + 0.2,
      this.minFontSize,
      this.maxFontSize
    );

    const iframeWindow = this.iframe.nativeElement.contentWindow;
    iframeWindow?.postMessage(
      { type: 'font-size', value: this.currentFontSize },
      '*'
    );
  }

  decreaseFontSize() {
    this.currentFontSize = clamp(
      this.currentFontSize - 0.2,
      this.minFontSize,
      this.maxFontSize
    );

    const iframeWindow = this.iframe.nativeElement.contentWindow;
    iframeWindow?.postMessage(
      { type: 'font-size', value: this.currentFontSize },
      '*'
    );
  }
}
