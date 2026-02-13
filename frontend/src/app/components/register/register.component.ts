import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.errorMessage = 'Please enter a valid email address';
    return;
  }

    const payload = { name: this.name, email: this.email, password: this.password };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
    
  }
}
