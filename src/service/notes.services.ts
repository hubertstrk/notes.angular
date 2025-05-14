import { Injectable } from '@angular/core';
import { readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { Note } from '../model/note.model';

import { unified } from 'unified';
import remarkParse from 'remark-parse';

import type { Heading, Text } from 'mdast';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private async readFilePathsRecursive(directory: string): Promise<string[]> {
    const notePaths: string[] = [];

    async function walk(currentDir: string): Promise<void> {
      const entries = await readDir(currentDir, { recursive: false });

      for (const entry of entries) {
        if (entry.children && entry.name) {
          await walk(await join(currentDir, entry.name));
        } else if (entry.name && entry.name.endsWith('.md')) {
          notePaths.push(await join(currentDir, entry.name));
        }
      }
    }

    await walk(directory);

    return notePaths;
  }

  private async readFiles(paths: string[]): Promise<Note[]> {
    const results: Note[] = [];

    for (const path of paths) {
      try {
        const content = await readTextFile(path);
        const heading = this.extractHeading(content);

        results.push({ content, path, heading });
      } catch (error) {
        console.error(`Failed to read ${path}:`, error);
      }
    }

    return results;
  }

  async importFiles(directory: string): Promise<Note[]> {
    const paths = await this.readFilePathsRecursive(directory);
    const notes = await this.readFiles(paths);

    return notes;
  }

  async saveFile(path: string, content: string): Promise<void> {
    return writeTextFile(path, content);
  }

  async createFile(heading: string, basePath: string): Promise<void> {
    const filePath = await join(basePath, `${heading}.md`);
    const content = `# ${heading}`;

    await writeTextFile(filePath, content);
  }

  extractHeading(content: string): string {
    const tree = unified().use(remarkParse).parse(content);
    const headings = tree.children.filter(x => x.type === 'heading');

    if (headings.length === 0) {
      return 'No Title';
    }

    const text = (headings[0] as Heading).children.filter(
      x => x.type === 'text'
    );

    if (text.length === 0) {
      return 'No Title';
    }

    const title = (text[0] as Text).value;

    return title;
  }
}
