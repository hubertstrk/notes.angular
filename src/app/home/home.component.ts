import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../service/settings-service';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../shared/button/button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PreviewComponent } from '../preview/preview.component';
import { EditorComponent } from '../editor/editor.component';
import { FooterComponent } from '../footer/footer.component';

import { Store } from '@ngrx/store';
import { addNote } from '../../store/note.actions';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  collapsed = false;

  chevronLeft: SafeHtml | undefined;
  chevronRight: SafeHtml | undefined;
  plus: SafeHtml | undefined;

  ngOnInit(): void {
    this.settingsService.readSettings().then(settings => {
      console.log(settings);
    });

    this.chevronLeft = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	<path fill="currentColor" d="M10.354 3.146a.5.5 0 0 1 0 .708L6.207 8l4.147 4.146a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0" />
</svg>`);
    this.chevronRight = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	<path fill="currentColor" d="M5.646 3.146a.5.5 0 0 0 0 .708L9.793 8l-4.147 4.146a.5.5 0 0 0 .708.708l4.5-4.5a.5.5 0 0 0 0-.708l-4.5-4.5a.5.5 0 0 0-.708 0" />
</svg>`);

    this.plus = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12">
	<path fill="currentColor" d="M6 2a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 6 2" />
</svg>`);
  }

  addNoteClicked() {
    this.store.dispatch(
      addNote({
        note: {
          content: '# new note',
          heading: 'new note',
          path: `C:\\Users\\nz3k4\\Downloads\\notes\\${uuidv4()}.md`,
        },
      })
    );
  }
}
