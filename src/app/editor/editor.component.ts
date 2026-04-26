import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';

import * as monaco from 'monaco-editor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { Observable, Subject, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ButtonComponent } from '../shared/button/button.component';
import { SummaryDialogComponent } from './summary-dialog/summary-dialog.component';
import { Note } from '@models/note.model';
import { NotesService } from '@services/notes.services';
import { DefaultEditorConfig } from '@app/editor/editor.config';

import { updateContent } from '@store/note/note.actions';
import { selectActiveNote } from '@store/note/note.selectors';
import { updateCursorPosition } from '@store/editor/editor.actions';
import { selectDarkMode } from '@store/settings/settings.selectors';

import { SvgIconService } from '@services/svg-icon.service';
import { LlmService } from '@app/services/llm.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, MonacoEditorModule, ButtonComponent, SummaryDialogComponent],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef;

  resizeObserver!: ResizeObserver;

  private destroy$ = new Subject<void>();
  activeNote$: Observable<Note | null> = this.store.select(selectActiveNote);
  activeNote: Note | null = null;
  editorOptions = DefaultEditorConfig;

  isDarkMode$ = this.store.select(selectDarkMode);
  isDarkMode = false;

  icons: { [key: string]: SafeHtml } = {};

  dialogOpen = false;
  summaryText = '';
  isSummarizing = false;

  private monacoInstance!: monaco.editor.IStandaloneCodeEditor;

  constructor(
    private store: Store,
    private noteService: NotesService,
    private iconService: SvgIconService,
    private llmService: LlmService
  ) {}

  ngOnInit() {
    this.iconService
      .getIcons([
        'material-symbols-light--wand',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(icons => {
        this.icons = icons;
      });

    this.activeNote$.pipe(takeUntil(this.destroy$)).subscribe(note => {
      this.activeNote = note;
    });

    this.isDarkMode$.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
      this.isDarkMode = isDark;
      this.updateEditorOptions();
    });
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.monacoInstance?.layout();
    });
    this.resizeObserver.observe(this.editorContainer.nativeElement);
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.monacoInstance = editor;

    this.updateEditorOptions();

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

  updateEditorOptions() {
    if (this.monacoInstance) {
      const updatedEditorOptions = {
        ...this.editorOptions,
        theme: this.isDarkMode ? 'vs-dark' : 'vs-light',
      };
      this.monacoInstance.updateOptions(updatedEditorOptions);
    }
  }

  async summarizeNote() {
    if (!this.activeNote || !this.monacoInstance) {
      console.error('Cannot summarize note: Note content or editor not available.');
      return;
    }

    if (this.isSummarizing) {
      return;
    }

    console.log('Starting summary generation...');
    
    try {
      const notesText = this.activeNote.content || '';
      this.isSummarizing = true;

      this.llmService.summarizeNote(notesText).subscribe({
        next: (summary) => {
          console.log('✅ Summary received from LLM Studio:', summary);
          this.summaryText = summary;
          this.dialogOpen = true;
        },
        error: (err) => {
          console.error('❌ Error generating summary:', err);
          this.isSummarizing = false;
        },
        complete: () => {
          console.log('Summary generation process finished.');
          this.isSummarizing = false;
        }
      });
    } catch (error) {
      console.error('An unexpected error occurred while calling summarizeNote:', error);
      this.isSummarizing = false;
    }
  }

  onSummaryAccepted() {
    if (this.activeNote) {
      const heading = this.noteService.extractHeading(this.summaryText);
      this.store.dispatch(
        updateContent({
          notePath: this.activeNote.path,
          content: this.summaryText,
          heading,
        })
      );
    }
    this.dialogOpen = false;
    this.summaryText = '';
  }

  onSummaryCancelled() {
    this.dialogOpen = false;
    this.summaryText = '';
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.monacoInstance) {
      this.monacoInstance.layout();
    }
  }

  onTextChange(content: string): void {
    if (!this.activeNote) return;
    if (!content || content.length === 0) return;
    if (this.activeNote.content === content) return;

    const heading = this.noteService.extractHeading(content);

    this.store.dispatch(
      updateContent({
        notePath: this.activeNote!.path,
        content,
        heading,
      })
    );
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
