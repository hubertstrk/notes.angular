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
import { templateFiles } from './template-files';
import { NoteTemplateWithContent } from '@app/home/note-template-popup/note-template.model';

@Component({
  selector: 'app-note-template-popup',
  templateUrl: './note-template-popup.component.html',
  styleUrls: ['./note-template-popup.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent],
  providers: [SvgIconService],
})
export class NoteTemplatePopupComponent implements OnInit, AfterViewInit {
  @Output() templateSelected = new EventEmitter<NoteTemplateWithContent>();

  @Output() closed = new EventEmitter<void>();

  icons: { [key: string]: SafeHtml } = {};
  templates: Array<NoteTemplateWithContent> = [];

  constructor(private iconService: SvgIconService) {}

  ngOnInit(): void {
    this.iconService
      .getIcons(['material-symbols-light--close-rounded'])
      .subscribe(icons => {
        this.icons = icons;
      });
  }

  async ngAfterViewInit() {
    for (const template of templateFiles) {
      try {
        const content = await fetch('assets/templates/' + template.file).then(
          result => result.text()
        );
        this.templates.push({ ...template, content });
      } catch (exe) {
        console.error(`Error reading template file ${template.file}:`, exe);
      }
    }
  }

  selectTemplate(template: NoteTemplateWithContent) {
    this.templateSelected.emit(template);
  }

  close() {
    this.closed.emit();
  }

  trackByFn(index: number, item: NoteTemplateWithContent) {
    return item.title;
  }
}
