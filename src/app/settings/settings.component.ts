import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { open } from '@tauri-apps/plugin-dialog';

import { ButtonComponent } from '../shared/button/button.component';
import { WindowControlsComponent } from '../shared/window-controls/window-controls.component';

import { selectBasePath } from '@store/settings/settings.selectors';
import { saveSettings } from '@store/settings/settings.actions';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ButtonComponent, WindowControlsComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  basePath$: Observable<string | null | undefined> =
    this.store.select(selectBasePath);
  reason$: Observable<string | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.reason$ = this.route.queryParamMap.pipe(
      map(params => params.get('reason'))
    );
  }

  async selectFolder() {
    const selection = await open({ directory: true });
    if (selection) {
      this.store.dispatch(
        saveSettings({ settings: { basePath: selection as string } })
      );
    }
  }
}
