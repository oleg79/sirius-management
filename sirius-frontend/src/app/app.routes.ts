import { Routes } from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {LoginView} from './views/login-view/login-view';
import {TeacherView} from './views/teacher-view/teacher-view';
import {StudentView} from './views/student-view/student-view';
import {rootRedirectGuard} from './guards/root-redirect-guard';
import {loginGuard} from './guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    children: []
  },
  {
    path: 'teacher',
    component: TeacherView,
    canActivate: [authGuard],
  },
  {
    path: 'student',
    component: StudentView,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginView,
    canActivate: [loginGuard],
  },
];
