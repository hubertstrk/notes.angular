import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { PreviewComponent } from '../preview/preview.component';

import * as ace from 'ace-builds';
import { EditorChange } from '../../model/editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [PreviewComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @Input() text: string;

  @Output() textChanged = new EventEmitter<EditorChange>();

  @ViewChild('editor') editor: ElementRef<HTMLElement>;

  aceEditor: ace.Ace.Editor;

  ngAfterViewInit(): void {
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.session.setMode('ace/mode/markdown');

    aceEditor.session.setValue(this.text);

    aceEditor.on('change', delta => {
      this.textChanged.emit({
        ...delta,
        text: aceEditor.session.getValue(),
      });
    });
  }

  ngOnDestroy(): void {
    this.aceEditor.destroy();
    this.aceEditor.container.remove();
  }
}
