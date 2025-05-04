import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

import { initSettingsFactory } from '../factory/settings-factory';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { noteReducer } from '../store/note.reducers';
import { NoteEffects } from '../store/note.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initSettingsFactory,
      multi: true,
    },
    provideStore({ note: noteReducer }),
    provideEffects([NoteEffects]),
  ],
};
