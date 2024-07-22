import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getUserRole(): Observable<string> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return of(user.role || 'guest');
  }

}
