import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@app/shared/button/button.component';
import { SvgIconService } from '@services/svg-icon.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-note-template-popup',
  templateUrl: './note-template-popup.component.html',
  styleUrls: ['./note-template-popup.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent],
  providers: [SvgIconService],
})
export class NoteTemplatePopupComponent implements OnInit, AfterViewInit {
  @Output() templateSelected = new EventEmitter<{
    title: string;
    content: string;
  }>();

  @Output() closed = new EventEmitter<void>();
  icons: { [key: string]: SafeHtml } = {};
  templates: Array<{
    icon: string;
    title: string;
    description: string;
    content: string;
  }> = [];
  private templateFiles = [
    {
      icon: '📝',
      file: 'template-blank.md',
      title: 'Blank Note',
      description:
        'Simple blank note template for freeform writing or note-taking.',
    },
    {
      icon: '📈',
      file: 'template-meeting-notes.md',
      title: 'Meeting Notes',
      description:
        'Structure for capturing meeting details, attendees, agenda, and action items.',
    },
    {
      icon: '📅',
      file: 'template-daily-journal.md',
      title: 'Daily Journal Telate',
      description: 'A daily log for thoughts, tasks, and reflections.',
    },
    {
      icon: '💡',
      file: 'template-brainstorming.md',
      title: 'Brainstorming / Idea Dump',
      description:
        'A freeform space for capturing ideas and brainstorming sessions.',
    },
    {
      icon: '🚀',
      file: 'template-project-planning.md',
      title: 'Project Planning',
      description: 'Outline project goals, milestones, and tasks.',
    },
  ];

  constructor(private iconService: SvgIconService) {}

  ngOnInit(): void {
    this.iconService
      .getIcons(['material-symbols--close-small-outline-rounded'])
      .subscribe(icons => {
        this.icons = icons;
      });
  }

  async ngAfterViewInit() {
    this.templates = [];
    for (const template of this.templateFiles) {
      try {
        // Use fetch for static assets in Angular
        const content = await fetch('assets/templates/' + template.file).then(
          result => result.text()
        );
        this.templates.push({
          icon: template.icon,
          title: template.title,
          description: template.description,
          content,
        });
      } catch (exe) {
        console.error(`Error reading template file ${template.file}:`, exe);
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
