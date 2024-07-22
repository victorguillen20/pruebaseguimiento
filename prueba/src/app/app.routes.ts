import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InvitadoComponent } from './pages/invitado/invitado.component';

export const routes: Routes = [
  {path: "", component:LoginComponent},
  {path: "invitado", component:InvitadoComponent}
];
