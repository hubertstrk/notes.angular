import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotesService } from '../service/notes.services';
import { Store } from '@ngrx/store';
import { loadNotes } from '../store/note.actions';
import { selectNotes } from '../store/note.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [NotesService, Store],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  notes$ = this.store.select(selectNotes);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadNotes({ directory: 'C:\\Users\\nz3k4\\Downloads\\notes' })
    );

    this.notes$.subscribe(notes => {
      console.log('Notes:', notes);
    });
  }
}
