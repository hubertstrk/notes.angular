import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadSettings,
  loadSettingsSuccess,
  loadSettingsFailure,
  saveSettings,
  saveSettingsSuccess,
  saveSettingsFailure,
} from './settings.actions';
import { SettingsService } from '@services/settings.service';
import { Settings } from '@models/settings.model';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { union, uniq } from 'lodash';
import { selectSettingsState } from './settings.selectors';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
    private store: Store
  ) {}

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSettings),
      switchMap(() =>
        from(this.settingsService.readSettings()).pipe(
          map(settings => loadSettingsSuccess({ settings })),
          catchError(error => of(loadSettingsFailure({ error: String(error) })))
        )
      )
    );
  });

  saveSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveSettings),
      withLatestFrom(this.store.select(selectSettingsState)),
      switchMap(([action, state]) => {
        const basePath = action.settings.basePath ?? state.basePath;
        const dark = action.settings.dark ?? state.dark;
        const id = action.settings.id ?? state.id;
        const archived = uniq(union(state.archived, action.settings.archived));

        const mergedSettings = {
          basePath,
          dark,
          id,
          archived,
        } as Settings;

        // Use tap to handle the side effect and then immediately emit the success action
        return this.settingsService
          .saveSettings(mergedSettings)
          .then(() => saveSettingsSuccess({ settings: mergedSettings }))
          .catch(error => saveSettingsFailure({ error: String(error) }));
      })
    );
  });
}
