import { Injectable } from '@angular/core';
import { Settings } from '@models/settings.model';
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

import { SettingsFileName } from '@models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  async readSettings(): Promise<Settings> {
    const settings = await readTextFile(SettingsFileName, {
      dir: BaseDirectory.AppData,
    });
    return JSON.parse(settings);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await writeTextFile(SettingsFileName, JSON.stringify(settings), {
      dir: BaseDirectory.AppData,
    });
  }
}
