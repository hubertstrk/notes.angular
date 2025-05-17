import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';

import { ButtonComponent } from '../shared/button/button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PreviewComponent } from '../preview/preview.component';
import { EditorComponent } from '../editor/editor.component';
import { FooterComponent } from '../footer/footer.component';

import { Icon, IconService } from '../../service/icon.service';

import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { addNote } from '../../store/note.actions';
import { selectBasePath } from '../../store/settings.selectors';
import { NEW_NOTE_TITLE } from '../../model/note.model';

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
  ],
  providers: [IconService],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private store: Store,
    private router: Router,
    private icons: IconService
  ) {}

  collapsed = false;

  currentBasePath$ = this.store.select(selectBasePath);

  chevronLeft: SafeHtml;
  chevronRight: SafeHtml;
  plus: SafeHtml;
  settings: SafeHtml;

  ngOnInit() {
    this.chevronLeft = this.icons.getIcon(Icon.ChevronLeft);
    this.chevronRight = this.icons.getIcon(Icon.ChevronRight);
    this.plus = this.icons.getIcon(Icon.Plus);
    this.settings = this.icons.getIcon(Icon.Settings);
  }

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
}
