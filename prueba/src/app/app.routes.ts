import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InvitadoComponent } from './pages/invitado/invitado.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {path: "login", component:LoginComponent},
  {path: "invitado", component:InvitadoComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
