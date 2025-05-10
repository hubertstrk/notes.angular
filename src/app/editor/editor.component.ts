import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Input,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveNote } from '../../store/note.selectors';
import { Observable } from 'rxjs';
import { Note } from '../../model/note.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { updateContent } from '../../store/note.actions';
import { filter, take, map } from 'rxjs/operators';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, MonacoEditorModule],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @ViewChild('editor') editor: ElementRef<HTMLElement>;

  resizeObserver!: ResizeObserver;

  activeNote$: Observable<Note | null> = this.store.select(selectActiveNote);

  editorOptions = { theme: 'vs-light', language: 'markdown' };

  private monacoInstance!: monaco.editor.IStandaloneCodeEditor;

  constructor(private store: Store) {}

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.monacoInstance?.layout();
    });
    this.resizeObserver.observe(this.editorContainer.nativeElement);
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.monacoInstance = editor;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.monacoInstance) {
      this.monacoInstance.layout();
    }
  }

  onTextChange(newText: string): void {
    this.activeNote$
      .pipe(
        filter(note => !!note),
        take(1),
        map(note => ({
          notePath: note!.path,
          content: newText,
        }))
      )
      .subscribe(payload => {
        this.store.dispatch(updateContent(payload));
      });
  }
}
