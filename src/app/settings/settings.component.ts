import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasePath } from '@store/settings/settings.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { open } from '@tauri-apps/api/dialog';
import { ButtonComponent } from '../shared/button/button.component';
import { SafeHtml } from '@angular/platform-browser';
import { Icon, IconService } from '@services/icon.service';
import { appWindow } from '@tauri-apps/api/window';
import { saveSettings } from '@store/settings/settings.actions';

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
    const selection = await open({ directory: true });
    if (selection) {
      this.store.dispatch(
        saveSettings({ settings: { basePath: selection as string } })
      );
    }
  }

  ngOnInit(): void {
    this.chevronLeft = this.icons.getIcon(Icon.ChevronLeft);
    this.minimizeIcon = this.icons.getIcon(Icon.Minimize);
    this.maximizeIcon = this.icons.getIcon(Icon.Maximize);
    this.closeIcon = this.icons.getIcon(Icon.Close);
  }

  minimizeWindow() {
    void appWindow.minimize();
  }

  maximizeWindow() {
    void appWindow.toggleMaximize();
  }

  closeWindow() {
    void appWindow.close();
  }
}
