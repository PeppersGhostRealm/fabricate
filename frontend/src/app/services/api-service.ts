import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = `${environment.apiUrl}`

  constructor(private http: HttpClient) { }
  
}
