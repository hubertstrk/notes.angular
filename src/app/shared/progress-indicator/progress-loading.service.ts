import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressState {
  isLoading: boolean;
  progress: number;
  message: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressLoadingService {
  private progressSubject = new BehaviorSubject<ProgressState>({
    isLoading: false,
    progress: 0,
    message: null,
  });
  public progress$ = this.progressSubject.asObservable();

  constructor() {}

  show(message: string | null = null, initialProgress: number = 0): void {
    this.progressSubject.next({
      isLoading: true,
      progress: this.validateProgress(initialProgress),
      message,
    });
  }

  updateProgress(progress: number, message?: string): void {
    const currentState = this.progressSubject.value;
    this.progressSubject.next({
      isLoading: currentState.isLoading,
      progress: this.validateProgress(progress),
      message: message ?? currentState.message,
    });
  }

  hide(): void {
    setTimeout(() => {
      this.progressSubject.next({
        isLoading: false,
        progress: 0,
        message: null,
      });
    }, 600);
  }

  private validateProgress(progress: number): number {
    if (progress < 0) {
      return 0;
    } else if (progress > 100) {
      return 100;
    }
    return progress;
  }
}
