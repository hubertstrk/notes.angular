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
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SettingsService } from '@services/settings.service';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSettingsState } from './settings.selectors';
import { Settings } from '@models/settings.model';

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
        // Merge the partial settings with the current state
        const mergedSettings = {
          basePath: state.basePath,
          dark: state.dark,
          id: state.id,
          ...action.settings,
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
