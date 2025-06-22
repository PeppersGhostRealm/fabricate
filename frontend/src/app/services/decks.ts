import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

export interface Deck {
  id: number;
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class Decks {
  private base = `${environment.apiUrl}/decks`;

  constructor(private http: HttpClient) {}

  list(): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.base, { withCredentials: true });
  }

  get(id: string): Observable<Deck> {
    return this.http.get<Deck>(`${this.base}/${id}`, { withCredentials: true });
  }

  create(deck: { name: string; content: string }): Observable<Deck> {
    return this.http.post<Deck>(this.base, deck, { withCredentials: true });
  }

  update(
    id: string,
    deck: { name: string; content: string }
  ): Observable<Deck> {
    return this.http.put<Deck>(`${this.base}/${id}`, deck, {
      withCredentials: true,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, {
      withCredentials: true,
    });
  }
}
