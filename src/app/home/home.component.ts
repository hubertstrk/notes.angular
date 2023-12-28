import { Component, OnInit } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { PreviewComponent } from '../preview/preview.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EditorChange } from '../../model/editor';
import { SettingsService } from '../../service/settings-service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    EditorComponent,
    PreviewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  editorChange: EditorChange;

  constructor(private settingsService: SettingsService) {}

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
