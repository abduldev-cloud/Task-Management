import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar: boolean = true;

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        // Hide navbar on login/register pages
        this.showNavbar = !['/login', '/register'].includes(url);

        // Check token validity when navigation ends
        this.checkTokenAndRedirect(url);
      }

      // Prevent forward navigation after logout (browser forward button)
      if (event instanceof NavigationStart) {
        const token = localStorage.getItem('token');
        if (!token && !['/login', '/register'].includes(event.url)) {
          this.router.navigate(['/login']);
        }
      }
    });

    // Handle manual browser navigation (Back/Forward)
    window.addEventListener('popstate', () => {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  private checkTokenAndRedirect(currentUrl: string) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < currentTime) {
          this.handleInvalidToken();
        }
      } catch {
        this.handleInvalidToken();
      }
    } else if (!['/login', '/register'].includes(currentUrl)) {
      this.router.navigate(['/login']);
    }
  }

  private handleInvalidToken() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
