import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService, LoadingState } from './loading.service';
import { Subscription } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { IconService, Icon } from '@services/icon.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.component.html',
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  isVisible = false;
  private subscription: Subscription;
  loadingIcon: SafeHtml;
  text: string = '';

  constructor(
    private loadingService: LoadingService,
    private iconService: IconService
  ) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (state: LoadingState) => {
        this.isVisible = state.isLoading;
        this.text = state.message;
      }
    );

    this.loadingIcon = this.iconService.getIcon(Icon.loading);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
