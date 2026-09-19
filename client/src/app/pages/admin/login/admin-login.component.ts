import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  // Demo credentials
  private readonly ADMIN_EMAIL = 'admin@portfolio.com';
  private readonly ADMIN_PASSWORD = 'admin123';

  async login() {
    this.loading.set(true);
    this.error.set('');

    const emailVal = this.email().trim();
    const passVal = this.password().trim();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passVal })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin-auth', 'true');
        if (data.token) {
          localStorage.setItem('admin-token', data.token);
        }
        this.router.navigate(['/admin/dashboard']);
        return;
      }
    } catch {
      // Backend offline fallback
    }

    // Direct fallback for convenience
    if (emailVal === this.ADMIN_EMAIL && passVal === this.ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error.set('Invalid email or password.');
    }
    this.loading.set(false);
  }
}
