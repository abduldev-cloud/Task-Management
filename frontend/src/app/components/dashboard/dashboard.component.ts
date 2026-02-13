import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  
  user: any = null;
  isAdmin = false;
  
  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    assignedByAdmin: 0
  };
  currentTime: Date = new Date();
  private timer: any;
  
  

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  loading = true;

  ngOnInit(): void {

     this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // update every second
  

    this.authService.getProfile().subscribe(user => {
    this.user = user;
    this.isAdmin = user.role === 'admin';

    // ✅ Only fetch tasks after we have user info
    this.taskService.getTasks().subscribe((res: any) => {
      const tasks = res.tasks;

      this.stats.total = tasks.length;
      this.stats.completed = tasks.filter((t: any) => t.status === 'completed').length;
      this.stats.pending = tasks.filter((t: any) => t.status !== 'completed').length;

      // ✅ Only for admins
      if (this.isAdmin) {
        this.stats.assignedByAdmin = tasks.filter((t: any) => t.created_by === this.user.id).length;
      }

      this.loading = false;
    });
  });
}


 ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  

  logout() {
    this.authService.logout();
  }
}
