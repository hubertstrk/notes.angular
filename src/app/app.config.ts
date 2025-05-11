import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

import { initSettingsFactory } from '../factory/settings-factory';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { noteReducer } from '../store/note.reducers';
import { editorReducer } from '../store/editor.reducers';
import { NoteEffects } from '../store/note.effect';

import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initSettingsFactory,
      multi: true,
    },
    provideStore({ note: noteReducer, editor: editorReducer }),
    provideEffects([NoteEffects]),
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {},
    },
  ],
};
