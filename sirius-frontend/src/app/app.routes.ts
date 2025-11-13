import { Routes } from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {rootRedirectGuard} from './guards/root-redirect-guard';
import {loginGuard} from './guards/login-guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    children: []
  },
  {
    path: 'admin',
    loadComponent: () => import('./views/admin-view/admin-view').then(c => c.AdminView),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        loadComponent: () => import('./views/admin-view/lessons-component/lessons-component')
          .then(c => c.LessonsComponent),
      },
      {
        path: 'teachers',
        loadComponent: () => import('./views/admin-view/teachers-component/teachers-component')
          .then(c => c.TeachersComponent),
      },
      {
        path: 'students',
        loadComponent: () => import('./views/admin-view/students-component/students-component')
          .then(c => c.StudentsComponent),
      },
    ]
  },
  {
    path: 'teacher',
    loadComponent: () => import('./views/teacher-view/teacher-view').then(c => c.TeacherView),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        loadComponent: () => import('./views/teacher-view/lessons-component/lessons-component')
          .then(c => c.LessonsComponent),
      },
      {
        path: 'students',
        loadComponent: () => import('./views/teacher-view/students-component/students-component')
          .then(c => c.StudentsComponent),
      },
    ]
  },
  {
    path: 'student',
    loadComponent: () => import('./views/student-view/student-view').then(c => c.StudentView),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons',
        loadComponent: () => import('./views/student-view/lessons-component/lessons-component')
          .then(c => c.LessonsComponent),
      },
      {
        path: 'teachers',
        loadComponent: () => import('./views/student-view/teachers-component/teachers-component')
          .then(c => c.TeachersComponent),
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login-view/login-view').then(c => c.LoginView),
    canActivate: [loginGuard],
  },
  {
    path: 'lesson/:id',
    loadComponent: () => import('./features/video-call/components/video-call-view/video-call-view')
      .then(c => c.VideoCallView),
  },
];
