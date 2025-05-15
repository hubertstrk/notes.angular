import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasePath } from '../../store/settings.selectors';
import { setBasePath } from '../../store/settings.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { open } from '@tauri-apps/api/dialog';
import { ButtonComponent } from '../shared/button/button.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  basePath$: Observable<string | null | undefined> =
    this.store.select(selectBasePath);
  reason$: Observable<string | null>;
  message: string = '';

  chevronLeft: SafeHtml | undefined;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.reason$ = this.route.queryParamMap.pipe(
      map(params => params.get('reason'))
    );
  }

  async selectFolder() {
    try {
      const selected = await open({ directory: true });
      if (selected) {
        this.store.dispatch(setBasePath({ basePath: selected as string }));
        this.message = 'Base path updated!';
      }
    } catch (e) {
      this.message = 'Failed to select folder.';
    }
  }

  ngOnInit(): void {
    this.chevronLeft = this.sanitizer
      .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	<path fill="currentColor" d="M10.354 3.146a.5.5 0 0 1 0 .708L6.207 8l4.147 4.146a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0" />
</svg>`);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
