import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasePath } from '../../store/settings.selectors';
import { setBasePath } from '../../store/settings.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { open } from '@tauri-apps/api/dialog';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  basePath$: Observable<string | null | undefined> =
    this.store.select(selectBasePath);
  reason$: Observable<string | null>;
  message: string = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.reason$ = this.route.queryParamMap.pipe(
      map(params => params.get('reason'))
    );
  }

  async selectFolder() {
    try {
      const selected = await open({ directory: true });
      if (selected) {
        this.store.dispatch(setBasePath({ basePath: selected as string }));
        this.message = 'Base path updated!';
      }
    } catch (e) {
      this.message = 'Failed to select folder.';
    }
  }
}
