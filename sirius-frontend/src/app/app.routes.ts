import { Routes } from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {LoginView} from './views/login-view/login-view';
import {TeacherView} from './views/teacher-view/teacher-view';
import {StudentView} from './views/student-view/student-view';
import {rootRedirectGuard} from './guards/root-redirect-guard';
import {loginGuard} from './guards/login-guard';
import {EmptyView} from './views/empty-view/empty-view';
import {LessonsComponent as StudentLessonsComponent} from './views/student-view/lessons-component/lessons-component';
import {TeachersComponent as StudentTeachersComponent} from './views/student-view/teachers-component/teachers-component';
import {AdminView} from './views/admin-view/admin-view';
import {LessonsComponent} from './views/admin-view/lessons-component/lessons-component';
import {TeachersComponent} from './views/admin-view/teachers-component/teachers-component';
import {StudentsComponent} from './views/admin-view/students-component/students-component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    children: []
  },
  {
    path: 'admin',
    component: AdminView,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        component: LessonsComponent,
      },
      {
        path: 'teachers',
        component: TeachersComponent,
      },
      {
        path: 'students',
        component: StudentsComponent,
      },
    ]
  },
  {
    path: 'teacher',
    component: TeacherView,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        component: EmptyView,
      },
      {
        path: 'students',
        component: EmptyView,
      },
    ]
  },
  {
    path: 'student',
    component: StudentView,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        component: StudentLessonsComponent,
      },
      {
        path: 'teachers',
        component: StudentTeachersComponent,
      },
    ]
  },
  {
    path: 'login',
    component: LoginView,
    canActivate: [loginGuard],
  },
];
