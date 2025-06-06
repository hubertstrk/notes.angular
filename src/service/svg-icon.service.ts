import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map, shareReplay, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SvgIconService {
  private cache: Map<string, Observable<SafeHtml>> = new Map();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Load an SVG from the assets/icons folder and sanitize it.
   * Caches requests to avoid redundant HTTP calls.
   *
   * @param iconName name of the svg file without ".svg"
   * @returns SafeHtml Observable for use in [innerHTML]
   */
  getIcon(iconName: string): Observable<SafeHtml> {
    if (this.cache.has(iconName)) {
      return this.cache.get(iconName)!;
    }

    const path = `./assets/icons/${iconName}.svg`;
    const icon$ = this.http.get(path, { responseType: 'text' }).pipe(
      map(svg => this.sanitizer.bypassSecurityTrustHtml(svg)),
      shareReplay(1)
    );

    this.cache.set(iconName, icon$);
    return icon$;
  }

  /**
   * Load multiple SVG icons at once.
   * @param iconNames array of icon names (without .svg)
   * @returns Observable of an object mapping icon names to their sanitized SVGs
   */
  getIcons(iconNames: string[]): Observable<Record<string, SafeHtml>> {
    const observables: Record<string, Observable<SafeHtml>> = {};

    for (const name of iconNames) {
      observables[name] = this.getIcon(name);
    }

    return forkJoin(observables);
  }
}
