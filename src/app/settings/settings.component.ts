import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasePath } from '@store/settings/settings.selectors';
import { setBasePath } from '@store/settings/settings.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { open } from '@tauri-apps/api/dialog';
import { ButtonComponent } from '../shared/button/button.component';
import { SafeHtml } from '@angular/platform-browser';
import { Icon, IconService } from '@services/icon.service';
import { appWindow } from '@tauri-apps/api/window';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  basePath$: Observable<string | null | undefined> =
    this.store.select(selectBasePath);
  reason$: Observable<string | null>;
  message: string = '';

  chevronLeft: SafeHtml;
  minimizeIcon: SafeHtml;
  maximizeIcon: SafeHtml;
  closeIcon: SafeHtml;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private icons: IconService
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

  ngOnInit(): void {
    this.chevronLeft = this.icons.getIcon(Icon.ChevronLeft);
    this.minimizeIcon = this.icons.getIcon(Icon.Minimize);
    this.maximizeIcon = this.icons.getIcon(Icon.Maximize);
    this.closeIcon = this.icons.getIcon(Icon.Close);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  minimizeWindow() {
    appWindow.minimize();
  }

  maximizeWindow() {
    appWindow.toggleMaximize();
  }

  closeWindow() {
    appWindow.close();
  }
}
