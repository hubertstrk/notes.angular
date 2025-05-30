import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-gray-300 rounded-full h-2.5 dark:bg-zinc-600">
      <div
        class="bg-gradient-to-r from-fuchsia-400 to-yellow-300 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        [style.width.%]="progress"></div>
    </div>
    <div
      class="text-xs text-right mt-2 text-black dark:text-white"
      *ngIf="showPercentage">
      {{ progress | number: '1.0-0' }}%
    </div>
  `,
})
export class ProgressBarComponent implements OnInit {
  @Input() progress: number = 0;
  @Input() showPercentage: boolean = false;

  ngOnInit(): void {
    this.validateProgress();
  }

  private validateProgress(): void {
    if (this.progress < 0) {
      this.progress = 0;
    } else if (this.progress > 100) {
      this.progress = 100;
    }
  }
}
