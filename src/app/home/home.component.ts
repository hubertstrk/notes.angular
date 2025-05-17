import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';

import { ButtonComponent } from '../shared/button/button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PreviewComponent } from '../preview/preview.component';
import { EditorComponent } from '../editor/editor.component';
import { FooterComponent } from '../footer/footer.component';
import { AppSearchComponent } from '../search/search.component';

import { Icon, IconService } from '../../service/icon.service';

import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { addNote } from '../../store/note.actions';
import { selectBasePath } from '../../store/settings.selectors';
import { NEW_NOTE_TITLE, Note } from '../../model/note.model';

import { setActiveNote } from '../../store/note.actions';

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
  ],
  providers: [IconService],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private router: Router,
    private icons: IconService
  ) {}

  collapsed = false;
  showSearch = false;
  currentBasePath$ = this.store.select(selectBasePath);

  chevronLeft: SafeHtml;
  chevronRight: SafeHtml;
  plus: SafeHtml;
  settings: SafeHtml;
  search: SafeHtml;

  ngOnInit() {
    this.chevronLeft = this.icons.getIcon(Icon.ChevronLeft);
    this.chevronRight = this.icons.getIcon(Icon.ChevronRight);
    this.plus = this.icons.getIcon(Icon.Plus);
    this.settings = this.icons.getIcon(Icon.Settings);
    this.search = this.icons.getIcon(Icon.Search);
    window.addEventListener('keydown', this.handleEsc, true);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleEsc, true);
  }

  handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.showSearch) {
      this.showSearch = false;
    }
  };

  addNoteClicked() {
    this.currentBasePath$.subscribe(basePath => {
      if (basePath) {
        this.store.dispatch(
          addNote({
            note: {
              content: `# ${NEW_NOTE_TITLE}`,
              heading: NEW_NOTE_TITLE,
              path: `${basePath}\\${uuidv4()}.md`,
            },
          })
        );
      }
    });
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  onNoteClicked(note: Note) {
    this.showSearch = false;
    this.store.dispatch(setActiveNote({ notePath: note.path }));
  }
}
