import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-admin-task-list',
  templateUrl: './admin-task-list.component.html',
  styleUrls: ['./admin-task-list.component.css']
})
export class AdminTaskListComponent implements OnInit {
  usersWithTasks: any[] = [];
  selectedUser: any = null;
  filteredTasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getUsersWithTasks();
  }

  getUsersWithTasks() {
    this.taskService.getUsersWithTasks().subscribe({
      next: (res) => {
        this.usersWithTasks = res.map((user: any) => {
          const totalTasks = user.tasks?.length || 0;
          const completedTasks = user.tasks?.filter((task: any) => task.status === 'completed').length || 0;
          const pendingTasks = user.tasks?.filter((task: any) => task.status === 'pending').length || 0;

          return {
            ...user,
            totalTasks,
            completedTasks,
            pendingTasks
          };
        });
      },
      error: (err) => {
        console.error('Failed to load users with tasks', err);
      }
    });
  }

  viewTasksForUser(user: any): void {
    this.selectedUser = user;
    this.filteredTasks = user.tasks || [];
  }

  backToUserList(): void {
    this.selectedUser = null;
    this.filteredTasks = [];
  }
}
