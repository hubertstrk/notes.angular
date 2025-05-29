import { appDataDir } from '@tauri-apps/api/path';
import {
  exists,
  createDir,
  writeTextFile,
  BaseDirectory,
} from '@tauri-apps/api/fs';

import { SettingsFileName } from '@models/settings.model';

export async function initSettingsFactory() {
  // ensure app directory
  const appDataPath = await appDataDir();
  const appDataExists = await exists(appDataPath, {
    dir: BaseDirectory.AppData,
  });

  if (!appDataExists) {
    await createDir(appDataPath);
    console.info('app initialize: created app data directory');
  }

  // ensure user settings file
  const doSettingsExist = await exists(SettingsFileName, {
    dir: BaseDirectory.AppConfig,
  });
  if (!doSettingsExist) {
    await writeTextFile(
      {
        path: SettingsFileName,
        contents: JSON.stringify({ basePath: null, dark: true, id: null }),
      },
      { dir: BaseDirectory.AppConfig }
    );
    console.info('app initialize: created user settings');
  }
}
