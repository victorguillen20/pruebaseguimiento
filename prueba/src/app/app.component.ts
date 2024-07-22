import { Component, OnInit } from '@angular/core';
import { RouterOutlet, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Prueba';
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const protectedRoutes = ['/invitado'];
        if (protectedRoutes.includes(event.url) && (!user || !user.role)) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
