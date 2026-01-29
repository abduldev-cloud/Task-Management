// import { Component, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/services/auth.service';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';


// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
//   user: any = {} ;
//   showDropdown = false;
//   selectedFile: File | null = null;
//   notifications = [
//   { message: 'New task assigned', time: '2m ago' },
//   { message: 'Task approved', time: '1h ago' },
//   ];
//   showNotifications = false;
//   unreadCount = 0;


//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private http:HttpClient
//   ) {}

//   onFileSelected(event: any) {
//   this.selectedFile = event.target.files[0];
// }

// uploadProfilePic() {
//   const formData = new FormData();
//   formData.append('profile_picture', this.selectedFile!);

//   // this.http.post(`/api/users/${this.user.id}/profile-picture`, formData)
//   this.http.post(`http://localhost:3000/api/users/${this.user.id}/profile-picture`, formData)
//     .subscribe((res: any) => {
//       this.user.profile_picture = res.profile_picture;
//     });
// }

//   ngOnInit(): void {

//     this.authService.getProfile().subscribe(user => {
//       this.user = user;
//     });

//     this.loadNotifications();
//   }
  
// loadNotifications() {
//     this.http.get<any[]>('http://localhost:3000/api/notifications')
//       .subscribe((data) => {
//         this.notifications = data;
//         this.unreadCount = data.filter(n => !n.is_read).length;
//       });
//   }

//   toggleNotifications() {
//     this.showNotifications = !this.showNotifications;
//   }

//   markAllRead() {
//     this.http.post('http://localhost:3000/api/notifications/mark-read', {})
//       .subscribe(() => {
//         this.notifications.forEach(n => n.is_read = true);
//         this.unreadCount = 0;
//       });
//   }

//   toggleDropdown() {
//     this.showDropdown = !this.showDropdown;
//   }

// //   onFileSelected(event: any) {
// //   const file = event.target.files[0];
// //   if (file) {
// //     const formData = new FormData();
// //     formData.append('profilePicture', file);

// //     this.authService.uploadProfilePicture(formData).subscribe(
// //       (res: any) => {
// //         this.user.profilePicture = res.filename; // update user picture
// //       },
// //       (err) => {
// //         console.error('Upload failed:', err);
// //       }
// //     );
// //   }
// // }


//   logout() {
//   localStorage.removeItem('token');
//   this.router.navigate(['/login']);

//   // prevent back navigation to dashboard
//   window.history.pushState(null, '', window.location.href);
//   window.onpopstate = function () {
//     window.history.go(1);
//   };
// }

// }

import { Component, OnInit,HostListener,ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Notification {
  id?: number;
  message: string;
  time: string;
  is_read: boolean;
  created_at?: string;

}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = {};
  showDropdown = false;
  selectedFile: File | null = null;

  // Notifications
  notifications: Notification[] = [];
  showNotifications = false;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Load logged-in user
    this.authService.getProfile().subscribe((user) => {
      this.user = user;
    });

    // Load notifications initially
    this.loadNotifications();
  }

  // =================== PROFILE PICTURE UPLOAD ===================
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePic() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('profile_picture', this.selectedFile!);

    this.http
      .post(`http://localhost:3000/api/users/${this.user.id}/profile-picture`, formData)
      .subscribe((res: any) => {
        this.user.profile_picture = res.profile_picture;
        this.selectedFile = null;
        alert('Profile picture updated successfully!');
      });
  }

  // =================== NOTIFICATIONS ===================
  loadNotifications() {
    this.http.get<any[]>('http://localhost:3000/api/notifications')
      .subscribe((data) => {
        this.notifications = data.map(n => ({
          ...n,
          is_read: n.is_read ?? false
        }));
        this.unreadCount = this.notifications.filter(n => !n.is_read).length;
      });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showDropdown = false; // close profile dropdown if open
    }
  }

  markAllRead() {
    this.http.post('http://localhost:3000/api/notifications/mark-read', {})
      .subscribe(() => {
        this.notifications.forEach(n => n.is_read = true);
        this.unreadCount = 0;
      });
  }

  @HostListener('document:click', ['$event'])
handleOutsideClick(event: Event) {
  if (!this.eRef.nativeElement.contains(event.target)) {
    this.showNotifications = false;
  }
}

  // =================== PROFILE DROPDOWN ===================
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.showNotifications = false; // close notifications if open
    }
  }

  // =================== LOGOUT ===================
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

    // Prevent navigating back after logout
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }
}

