import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {TaskFormComponent} from './components/task-form/task-form.component';
import { AuthGuard } from './guards/auth.guard';
import {AdminDashboardComponent} from './components/admin-dashboard/admin-dashboard.component';
import {AdminTaskListComponent} from './components/admin-task-list/admin-task-list.component';

const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task-form', component: TaskFormComponent, canActivate: [AuthGuard] },
  {path: 'admin-dashboard',component: AdminDashboardComponent,canActivate: [AuthGuard]},
  { path: 'admin-task-list', component: AdminTaskListComponent, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
