import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  tasks = [
    { id: 1, title: 'Learn Angular', status: 'pending' },
    { id: 2, title: 'Build Task App', status: 'done' },
    { id: 3, title: 'Connect to Backend', status: 'in progress' }
  ];
}
