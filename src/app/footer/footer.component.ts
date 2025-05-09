import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Note } from '../../model/note.model';
import { selectActiveNote } from '../../store/note.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent {
  activeNote$: Observable<Note | null>;

  constructor(private store: Store) {
    this.activeNote$ = this.store.select(selectActiveNote);
  }
}
