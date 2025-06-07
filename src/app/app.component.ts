import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NotesService } from '@services/notes.services';
import { Store } from '@ngrx/store';
import { loadNotes, notesLoaded } from '@store/note/note.actions';
import { Actions, ofType } from '@ngrx/effects';
import {
  selectBasePath,
  selectDarkMode,
} from '@store/settings/settings.selectors';
import { loadSettings } from '@store/settings/settings.actions';
import { ProgressIndicatorComponent } from './shared/progress-indicator/progress-indicator.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [NotesService, Store],
  imports: [CommonModule, RouterOutlet, ProgressIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isDarkMode$ = this.store.select(selectDarkMode);
  selectBasePath$ = this.store.select(selectBasePath);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadSettings());

    this.isDarkMode$.pipe(takeUntil(this.destroy$)).subscribe(darkMode => {
      document.body.classList.toggle('dark', darkMode);
    });

    this.selectBasePath$.pipe(takeUntil(this.destroy$)).subscribe(basePath => {
      if (basePath) this.store.dispatch(loadNotes({ directory: basePath }));
      else void this.router.navigate(['/settings']);
    });

    this.actions$
      .pipe(ofType(notesLoaded), takeUntil(this.destroy$))
      .subscribe(() => {
        void this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
