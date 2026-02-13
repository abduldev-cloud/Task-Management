import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private baseUrl = `${environment.apiUrl}`;
  private userRole: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login API
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // ✅ Register API
  register(data: { name: string, email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ✅ Get Profile
  getProfile() {
    const token = this.getToken();
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ✅ Token Management
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Role Extraction from JWT
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);

      return decoded.role || null;
    } catch (err) {
      console.error('[JWT Decode Error]', err);
      return null;
    }
  }

  // ✅ Role Helpers
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  // ✅ Auth Status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ Role Cache (Optional)
  setUserRole(role: string) {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  clearUserRole() {
    this.userRole = '';
    localStorage.removeItem('userRole');
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('token');
    this.clearUserRole();
    window.location.href = '/login';
  }

  uploadProfilePicture(formData: FormData) {
  return this.http.put<any>(`${this.apiUrl}/upload-profile-picture`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

}
