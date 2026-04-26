import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-summary-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col mx-4">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Summary</h2>
            <button
              (click)="onCancel()"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">
              ✕
            </button>
          </div>

          <!-- Content with scroll -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div
              class="prose dark:prose-invert max-w-none"
              [innerHTML]="summaryHtml">
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              (click)="onCancel()"
              class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button
              (click)="onAccept()"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
              Accept & Update Note
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .prose {
      line-height: 1.6;
    }
    .prose p {
      margin: 1em 0;
    }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      margin-top: 1em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    .prose ul, .prose ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    .prose li {
      margin: 0.25em 0;
    }
    .prose code {
      background: rgba(0,0,0,0.1);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }
    .prose blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      margin-left: 0;
      color: #666;
    }
  `]
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
