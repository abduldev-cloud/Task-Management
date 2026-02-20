// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';  // ensure this file exists and has Task interface

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }



  // ✅ Used in admin task list view to show all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, this.getAuthHeaders());
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // createTask(task: any): Observable<Task> {
  //   return this.http.post<Task>(this.apiUrl, task, this.getAuthHeaders());
  // }

  createTask(taskData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, taskData, this.getAuthHeaders());
  }

  // updateTask(id: number, taskData: any): Observable<Task> {
  //   return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData, this.getAuthHeaders());
  // }

  updateTask(id: number, taskData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, taskData, this.getAuthHeaders());
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getUsersWithTasks() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users-with-tasks`);
  }

  getRecentActivities() {
    return this.http.get<any>('/api/admin/recent-activities');
  }




}
