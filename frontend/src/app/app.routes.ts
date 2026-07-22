import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'contribuyentes',
        loadComponent: () => import('./features/contribuyentes/contribuyentes.component').then((m) => m.ContribuyentesComponent),
      },
      {
        path: 'conceptos',
        loadComponent: () => import('./features/conceptos/conceptos.component').then((m) => m.ConceptosComponent),
      },
      {
        path: 'liquidaciones',
        loadComponent: () => import('./features/liquidaciones/liquidaciones.component').then((m) => m.LiquidacionesComponent),
      },
      {
        path: 'liquidaciones/nueva',
        loadComponent: () => import('./features/liquidaciones/liquidacion-form/liquidacion-form.component').then((m) => m.LiquidacionFormComponent),
      },
      {
        path: 'liquidaciones/:id',
        loadComponent: () => import('./features/liquidaciones/liquidacion-detail/liquidacion-detail.component').then((m) => m.LiquidacionDetailComponent),
      },
      {
        path: 'pagos',
        loadComponent: () => import('./features/pagos/pagos.component').then((m) => m.PagosComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
