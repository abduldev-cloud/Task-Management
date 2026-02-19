import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminTaskListComponent } from './components/admin-task-list/admin-task-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgChartsModule } from 'ng2-charts';
import {
  LucideAngularModule,
  Bell,
  User,
  LayoutDashboard,
  ListTodo,
  Moon,
  Sun,
  LogOut,
  Upload,
  X,
  ChevronDown,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Edit,
  ArrowLeft,
  Calendar,
  Paperclip,
  BarChart3,
  Users,
  ClipboardList,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    TaskFormComponent,
    DashboardComponent,
    NavbarComponent,
    AdminDashboardComponent,
    AdminTaskListComponent,
    SidebarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    LucideAngularModule.pick({
      Bell,
      User,
      LayoutDashboard,
      ListTodo,
      Moon,
      Sun,
      LogOut,
      Upload,
      X,
      ChevronDown,
      Search,
      CheckCircle,
      Clock,
      AlertCircle,
      Plus,
      Filter,
      Edit,
      ArrowLeft,
      Calendar,
      Paperclip,
      BarChart3,
      Users,
      ClipboardList,
      FileText,
      TrendingUp,
      Activity
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
