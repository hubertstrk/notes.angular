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

import { Subscription } from 'rxjs';

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
  darkModeSubscription: Subscription;
  basePathSubscription: Subscription;
  notesSubscription: Subscription;

  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadSettings());

    this.darkModeSubscription = this.isDarkMode$.subscribe(darkMode => {
      document.body.classList.toggle('dark', darkMode);
    });

    this.basePathSubscription = this.selectBasePath$.subscribe(basePath => {
      if (basePath) this.store.dispatch(loadNotes({ directory: basePath }));
      else void this.router.navigate(['/settings']);
    });

    this.notesSubscription = this.actions$
      .pipe(ofType(notesLoaded))
      .subscribe(() => {
        void this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
    this.basePathSubscription.unsubscribe();
    this.notesSubscription.unsubscribe();
  }
}
