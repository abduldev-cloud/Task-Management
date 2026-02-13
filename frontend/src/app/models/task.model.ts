// src/app/models/task.model.ts

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  assigned_to: number;
  assigned_to_name?: string; // Optional if you're adding name in the backend response
}
