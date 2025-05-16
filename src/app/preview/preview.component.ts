import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { marked } from 'marked';
import { selectActiveNote } from '../../store/note.selectors';
import { ButtonComponent } from '../shared/button/button.component';
import { clamp } from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { deleteNote } from '../../store/note.actions';
import { Note } from '../../model/note.model';
import { iFrameMessage } from '../../model/preview.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  currentNoteSubscription: Subscription | null = null;

  private latestHtml: string | null = null;
  private iframeLoaded$ = new Subject<void>();
  private currentNote$ = new BehaviorSubject<Note | null>(null);
  activeNoteObservable$ = this.store.select(selectActiveNote);

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  currentFontSize = 1.2;
  minFontSize = 0.4;
  maxFontSize = 4;

  zoomInIcon: SafeHtml | undefined;
  zoomOutIcon: SafeHtml | undefined;
  deleteNoteIcon: SafeHtml | undefined;

  ngOnInit(): void {
    this.zoomInIcon = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	      <path fill="currentColor" d="M7 4.5a.5.5 0 0 0-1 0V6H4.5a.5.5 0 0 0 0 1H6v1.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H7zM6.5 11a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
        </svg>`);

    this.zoomOutIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	<path fill="currentColor" d="M4.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 5a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
</svg>`
    );
    this.deleteNoteIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	<path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" />
</svg>`
    );

    this.iframe.nativeElement.addEventListener('load', () => {
      this.iframeLoaded$.next();
    });

    this.activeNoteObservable$.subscribe(note => {
      if (note) {
        this.currentNote$.next(note);
      }
    });

    combineLatest([this.iframeLoaded$, this.currentNote$]).subscribe(
      ([, note]) => {
        this.updateFontSize(0);
        if (note) {
          const html = marked(note.content) as string;
          this.latestHtml = html;
          this.sendToIFrame({ type: 'html', content: html });
        }
      }
    );
  }

  updateFontSize(increment: number) {
    this.currentFontSize = clamp(
      this.currentFontSize + increment,
      this.minFontSize,
      this.maxFontSize
    );

    this.sendToIFrame({ type: 'font-size', content: this.currentFontSize });
  }

  deleteNote() {
    const note = this.currentNote$.getValue();
    if (note) this.store.dispatch(deleteNote({ notePath: note.path }));
  }

  ngOnDestroy() {
    if (this.currentNoteSubscription) {
      this.currentNoteSubscription.unsubscribe();
    }
  }

  sendToIFrame(message: iFrameMessage<string | number>) {
    this.iframe.nativeElement?.contentWindow?.postMessage(message, '*');
  }
}
