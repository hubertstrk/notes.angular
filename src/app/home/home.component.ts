import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../service/settings-service';
import { CommonModule } from '@angular/common';

import { Note } from '../../model/note.model';

import { ButtonComponent } from '../shared/button/button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PreviewComponent } from '../preview/preview.component';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SidebarComponent,
    PreviewComponent,
    EditorComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  collapsed = false;
  selectedNote: Note | null = null;

  checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  ngOnInit(): void {
    this.settingsService.readSettings().then(settings => {
      console.log(settings);
    });
  }
}
