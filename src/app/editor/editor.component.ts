import { Component } from '@angular/core';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [PreviewComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {}
