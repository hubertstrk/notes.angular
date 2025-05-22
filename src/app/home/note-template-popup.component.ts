import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-note-template-popup',
  templateUrl: './note-template-popup.component.html',
  styleUrls: ['./note-template-popup.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent],
})
export class NoteTemplatePopupComponent implements AfterViewInit {
  @Output() templateSelected = new EventEmitter<{
    title: string;
    content: string;
  }>();
  @Output() closed = new EventEmitter<void>();

  customTitle = '';

  templates: Array<{ title: string; description: string; content: string }> =
    [];

  private templateFiles = [
    {
      file: 'template-blank.md',
      title: 'Blank Note',
      description:
        'Simple blank note template for freeform writing or note-taking.',
    },
    {
      file: 'template-meeting-notes.md',
      title: 'Meeting Notes',
      description:
        'Structure for capturing meeting details, attendees, agenda, and action items.',
    },
    {
      file: 'template-daily-journal.md',
      title: 'Daily Journal Telate',
      description: 'A daily log for thoughts, tasks, and reflections.',
    },
    {
      file: 'template-brainstorming.md',
      title: 'Brainstorming / Idea Dump',
      description:
        'A freeform space for capturing ideas and brainstorming sessions.',
    },
    {
      file: 'template-project-planning.md',
      title: 'Project Planning',
      description: 'Outline project goals, milestones, and tasks.',
    },
  ];

  async ngAfterViewInit() {
    this.templates = [];
    for (const t of this.templateFiles) {
      try {
        // Use fetch for static assets in Angular
        const content = await fetch('assets/templates/' + t.file).then(r =>
          r.text()
        );
        this.templates.push({
          title: t.title,
          description: t.description,
          content,
        });
      } catch (e) {
        console.error(`Error reading template file ${t.file}:`, e);
      }
    }
  }

  selectTemplate(template: { title: string; content: string }) {
    this.templateSelected.emit(template);
  }

  close() {
    this.closed.emit();
  }
}
