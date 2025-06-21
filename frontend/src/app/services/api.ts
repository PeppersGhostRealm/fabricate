import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getExample(): Observable<object> {
    return this.http.get<object>(this.base + '/example');
  }
}
