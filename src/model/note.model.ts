import { Root } from 'mdast';

export interface Note {
  content: string;
  path: string;
  tree: Root;
}
