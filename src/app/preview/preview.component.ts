import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { marked } from 'marked';
import { selectActiveNote } from '@store/note/note.selectors';
import { ButtonComponent } from '../shared/button/button.component';
import { clamp } from 'lodash';
import { SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { saveSettings } from '@store/settings/settings.actions';
import { Note } from '@models/note.model';
import { iFrameMessage } from '@models/preview.model';
import { SvgIconService } from '@services/svg-icon.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;
  latestHtml: string = '';
  currentNoteSubscription: Subscription | null = null;
  icons: { [key: string]: SafeHtml } = {};
  currentFontSize = 1.2;
  minFontSize = 0.4;
  maxFontSize = 4;
  private iframeLoaded$ = new Subject<void>();
  private currentNote$ = new BehaviorSubject<Note | null>(null);
  private activeNoteObservable$ = this.store.select(selectActiveNote);
  private darkModeObserver!: MutationObserver;

  constructor(
    private store: Store,
    private iconService: SvgIconService
  ) {}

  ngOnInit(): void {
    this.iconService
      .getIcons([
        'fluent--zoom-in-24-regular',
        'fluent--zoom-out-24-regular',
        'fluent--print-24-regular',
        'fluent--delete-24-regular',
      ])
      .subscribe(icons => {
        this.icons = icons;
      });

    this.iframe.nativeElement.addEventListener('load', () => {
      this.iframeLoaded$.next();
      // Send initial dark mode state to iframe
      const isDark = document.body.classList.contains('dark');
      this.sendToIFrame({ type: 'dark-mode', content: isDark });
    });

    // Set up an observer for dark mode changes
    this.darkModeObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDark = document.body.classList.contains('dark');
          this.sendToIFrame({ type: 'dark-mode', content: isDark });
        }
      });
    });

    this.darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
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
    if (note) {
      this.store.dispatch(
        saveSettings({ settings: { archived: [note.path] } })
      );
    }
  }

  ngOnDestroy() {
    if (this.currentNoteSubscription) {
      this.currentNoteSubscription.unsubscribe();
    }
    if (this.darkModeObserver) {
      this.darkModeObserver.disconnect();
    }
  }

  sendToIFrame(message: iFrameMessage<string | number | boolean>) {
    this.iframe.nativeElement?.contentWindow?.postMessage(message, '*');
  }

  print() {
    const iframe = this.iframe.nativeElement;
    if (iframe) {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  }
}
