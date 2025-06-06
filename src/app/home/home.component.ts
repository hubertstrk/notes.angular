import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';

import { ButtonComponent } from '@app/shared/button/button.component';
import { SidebarComponent } from '@app/sidebar/sidebar.component';
import { PreviewComponent } from '@app/preview/preview.component';
import { EditorComponent } from '@app/editor/editor.component';
import { FooterComponent } from '@app/footer/footer.component';
import { AppSearchComponent } from '@app/search/search.component';
import { NoteTemplatePopupComponent } from './note-template-popup.component';

import { v4 } from 'uuid';
import { Store } from '@ngrx/store';

import { addNote, setActiveNote } from '@store/note/note.actions';
import {
  selectBasePath,
  selectDarkMode,
} from '@store/settings/settings.selectors';
import { Note } from '@models/note.model';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import { saveSettings } from '@store/settings/settings.actions';
import { SvgIconService } from '@services/svg-icon.service';

const appWindow = getCurrentWebviewWindow();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SidebarComponent,
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

  currentMode: 'notes' | 'archived' = 'notes';

  isDarkMode = false;
  collapsed = false;
  showSearch = false;
  showTemplatePopup = false;

  currentBasePath$ = this.store.select(selectBasePath);
  isDarkMode$ = this.store.select(selectDarkMode);

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
        'fluent--dark-theme-24-filled',
        'fluent--note-add-24-regular',
        'fluent--search-24-regular',
        'fluent--weather-sunny-24-regular',
        'fluent--minimize-24-filled',
        'fluent--maximize-24-regular',
        'material-symbols--close-small-outline-rounded',
      ])
      .subscribe(icons => {
        this.icons = icons;
      });

    window.addEventListener('keydown', this.handleEsc, true);

    this.isDarkMode$.subscribe(darkMode => {
      this.isDarkMode = darkMode;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleEsc, true);
  }

  handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (this.showTemplatePopup) {
        this.showTemplatePopup = false;
      } else if (this.showSearch) {
        this.showSearch = false;
      }
    }
  };

  onTemplateSelected(template: { title: string; content: string }) {
    this.currentBasePath$.subscribe(basePath => {
      if (basePath) {
        this.store.dispatch(
          addNote({
            note: {
              content: template.content,
              heading: template.title,
              path: `${basePath}\\${v4()}.md`,
              createdAt: new Date(),
              updatedAt: new Date(),
              size: 0,
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
    this.store.dispatch(saveSettings({ settings: { dark: !this.isDarkMode } }));
  }

  minimizeWindow() {
    void appWindow.minimize();
  }

  maximizeWindow() {
    void appWindow.toggleMaximize();
  }

  closeWindow() {
    void appWindow.close();
  }

  routeToSettings() {
    void this.router.navigate(['/settings']);
  }
}
