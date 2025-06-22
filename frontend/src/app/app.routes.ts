import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { PageNotFound } from './features/page-not-found/page-not-found';
import { AuthCallback } from './core/auth-callback/auth-callback';
import { DeckList } from './features/deck-list/deck-list';
import { DeckEdit } from './features/deck-edit/deck-edit';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'decks', component: DeckList },
  { path: 'decks/new', component: DeckEdit },
  { path: 'decks/:id/edit', component: DeckEdit },
  { path: '**', component: PageNotFound },
  { path: 'auth/callback', component: AuthCallback },
];
