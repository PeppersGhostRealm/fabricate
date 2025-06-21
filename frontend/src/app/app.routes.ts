import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { PageNotFound } from './routes/page-not-found/page-not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: '**', component: PageNotFound },
];
