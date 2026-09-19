import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => this.checkIsAdmin(event.urlAfterRedirects || event.url))
    ),
    {
      initialValue: typeof window !== 'undefined' ? this.checkIsAdmin(window.location.pathname) : false
    }
  );

  private checkIsAdmin(url: string): boolean {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].split('#')[0];
    return (
      cleanUrl.startsWith('/admin') ||
      cleanUrl.startsWith('/openadmin') ||
      cleanUrl.startsWith('/.openadmin')
    );
  }

  private keyBuffer: string = '';
  private bufferTimer: any = null;

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

    if (event.key && event.key.length === 1) {
      if (this.bufferTimer) clearTimeout(this.bufferTimer);
      this.keyBuffer += event.key.toLowerCase();
      if (this.keyBuffer.length > 25) {
        this.keyBuffer = this.keyBuffer.slice(-25);
      }

      if (this.keyBuffer.endsWith('.openadmin') || this.keyBuffer.endsWith('openadmin')) {
        this.keyBuffer = '';
        this.router.navigate(['/admin/dashboard']);
      }

      this.bufferTimer = setTimeout(() => {
        this.keyBuffer = '';
      }, 3000);
    }
  }

  protected readonly title = signal('portfolio-app');

  isHobbies(): boolean {
    return this.router.url.includes('hobbies');
  }
}
