import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import {
  ProgressLoadingService,
  ProgressState,
} from './progress-loading.service';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent],
  templateUrl: './progress-indicator.component.html',
})
export class ProgressIndicatorComponent implements OnInit, OnDestroy {
  isVisible = false;
  progress = 0;
  message: string | null = null;
  private subscription: Subscription;

  constructor(private progressLoadingService: ProgressLoadingService) {}

  ngOnInit(): void {
    this.subscription = this.progressLoadingService.progress$.subscribe(
      (state: ProgressState) => {
        this.isVisible = state.isLoading;
        this.progress = state.progress;
        this.message = state.message;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
