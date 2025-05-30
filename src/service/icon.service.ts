import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export enum Icon {
  ChevronLeft = 'chevronLeft',
  ChevronRight = 'chevronRight',
  Plus = 'plus',
  Settings = 'settings',
  ZoomIn = 'zoomIn',
  ZoomOut = 'zoomOut',
  Delete = 'delete',
  Print = 'print',
  Search = 'search',
  Cancel = 'cancel',
  Moon = 'moon',
  Sun = 'sun',
  Minimize = 'minimize',
  Maximize = 'maximize',
  Close = 'close',
  Reader = 'reader',
  loading = 'loading',
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly icons: { [key: string]: SafeHtml } = {};

  constructor(private sanitizer: DomSanitizer) {
    this.icons = {
      reader: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1H11.5V6H4.616q-.231 0-.424.192T4 6.616v10.769q0 .23.192.423t.423.192m7.885 0h6.885q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H12.5zm1.077-3.308h5.346v-.884h-5.346zm0-2.5h5.346v-.884h-5.346zm0-2.5h5.346v-.884h-5.346zM4 18V6z" />
</svg>`
      ),

      chevronLeft: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
	<path fill="currentColor" d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z" />
</svg>`),

      chevronRight: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
	<path fill="currentColor" d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z" />
</svg>`),

      plus: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="M11.5 12.5H6v-1h5.5V6h1v5.5H18v1h-5.5V18h-1z" />
</svg>`),

      settings: this
        .sanitize(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
	<path fill="currentColor" d="M16 11a5 5 0 1 0 0 10a5 5 0 0 0 0-10m-3 5a3 3 0 1 1 6 0a3 3 0 0 1-6 0m-.16 13.628c1.035.247 2.096.372 3.16.372a13.6 13.6 0 0 0 3.156-.375a1.48 1.48 0 0 0 1.13-1.276l.234-2.13a1.47 1.47 0 0 1 2.066-1.2l1.955.856a1.47 1.47 0 0 0 1.671-.345a14.25 14.25 0 0 0 3.156-5.443a1.48 1.48 0 0 0-.535-1.627l-1.729-1.275a1.48 1.48 0 0 1 .003-2.396l1.72-1.27a1.47 1.47 0 0 0 .537-1.63a14.2 14.2 0 0 0-3.157-5.443a1.48 1.48 0 0 0-1.674-.345l-1.946.856a1.483 1.483 0 0 1-2.067-1.2l-.236-2.12a1.48 1.48 0 0 0-1.147-1.283a15 15 0 0 0-3.127-.363a15.4 15.4 0 0 0-3.146.363a1.47 1.47 0 0 0-1.147 1.28l-.237 2.122a1.493 1.493 0 0 1-2.073 1.206l-1.946-.857a1.49 1.49 0 0 0-1.67.35a14.25 14.25 0 0 0-3.16 5.446a1.48 1.48 0 0 0 .536 1.625l1.725 1.272a1.488 1.488 0 0 1 0 2.397L3.167 18.47a1.48 1.48 0 0 0-.535 1.63a14.25 14.25 0 0 0 3.16 5.45a1.46 1.46 0 0 0 1.077.465c.203 0 .404-.042.591-.123l1.955-.859a1.485 1.485 0 0 1 2.065 1.2l.235 2.126a1.48 1.48 0 0 0 1.125 1.27m5.501-1.866a11.6 11.6 0 0 1-4.677 0l-.195-1.74a3.48 3.48 0 0 0-1.14-2.208a3.53 3.53 0 0 0-3.718-.6l-1.606.7a12.2 12.2 0 0 1-2.348-4.05l1.424-1.052a3.488 3.488 0 0 0 0-5.616l-1.421-1.05a12.2 12.2 0 0 1 2.348-4.046l1.6.7a3.45 3.45 0 0 0 1.4.294a3.5 3.5 0 0 0 3.467-3.108l.194-1.747c.774-.15 1.56-.23 2.347-.24c.782.01 1.562.09 2.33.24l.186 1.74a3.48 3.48 0 0 0 1.137 2.216a3.53 3.53 0 0 0 3.727.6l1.6-.7a12.2 12.2 0 0 1 2.35 4.047l-1.423 1.046a3.48 3.48 0 0 0 0 5.62l1.422 1.05A12.3 12.3 0 0 1 25 23.901l-1.6-.7a3.473 3.473 0 0 0-4.866 2.81z" />
</svg>`),

      zoomIn: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37m-.5-2.345V10H7.155V9H9.04V7.116h1V9h1.884v1H10.04v1.885z" />
</svg>`),

      zoomOut: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37M7.27 10V9h4.539v1z" />
</svg>`
      ),
      delete: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" />
</svg>`
      ),

      print: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M16 8.616v-3H8v3H7v-4h10v4zm-11.423 1h14.846zm13.038 2.5q.425 0 .713-.288t.287-.712t-.287-.713t-.713-.288t-.712.288t-.288.713t.288.712t.713.288M16 19v-4.538H8V19zm1 1H7v-4H3.577v-5.384q0-.85.577-1.425t1.423-.576h12.846q.85 0 1.425.576t.575 1.424V16H17zm2.423-5v-4.384q0-.425-.287-.713t-.713-.288H5.577q-.425 0-.712.288t-.288.713V15H7v-1.538h10V15z" />
</svg>`
      ),

      search: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37" />
</svg>`
      ),

      cancel: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" />
        </svg>`
      ),

      moon: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="M12.058 20q-3.334 0-5.667-2.333T4.058 12q0-3.039 1.98-5.27t4.904-2.634q.081 0 .159.006t.153.017q-.506.706-.801 1.57T10.158 7.5q0 2.667 1.866 4.533t4.534 1.867q.951 0 1.813-.295t1.548-.801q.012.075.017.153t.006.159q-.384 2.923-2.615 4.903T12.057 20m0-1q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.074 0-5.237-2.162T9.158 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5.058 12q0 2.9 2.05 4.95t4.95 2.05m-.25-6.75" />
</svg>`
      ),

      sun: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="M11.5 5.423V2.039h1v3.384zm5.496 2.289l-.682-.683l2.357-2.452l.727.733zm1.581 4.788v-1h3.385v1zM11.5 21.962v-3.366h1v3.366zM7.042 7.68L4.577 5.329l.752-.708L7.73 7.004zm11.624 11.742l-2.352-2.452l.677-.657l2.388 2.346zM2.039 12.5v-1h3.384v1zm3.27 6.923l-.688-.752l2.358-2.357l.36.348l.378.354zM12.006 17q-2.082 0-3.544-1.457T7 12.005T8.457 8.46T11.995 7t3.544 1.457T17 11.995t-1.457 3.544T12.005 17" />
</svg>`
      ),

      minimize: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="M6.5 20v-1h11v1z" />
</svg>`
      ),

      maximize: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
	<path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.269 0 .442-.173t.173-.442V5.615q0-.269-.173-.442T18.385 5H5.615q-.269 0-.442.173T5 5.616v12.769q0 .269.173.442t.443.173M5 19V5z" />
</svg>`
      ),

      close: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	<path fill="currentColor" d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z" />
</svg>`
      ),

      loading: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
            <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
              </path>
              <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
              </path>
              </g>
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
