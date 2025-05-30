import { Injectable } from '@angular/core';
import {
  readDir,
  readTextFile,
  remove,
  writeTextFile,
  stat,
} from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { NO_TITLE, Note } from '@models/note.model';
import { LoadingService } from '@app/shared/loading-indicator/loading.service';

import { unified } from 'unified';
import remarkParse from 'remark-parse';

import type { Heading, Text } from 'mdast';
import { sortBy } from 'lodash';
import { ProgressLoadingService } from '@app/shared/progress-indicator/progress-loading.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(
    private loadingService: LoadingService,
    private progressLoadingService: ProgressLoadingService
  ) {}

  private async readFilePathsRecursive(directory: string): Promise<string[]> {
    const notePaths: string[] = [];

    async function walk(currentDir: string): Promise<void> {
      const entries = await readDir(currentDir);

      for (const entry of entries) {
        if (entry.name && entry.name.endsWith('.md')) {
          notePaths.push(await join(currentDir, entry.name));
        } else if (entry.isDirectory) {
          await walk(await join(currentDir, entry.name));
        }
      }
    }

    await walk(directory);

    return notePaths;
  }

  private async readFiles(paths: string[]): Promise<Note[]> {
    const results: Note[] = [];

    for (let index = 0; index < paths.length; index++) {
      try {
        const content = await readTextFile(paths[index]);
        const info = await stat(paths[index]);

        const heading = this.extractHeading(content);

        results.push({
          content,
          path: paths[index],
          heading,
          createdAt: info.birthtime,
          updatedAt: info.mtime,
          size: info.size,
        });
        const percentage = ((index + 1) / paths.length) * 100;

        console.info(percentage);
        this.progressLoadingService.updateProgress(
          percentage,
          'Loading notes...'
        );
      } catch (error) {
        console.error(`Failed to read ${paths[index]}:`, error);
      }
    }

    return sortBy(results, 'heading');
  }

  async importFiles(directory: string): Promise<Note[]> {
    try {
      this.progressLoadingService.show('Loading notes...');
      const paths = await this.readFilePathsRecursive(directory);
      return await this.readFiles(paths);
    } finally {
      this.progressLoadingService.hide();
    }
  }

  async saveFile(path: string, content: string): Promise<void> {
    this.loadingService.show();
    try {
      return await writeTextFile(path, content);
    } catch (error) {
      console.error(`Failed to save ${path}:`, error);
      return Promise.reject(error);
    } finally {
      this.loadingService.hide();
    }
  }

  extractHeading(content: string): string {
    const tree = unified().use(remarkParse).parse(content);
    const headings = tree.children.filter(x => x.type === 'heading');

    if (headings.length === 0) {
      return NO_TITLE;
    }

    const text = (headings[0] as Heading).children.filter(
      x => x.type === 'text'
    );

    if (text.length === 0) {
      return NO_TITLE;
    }

    return (text[0] as Text).value;
  }

  async deleteFile(path: string): Promise<void> {
    this.loadingService.show();
    try {
      await remove(path);
    } finally {
      this.loadingService.hide();
    }
  }
}
