import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectNotes } from '../../store/note.selectors';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  constructor(private store: Store) {}

  notes$ = this.store.select(selectNotes);

  ngOnInit(): void {
    this.notes$.subscribe(notes => {
      console.log('Notes:', notes);
    });
  }
}
