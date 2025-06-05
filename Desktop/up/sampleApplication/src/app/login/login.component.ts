import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CvpPrimaryButtonComponent } from '../shared/components/cvp-primary-button/cvp-primary-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CvpPrimaryButtonComponent],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" [(ngModel)]="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" required>
          </div>
          <cvp-primary-button
            label="Login"
            [isDisabled]="!username || !password"
            (buttonClick)="onSubmit()"
          ></cvp-primary-button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      margin-bottom: 1.5rem;
      text-align: center;
      color: #1a1f25;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
      }
    }

    button {
      width: 100%;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {
    // Clear any existing session data on login page load
    localStorage.clear();
    sessionStorage.clear();
  }

  onSubmit() {
    if (this.username && this.password) {
      // In a real app, you would validate credentials here
      // For demo purposes, we'll just set the logged in state and navigate
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/dashboard']);
    }
  }
} 