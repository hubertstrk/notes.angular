import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  setBasePath,
  loadSettings,
  loadSettingsSuccess,
  loadSettingsFailure,
} from './settings.actions';
import { switchMap, tap } from 'rxjs/operators';
import { SettingsService } from '../../service/settings.service';

@Injectable()
export class SettingsEffects {
  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSettings),
      switchMap(async () => {
        try {
          const settings = await this.settingsService.readSettings();
          return loadSettingsSuccess({ basePath: settings.basePath || '' });
        } catch (error) {
          return loadSettingsFailure({ error: String(error) });
        }
      })
    );
  });

  setBasePath$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(setBasePath),
        tap(async ({ basePath }) => {
          await this.settingsService.saveSettings({ basePath });
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private settingsService: SettingsService
  ) {}
}
