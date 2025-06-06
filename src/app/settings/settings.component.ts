import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasePath } from '@store/settings/settings.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { open } from '@tauri-apps/plugin-dialog';
import { ButtonComponent } from '../shared/button/button.component';
import { SafeHtml } from '@angular/platform-browser';
import { SvgIconService } from '@services/svg-icon.service';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { saveSettings } from '@store/settings/settings.actions';

const appWindow = getCurrentWebviewWindow();

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

  icons: { [key: string]: SafeHtml } = {};

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private iconService: SvgIconService
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
    this.iconService
      .getIcons([
        'material-symbols-light--minimize-rounded',
        'material-symbols-light--square-outline-rounded',
        'material-symbols-light--close-rounded',
      ])
      .subscribe(icons => {
        this.icons = icons;
      });
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
