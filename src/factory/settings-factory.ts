import { appDataDir } from '@tauri-apps/api/path';
import {
  exists,
  create,
  writeTextFile,
  BaseDirectory,
} from '@tauri-apps/plugin-fs';

import { SettingsFileName } from '@models/settings.model';

export async function initSettingsFactory() {
  // ensure app directory
  const appDataPath = await appDataDir();
  const appDataExists = await exists(appDataPath, {
    baseDir: BaseDirectory.AppData,
  });

  if (!appDataExists) {
    await create(appDataPath);
    console.info('app initialize: created app data directory');
  }

  // ensure user settings file
  const doSettingsExist = await exists(SettingsFileName, {
    baseDir: BaseDirectory.AppData,
  });
  if (!doSettingsExist) {
    await writeTextFile(
      SettingsFileName,
      JSON.stringify({
        basePath: null,
        dark: true,
        id: null,
      }),
      { baseDir: BaseDirectory.AppConfig }
    );
    console.info('app initialize: created user settings');
  }
}
