import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Register } from './components/register/register';
import { WorkoutComponent } from './components/workout/workout';
import { StatsComponent } from './components/stats/stats';
import { AuthGuard } from './service/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default ruta
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: WorkoutComponent,canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent,canActivate: [AuthGuard] },
  
];
