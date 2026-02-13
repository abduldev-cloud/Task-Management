import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;
  // dashboardLink = '/dashboard'; // default
  userRole = ''; // helpful for debug or conditional display

  constructor(private authService: AuthService) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode');
  }

  dashboardLink = '';

ngOnInit(): void {
  this.authService.getProfile().subscribe({
    next: (user: any) => {
      console.log('User Info:', user);
      this.dashboardLink = user.role === 'admin' ? '/admin-dashboard' : '/dashboard';
    },
    error: () => {
      this.dashboardLink = '/dashboard';
    }
  });
}

}
