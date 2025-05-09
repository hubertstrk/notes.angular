import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveNote } from '../../store/note.selectors';
import { Observable } from 'rxjs';
import { Note } from '../../model/note.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { updateContent } from '../../store/note.actions';
import { filter, take, map } from 'rxjs/operators';

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
  code: string;

  activeNote$: Observable<Note | null>;

  constructor(private store: Store) {
    this.activeNote$ = this.store.select(selectActiveNote);
  }

  onTextChange(newText: string): void {
    console.log('Text changed:', newText);
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
