import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  // 1) Kick off the Discord OAuth flow
  loginWithDiscord(): void {
    window.location.href = `${environment.apiUrl}/auth/discord`;
  }

  // 2) Load current user from backend
  loadUser(): void {
    this.http
      .get<{ user: any }>(`${environment.apiUrl}/auth/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (resp) => this.userSubject.next(resp.user),
        error: () => this.userSubject.next(null),
      });
  }

  // 3) Clear session via backend
  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.userSubject.next(null),
        error: () => this.userSubject.next(null),
      });
  }
}
