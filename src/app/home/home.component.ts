import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ButtonComponent } from '@app/shared/button/button.component';
import { WindowControlsComponent } from '@app/shared/window-controls/window-controls.component';
import { NoteListComponent } from '@app/sidebar/note-list.component';
import { PreviewComponent } from '@app/preview/preview.component';
import { EditorComponent } from '@app/editor/editor.component';
import { FooterComponent } from '@app/footer/footer.component';
import { AppSearchComponent } from '@app/search/search.component';
import { NoteTemplatePopupComponent } from './note-template-popup/note-template-popup.component';

import { v4 } from 'uuid';
import { Store } from '@ngrx/store';

import { addNote, setActiveNote } from '@store/note/note.actions';
import {
  selectBasePath,
  selectDarkMode,
} from '@store/settings/settings.selectors';
import { Note } from '@models/note.model';
import { NoteMode } from '@models/mode.model';
import { saveSettings } from '@store/settings/settings.actions';
import { SvgIconService } from '@services/svg-icon.service';
import { NoteTemplateWithContent } from '@app/home/note-template-popup/note-template.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    WindowControlsComponent,
    NoteListComponent,
    PreviewComponent,
    EditorComponent,
    FooterComponent,
    AppSearchComponent,
    NoteTemplatePopupComponent,
  ],
  providers: [SvgIconService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  icons: { [key: string]: SafeHtml } = {};

  Modes = NoteMode;
  currentMode: NoteMode = NoteMode.Notes;

  collapsed = false;
  showSearch = false;
  showTemplatePopup = false;

  currentBasePath$ = this.store.select(selectBasePath);
  isDarkMode$ = this.store.select(selectDarkMode);

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private iconService: SvgIconService
  ) {}

  ngOnInit() {
    this.iconService
      .getIcons([
        'fluent--note-24-regular',
        'fluent--delete-24-regular',
        'fluent--settings-28-regular',
        'fluent--chevron-left-24-regular',
        'fluent--chevron-right-24-regular',
        'material-symbols-light--dark-mode-outline',
        'material-symbols-light--add',
        'fluent--search-24-regular',
        'fluent--weather-sunny-24-regular',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(icons => {
        this.icons = icons;
      });
  }

  onTemplateSelected(template: NoteTemplateWithContent) {
    this.currentBasePath$
      .pipe(takeUntil(this.destroy$))
      .subscribe(basePath => {
        if (basePath) {
          // get bytes from template.content
          const encoder = new TextEncoder();
          const bytes = encoder.encode(template.content);
          const contentSize = bytes.length;

          this.store.dispatch(
            addNote({
              note: {
                content: template.content,
                heading: template.title,
                path: `${basePath}\\${v4()}.md`,
                createdAt: new Date(),
                updatedAt: new Date(),
                size: contentSize,
              },
            })
          );
          this.showTemplatePopup = false;
        }
      });
  }

  onNoteClicked(note: Note) {
    this.showSearch = false;
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }

  toggleDarkMode() {
    this.isDarkMode$.pipe(take(1)).subscribe(isDarkMode => {
      this.store.dispatch(saveSettings({ settings: { dark: !isDarkMode } }));
    });
  }

  routeToSettings() {
    void this.router.navigate(['/settings']);
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    this.showTemplatePopup = false;
    this.showSearch = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
