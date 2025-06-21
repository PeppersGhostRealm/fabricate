import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { PageNotFound } from './routes/page-not-found/page-not-found';
import { AuthCallback } from './core/auth-callback/auth-callback';

export const routes: Routes = [
  { path: '', component: Home },
  { path: '**', component: PageNotFound },
  { path: 'auth/callback', component: AuthCallback },
];
