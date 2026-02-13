import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  isAdmin: boolean = false;
  users: any[] = [];          // All users with their tasks
  selectedUser: any = null;   // Currently selected user
  user: any; 
  usersWithTasks: any[] = []; // grouped view for admin
  selectedStatus: string = 'all';
  filteredTasks:any[] = [];


  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.isAdmin = user.role === 'admin';

        if (this.isAdmin) {
          this.loadAllTasksGrouped(); // admin view
        } else {
          this.loadUserTasks(); // user view
        }
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
      }
    });
  }

  /** For admin: load all tasks and group by assigned user */
  loadAllTasksGrouped() {
    this.taskService.getTasks().subscribe({
      next: (res: any) => {
        const tasks = res.tasks || [];

        // group by assigned_to_name
        const grouped = tasks.reduce((acc: any, task: any) => {
          const key = task.assigned_to_name || 'Unassigned';
          if (!acc[key]) {
            acc[key] = {
              user_name: task.assigned_to_name || 'Unassigned',
              email: task.assigned_to_email || '',
              tasks: []
            };
          }
          acc[key].tasks.push(task);
          return acc;
        }, {});

        this.usersWithTasks = Object.values(grouped);
      },
      error: (err) => {
        console.error('Error loading all tasks:', err);
      }
    });
  }

  /** For normal user */
  loadUserTasks() {
    this.taskService.getTasks().subscribe({
      next: (res: any) => {
        this.tasks = res.tasks || [];
        this.filteredTasks  = [...this.tasks];
      },
      error: (err) => {
        console.error('Error loading user tasks:', err);
      }
    });
  }

  applyStatusFilter() {
  if (this.selectedStatus === 'all') {
    this.filteredTasks = [...this.tasks];
  } else {
    this.filteredTasks = this.tasks.filter(
      task => task.status === this.selectedStatus
    );
  }
}

  editTask(task: any) {
    this.router.navigate(['/task-form'], { state: { task } });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in_progress';
      case 'completed': return 'status-completed';
      case 'approved': return 'status-approved';
      default: return '';
    }
  }
  selectUser(user: any): void {
  this.selectedUser = user;
}
}
