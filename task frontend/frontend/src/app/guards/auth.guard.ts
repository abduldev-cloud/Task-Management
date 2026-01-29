import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Token expired → clear and redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }

      return true; // token valid
    } catch (err) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
