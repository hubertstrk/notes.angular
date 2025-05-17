import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export enum Icon {
  ChevronLeft = 'chevronLeft',
  ChevronRight = 'chevronRight',
  Plus = 'plus',
  Settings = 'settings',
  ZoomInIcon = 'zoomInIcon',
  ZoomOutIcon = 'zoomOutIcon',
  DeleteNoteIcon = 'deleteNoteIcon',
  Print = 'print',
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly icons: { [key: string]: SafeHtml } = {};

  constructor(private sanitizer: DomSanitizer) {
    this.icons = {
      chevronLeft: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	        <path fill="currentColor" d="M10.354 3.146a.5.5 0 0 1 0 .708L6.207 8l4.147 4.146a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0" />
          </svg>`),

      chevronRight: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
          <path fill="currentColor" d="M5.646 3.146a.5.5 0 0 0 0 .708L9.793 8l-4.147 4.146a.5.5 0 0 0 .708.708l4.5-4.5a.5.5 0 0 0 0-.708l-4.5-4.5a.5.5 0 0 0-.708 0" />
          </svg>`),

      plus: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12">
	        <path fill="currentColor" d="M6 2a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 6 2" />
          </svg>`),

      settings: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	       <path fill="currentColor" d="M8 6a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0m3.618-3.602a.71.71 0 0 1-.824-.567l-.26-1.416a.35.35 0 0 0-.275-.282a6.1 6.1 0 0 0-2.519 0a.35.35 0 0 0-.275.282l-.259 1.416a.71.71 0 0 1-.936.538l-1.359-.484a.36.36 0 0 0-.382.095a6 6 0 0 0-1.262 2.173a.35.35 0 0 0 .108.378l1.102.931q.045.037.081.081a.704.704 0 0 1-.081.995l-1.102.931a.35.35 0 0 0-.108.378A6 6 0 0 0 3.53 12.02a.36.36 0 0 0 .382.095l1.36-.484a.708.708 0 0 1 .936.538l.258 1.416c.026.14.135.252.275.281a6.1 6.1 0 0 0 2.52 0a.35.35 0 0 0 .274-.281l.26-1.416a.71.71 0 0 1 .936-.538l1.359.484c.135.048.286.01.382-.095a6 6 0 0 0 1.262-2.173a.35.35 0 0 0-.108-.378l-1.102-.931a.703.703 0 0 1 0-1.076l1.102-.931a.35.35 0 0 0 .108-.378A6 6 0 0 0 12.47 3.98a.36.36 0 0 0-.382-.095l-1.36.484a1 1 0 0 1-.111.03m-6.62.58l.937.333a1.71 1.71 0 0 0 2.255-1.3l.177-.97a5 5 0 0 1 1.265 0l.178.97a1.708 1.708 0 0 0 2.255 1.3L12 4.977q.384.503.63 1.084l-.754.637a1.704 1.704 0 0 0 0 2.604l.755.637a5 5 0 0 1-.63 1.084l-.937-.334a1.71 1.71 0 0 0-2.255 1.3l-.178.97a5 5 0 0 1-1.265 0l-.177-.97a1.708 1.708 0 0 0-2.255-1.3L4 11.023a5 5 0 0 1-.63-1.084l.754-.638a1.704 1.704 0 0 0 0-2.603l-.755-.637q.248-.581.63-1.084" />
        </svg>`),

      zoomInIcon: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" d="M7 4.5a.5.5 0 0 0-1 0V6H4.5a.5.5 0 0 0 0 1H6v1.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H7zM6.5 11a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
                </svg>`),

      zoomOutIcon: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
          <path fill="currentColor" d="M4.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 5a4.48 4.48 0 0 0 2.809-.984l3.837 3.838a.5.5 0 0 0 .708-.708L10.016 9.31A4.5 4.5 0 1 0 6.5 11m0-8a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7" />
        </svg>`
      ),
      deleteNoteIcon: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z" />
        </svg>`
      ),

      print: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20">
	        <path fill="currentColor" d="M5 4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V5h.5A2.5 2.5 0 0 1 18 7.5v5a1.5 1.5 0 0 1-1.5 1.5H15v1.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 15.5V14H3.5A1.5 1.5 0 0 1 2 12.5v-5A2.5 2.5 0 0 1 4.5 5H5zM6 5h8v-.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm-1 8v-1.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V13h1.5a.5.5 0 0 0 .5-.5v-5A1.5 1.5 0 0 0 15.5 6h-11A1.5 1.5 0 0 0 3 7.5v5a.5.5 0 0 0 .5.5zm1.5-2a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z" />
        </svg>`
      ),
    };
  }

  private sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getIcon(name: string): SafeHtml {
    return this.icons[name];
  }
}
