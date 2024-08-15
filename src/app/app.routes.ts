import {
  Routes,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./routes/register.route').then((r) => r.RegisterRoutes)
  },
  {
    path: 'signin',
    loadChildren: () => import('./routes/signin.route').then((r) => r.SignInRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./routes/dashboard.route').then((r) => r.DashboardRoute)
  }
];

export const AppRoutingProvider = [
  provideRouter(routes, withComponentInputBinding()),
];
