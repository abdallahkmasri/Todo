import {
  Routes,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { AuthGuard } from './services/auth.service';
import { AllUsers } from './components/allusers/list.component';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./routes/register.route').then((r) => r.RegisterRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./routes/signin.route').then((r) => r.SignInRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./routes/dashboard.route').then((r) => r.DashboardRoute),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./routes/search.route').then((r) => r.SearchRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: AllUsers,
  }
];

export const AppRoutingProvider = [
  provideRouter(routes, withComponentInputBinding()),
];
