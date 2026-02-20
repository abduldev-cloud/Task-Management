import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: any = {
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
    attachment: '',
    assigned_to: null
  };

  isAttachmentUploaded = false;
  users: any[] = [];
  isEditMode = false;
  isAdmin: boolean = false;
  user: any;

  attachmentFile: File | null = null;
  savedAttachment: string | null = null;  //  Store saved attachment

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachmentFile = input.files[0];
    }
  }

  ngOnInit(): void {
    const existingTask = history.state.task;

    if (existingTask) {
      this.task = { ...existingTask };
      this.isEditMode = true;
      //  Store previously saved attachment
      this.savedAttachment = existingTask.attachment;
    }
    else {
      this.isEditMode = false;
    }

    this.authService.getProfile().subscribe(user => {
      this.isAdmin = user.role === 'admin';
    });

    this.userService.getAllUsers().subscribe((res: any) => {
      this.users = res.users;
    });
  }


  onSubmit() {
    const formdata = new FormData();
    formdata.append('title', this.task.title);
    formdata.append('description', this.task.description);
    formdata.append('assigned_to', this.task.assigned_to);
    formdata.append('status', this.task.status);
    formdata.append('due_date', this.task.due_date);

    if (this.attachmentFile) {
      formdata.append('attachment', this.attachmentFile);
    }


    if (this.isEditMode) {
      this.taskService.updateTask(this.task.id, formdata).subscribe({
        next: () => {
          this.isAttachmentUploaded = true;
          alert('Task Updated Successfully');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Update Error:', err);
          alert('Failed to update task: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {

      this.taskService.createTask(formdata).subscribe({
        next: () => {
          alert('Task created successfully!');
          this.router.navigate(['/tasks']);  // ✅ Navigate after creating
        },
        error: (err) => {
          console.error('Create Error:', err);
          alert('Failed to create task: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    }
  }
}