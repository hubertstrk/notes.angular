import { appDataDir } from '@tauri-apps/api/path';
import {
  exists,
  create,
  writeTextFile,
  mkdir,
  BaseDirectory,
} from '@tauri-apps/plugin-fs';

import { SettingsFileName } from '@models/settings.model';

export async function initSettingsFactory() {
  // ensure app directory
  const appDataFolderExists = await exists('', {
    baseDir: BaseDirectory.AppData,
  });
  if (!appDataFolderExists) {
    await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
    console.info('AppData directory created');
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
        archived: [],
      }),
      { baseDir: BaseDirectory.AppConfig },
    );
    console.info('app initialize: created user settings');
  }
}
