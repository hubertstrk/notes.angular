import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { SvgIconService } from '@services/svg-icon.service';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { ButtonComponent } from '../button/button.component';

const appWindow = getCurrentWebviewWindow();

@Component({
  selector: 'app-window-controls',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './window-controls.component.html',
  styleUrls: ['./window-controls.component.scss']
})
export class WindowControlsComponent implements OnInit {
  icons: { [key: string]: SafeHtml } = {};

  constructor(private iconService: SvgIconService) {}

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
