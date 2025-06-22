import * as monaco from 'monaco-editor';

export const DefaultEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    theme: document.body.classList.contains('dark') ? 'vs-dark' : 'vs-light',
    language: 'markdown',
    mouseWheelZoom: true,
    wordWrap: 'on',
    automaticLayout: true,
    renderWhitespace: 'boundary',
    tabSize: 2,
    insertSpaces: true,
    wrappingIndent: 'same',
    smoothScrolling: true,
    lineDecorationsWidth: 0,
  };
