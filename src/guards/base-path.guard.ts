import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectBasePath } from '../store/settings.selectors';
import { switchMap, take } from 'rxjs/operators';
import { SettingsService } from '../service/settings.service';

export const basePathGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const settingsService = inject(SettingsService);

  return store.select(selectBasePath).pipe(
    take(1),
    switchMap(async basePath => {
      if (!basePath) {
        console.info('guard');
        void router.navigate(['/settings'], {
          queryParams: { reason: 'missing' },
        });
        return false;
      }
      const exists = await settingsService.directoryExists(basePath);
      if (exists) {
        return true;
      } else {
        void router.navigate(['/settings'], {
          queryParams: { reason: 'invalid' },
        });
        return false;
      }
    })
  );
};
