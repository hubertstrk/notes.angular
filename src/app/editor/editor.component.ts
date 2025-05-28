import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveNote } from '@store/note/note.selectors';
import { Observable } from 'rxjs';
import { Note } from '@models/note.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { updateContent } from '@store/note/note.actions';
import { filter, map, take } from 'rxjs/operators';
import * as monaco from 'monaco-editor';
import { updateCursorPosition } from '@store/editor/editor.actions';
import { NotesService } from '@services/notes.services';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, MonacoEditorModule],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef;

  resizeObserver!: ResizeObserver;
  private darkModeObserver!: MutationObserver;

  activeNote$: Observable<Note | null> = this.store.select(selectActiveNote);

  editorOptions = {
    theme: document.body.classList.contains('dark') ? 'vs-dark' : 'vs-light',
    language: 'markdown',
    mouseWheelZoom: true,
    wordWrap: 'on',
    automaticLayout: true,
    renderWhitespace: 'boundary',
    tabSize: 2,
    insertSpaces: true,
    wrappingIndent: 'same',
    smoothScrolling: true,
    lineDecorationsWidth: 0,
    cursorSmoothCaretAnimation: true,
  };

  private monacoInstance!: monaco.editor.IStandaloneCodeEditor;

  constructor(
    private store: Store,
    private noteService: NotesService
  ) {}

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.monacoInstance?.layout();
    });
    this.resizeObserver.observe(this.editorContainer.nativeElement);

    // Set up observer for dark mode changes
    this.darkModeObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDark = document.body.classList.contains('dark');
          if (this.monacoInstance) {
            this.editorOptions = {
              ...this.editorOptions,
              theme: isDark ? 'vs-dark' : 'vs-light',
            };
          }
        }
      });
    });

    this.darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.darkModeObserver) {
      this.darkModeObserver.disconnect();
    }
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.monacoInstance = editor;

    this.monacoInstance.onDidChangeCursorPosition(e => {
      const position = e.position;
      this.store.dispatch(
        updateCursorPosition({
          line: position.lineNumber,
          column: position.column,
        })
      );
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.monacoInstance) {
      this.monacoInstance.layout();
    }
  }

  onTextChange(content: string): void {
    this.activeNote$
      .pipe(
        filter(note => !!note),
        take(1),
        map(note => {
          const heading = this.noteService.extractHeading(content);

          return {
            notePath: note!.path,
            content,
            heading,
          };
        })
      )
      .subscribe(payload => {
        this.store.dispatch(updateContent(payload));
      });
  }
}
