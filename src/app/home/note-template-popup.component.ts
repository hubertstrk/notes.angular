import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-template-popup',
  templateUrl: './note-template-popup.component.html',
  styleUrls: ['./note-template-popup.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class NoteTemplatePopupComponent {
  @Output() templateSelected = new EventEmitter<{
    title: string;
    content: string;
  }>();
  @Output() closed = new EventEmitter<void>();

  customTitle = '';

  templates = [
    {
      title: 'Meeting Notes Template',
      description:
        'Structure for capturing meeting details, attendees, agenda, and action items.',
      content: `# Meeting Notes\n\n**Date:** \n**Attendees:** \n\n## Agenda\n- \n\n## Notes\n- \n\n## Action Items\n- [ ] `,
    },
    {
      title: 'Daily Journal Template',
      description: 'A daily log for thoughts, tasks, and reflections.',
      content: `# Daily Journal\n\n**Date:** \n\n## What happened today?\n- \n\n## Thoughts/Reflections\n- \n\n## Tasks for Tomorrow\n- [ ] `,
    },
    {
      title: 'Book Notes Template',
      description:
        'Summarize key points, quotes, and personal takeaways from a book.',
      content: `# Book Notes\n\n**Title:** \n**Author:** \n\n## Summary\n\n## Key Points\n- \n\n## Quotes\n> `,
    },
    {
      title: 'Brainstorming / Idea Dump Template',
      description:
        'A freeform space for capturing ideas and brainstorming sessions.',
      content: `# Brainstorming / Idea Dump\n\n## Ideas\n- \n\n## Next Steps\n- [ ] `,
    },
    {
      title: 'Project Planning Template',
      description: 'Outline project goals, milestones, and tasks.',
      content: `# Project Planning\n\n**Project Name:** \n\n## Goals\n- \n\n## Milestones\n- \n\n## Tasks\n- [ ] `,
    },
  ];

  selectTemplate(template: { title: string; content: string }) {
    this.templateSelected.emit(template);
  }

  createBlankNote() {
    if (this.customTitle.trim()) {
      this.templateSelected.emit({
        title: this.customTitle,
        content: `# ${this.customTitle}`,
      });
      this.customTitle = '';
    }
  }

  close() {
    this.closed.emit();
  }
}
