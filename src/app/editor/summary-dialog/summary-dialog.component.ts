import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

import { ButtonComponent } from '@app/shared/button/button.component';

@Component({
  selector: 'app-summary-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './summary-dialog.component.html',
  styleUrl: './summary-dialog.component.scss'
})
export class SummaryDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Input() summary: string = '';
  @Output() accepted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  summaryHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.convertMarkdownToHtml();
  }

  ngOnChanges() {
    this.convertMarkdownToHtml();
  }

  private convertMarkdownToHtml() {
    if (this.summary) {
      marked.setOptions({
        breaks: true,
        gfm: true,
        async: false,
      });
      const html = marked.parse(this.summary) as string;
      this.summaryHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  onAccept() {
    this.accepted.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
