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
import { selectArchived } from '@store/settings/settings.selectors';
import { ButtonComponent } from '../shared/button/button.component';
import { clamp } from 'lodash';
import { SafeHtml } from '@angular/platform-browser';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { saveSettings } from '@store/settings/settings.actions';
import { iFrameMessage } from '@models/preview.model';
import { SvgIconService } from '@services/svg-icon.service';
import { deleteNote } from '@store/note/note.actions';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  icons: { [key: string]: SafeHtml } = {};

  private currentFontSize = 1.2;
  private minFontSize = 0.4;
  private maxFontSize = 4;

  private iframeLoaded$ = new Subject<void>();
  private activeNote$ = this.store.select(selectActiveNote);
  private darkModeObserver!: MutationObserver;
  private destroy$ = new Subject<void>();

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
        'material-symbols-light--recycling',
      ])
      .pipe(takeUntil(this.destroy$))
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

    combineLatest([this.iframeLoaded$, this.activeNote$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([, note]) => {
        this.updateFontSize(0);
        if (note) {
          this.sendToIFrame({
            type: 'html',
            content: marked(note.content) as string,
          });
        }
      });
  }

  updateFontSize(increment: number) {
    this.currentFontSize = clamp(
      this.currentFontSize + increment,
      this.minFontSize,
      this.maxFontSize
    );

    this.sendToIFrame({ type: 'font-size', content: this.currentFontSize });
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

  deleteNote() {
    const note = this.store.select(selectActiveNote);
    const archived = this.store.select(selectArchived);

    combineLatest([note, archived])
      .pipe(take(1))
      .subscribe(([note, archived]) => {
        if (!note) return;

        archived.includes(note.path)
          ? this.store.dispatch(deleteNote({ notePath: note.path }))
          : this.store.dispatch(
              saveSettings({ settings: { archived: [...archived, note.path] } })
            );
      });
  }

  restoreNote() {
    const currentNote = this.store.select(selectActiveNote);
    const archived = this.store.select(selectArchived);

    combineLatest([currentNote, archived])
      .pipe(take(1))
      .subscribe(([note, archived]) => {
        if (!note) return;

        const archivedWithoutCurrent = [
          ...archived.filter(p => p !== note.path),
        ];

        this.store.dispatch(
          saveSettings({
            settings: { archived: archivedWithoutCurrent },
          })
        );
      });
  }

  ngOnDestroy() {
    if (this.darkModeObserver) {
      this.darkModeObserver.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
