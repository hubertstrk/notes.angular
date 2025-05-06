import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { marked } from 'marked';
import { Note } from '../../model/note.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnChanges {
  @Input() note: Note | null = null;

  constructor(private store: Store) {}

  @ViewChild('preview') preview: ElementRef<HTMLElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note'] && this.note) {
      this.preview.nativeElement.innerHTML = marked.parse(
        this.note.markdown
      ) as string;
    }
  }
}
