import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  

  constructor(private authService: AuthService, private router: Router) {}

  login() {
      if (!this.email || !this.password) {
        this.errorMessage = 'Email and password are required.';
        return;
      }
      const formData = {
      email: this.email,
      password: this.password
    };

      this.authService.login(formData).subscribe((res: any) => {
      this.authService.saveToken(res.token);

      const role = this.authService.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 
    err => {
      this.errorMessage = err.error.message || 'Login failed';
    });

    }
}
