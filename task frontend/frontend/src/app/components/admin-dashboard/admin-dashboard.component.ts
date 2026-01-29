import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  isAdmin = false;
  loading = true;
  currentTime: Date = new Date();
  private timer: any;

  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    assignedByAdmin: 0
  };

  // Chart Configuration
  pieChartType: ChartType = 'pie';

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [0, 0], // Will be updated in ngOnInit
        backgroundColor: ['#4CAF50', '#FFA726']
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };  
  getPercentage(count: number): number {
  const total = this.stats.total || 1;
  return Math.round((count / total) * 100);
}


  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  

  ngOnInit(): void {

    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // update every second

    
    this.authService.getProfile().subscribe(user => {
      this.user = user;
      this.isAdmin = user.role === 'admin';

      this.taskService.getTasks().subscribe((res: any) => {
        const tasks = res.tasks;

        this.stats.total = tasks.length;
        this.stats.completed = tasks.filter((t: any) => t.status === 'completed').length;
        this.stats.pending = tasks.filter((t: any) => t.status !== 'completed').length;

        // Only for admin
        if (this.isAdmin) {
          this.stats.assignedByAdmin = tasks.filter((t: any) => t.created_by === this.user.id).length;
        }

        // Update pie chart data dynamically
        this.pieChartData.datasets[0].data = [this.stats.completed, this.stats.pending];

        this.loading = false;
      });
    });
  }

  goToCreateTask() {
    this.router.navigate(['/task-form']);
  }

  logout() {
    this.authService.logout();
  }
}
