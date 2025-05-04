import { Component, OnInit } from '@angular/core';
import { EditorChange } from '../../model/editor.model';
import { SettingsService } from '../../service/settings-service';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../shared/button/button.component';

import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  editorChange: EditorChange;

  constructor(private settingsService: SettingsService) {}

  collapsed = false;

  checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  onTextChanged(event: EditorChange) {
    // TODO: save note
    this.editorChange = event;
  }

  ngOnInit(): void {
    this.settingsService.readSettings().then(settings => {
      console.log(settings);
    });

    // TODO: load notes
    this.editorChange = {
      text: '# Hello World',
      action: 'insert',
      start: {
        row: 0,
        column: 0,
      },
      end: {
        row: 0,
        column: 0,
      },
      lines: [],
    };
  }
}
