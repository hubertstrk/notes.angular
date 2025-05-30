import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({
    isLoading: false,
    message: '',
  });
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  show(message: string = ''): void {
    this.loadingSubject.next({ isLoading: true, message });
  }

  hide(): void {
    this.loadingSubject.next({ isLoading: false, message: '' });
  }
}
