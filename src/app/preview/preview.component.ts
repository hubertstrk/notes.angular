import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { EditorChange } from '../../model/editor';
import { marked } from 'marked';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent implements AfterViewInit {
  _editorChange: EditorChange;

  @ViewChild('preview') preview: ElementRef<HTMLElement>;

  @Input() set editorChange(value: EditorChange) {
    this._editorChange = value;
    if (this.preview) {
      this.preview.nativeElement.innerHTML = marked.parse(value.text) as string;
    }
  }

  ngAfterViewInit(): void {
    this.preview.nativeElement.innerHTML = marked.parse(
      this._editorChange?.text ?? ''
    ) as string;
  }
}
