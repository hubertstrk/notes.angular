import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  summarizeNote(notesText: string): Observable<string> {
    return from(invoke<string>('llm_summarize', { text: notesText }));
  }
}