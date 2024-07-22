import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').token : null;

    // Clonar la solicitud y agregar el token al encabezado
    const authReq = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });

    // Pasar la solicitud modificada al siguiente manejador
    return next.handle(authReq);
  }
}
