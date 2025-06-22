import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SafeHtml } from '@angular/platform-browser';

import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { marked } from 'marked';
import { clamp } from 'lodash';

import { ButtonComponent } from '../shared/button/button.component';

import { selectActiveNote } from '@store/note/note.selectors';
import { selectArchived } from '@store/settings/settings.selectors';
import { saveSettings } from '@store/settings/settings.actions';
import { deleteNote } from '@store/note/note.actions';

import { iFrameMessage } from '@models/preview.model';
import { SvgIconService } from '@services/svg-icon.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  icons: { [key: string]: SafeHtml } = {};

  isArchived = false;

  private currentFontSize = 1.2;
  private minFontSize = 0.4;
  private maxFontSize = 4;

  private iframeLoaded$ = new Subject<void>();
  private activeNote$ = this.store.select(selectActiveNote);
  private archivedNotes$ = this.store.select(selectArchived);
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

    // react on dark mode changes
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

    combineLatest([this.archivedNotes$, this.activeNote$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([archived, active]) => {
        if (active) this.isArchived = archived.includes(active?.path);
      });
  }

  deleteNote() {
    // take only the first emitted value and complete the observable
    combineLatest([this.activeNote$, this.archivedNotes$])
      .pipe(take(1))
      .subscribe(([note, archived]) => {
        if (!note) return;

        archived.includes(note.path)
          ? this.store.dispatch(deleteNote({ notePath: note.path }))
          : this.store.dispatch(
              saveSettings({
                settings: { archived: [...archived, note.path] },
              })
            );
      });
  }

  restoreNote() {
    combineLatest([this.activeNote$, this.archivedNotes$])
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

  print() {
    const iframe = this.iframe.nativeElement;
    if (iframe) {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
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

  ngOnDestroy() {
    if (this.darkModeObserver) {
      this.darkModeObserver.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
