import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { AuthorsData } from '../interface/ResponseAuthor';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  listar(): Observable<AuthorsData>{
    return this.http.get<AuthorsData>(`${this.baseUrl}/author`);
  }
}
