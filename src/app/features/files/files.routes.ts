import { Routes } from '@angular/router';

export const filesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'my-files',
    pathMatch: 'full'
  },
  {
    path: 'my-files',
    loadComponent: () => import('./pages/my-files/my-files').then((m) => m.MyFiles)
  },
  {
    path: 'starred',
    loadComponent: () => import('./pages/starred/starred').then((m) => m.Starred)
  },
  {
    path: 'recent',
    loadComponent: () => import('./pages/recent/recent').then((m) => m.Recent)
  },
  {
    path: 'trash',
    loadComponent: () => import('./pages/trash/trash').then((m) => m.Trash)
  },
  {
    path: 'shared',
    loadComponent: () => import('./pages/shared/shared').then((m) => m.Shared)
  }
];
