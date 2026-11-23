import { Routes } from '@angular/router';
import { TabsComponent } from './shared/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'tasks/new',
        loadComponent: () => import('./features/tasks/task-form/task-form.page').then(m => m.TaskFormPage)
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () => import('./features/tasks/task-form/task-form.page').then(m => m.TaskFormPage)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks.page').then(m => m.TasksPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];