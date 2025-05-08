import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, MonacoEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  @Input() text: string;

  @ViewChild('editor') editor: ElementRef<HTMLElement>;

  editorOptions = { theme: 'vs-light', language: 'markdown' };
  code: string =
    '# heading 1\n## heading 2\n### heading 3\n#### heading 4\n##### heading 5\n###### heading 6\n\n---\n\n- list item 1\n- list item 2\n- list item 3\n- list item 4\n- list item 5\n- list item 6\n- list item 7\n- list item 8\n- list item 9\n- list item 10\n- list item 11\n- list item 12\n- list item 13\n- list item 14\n- list item 15\n- list item 16\n- list item 17\n- list item 18\n- list item 19\n- list item 20';
}
