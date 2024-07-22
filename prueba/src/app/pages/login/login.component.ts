import { Component, inject, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccesoService } from '../../services/acceso.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public formBuild = inject(FormBuilder);

  public formlogin: FormGroup = this.formBuild.group({
    username: ['',Validators.required],
    password: ['',Validators.required]
  })

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.returnValue = 'Seguro que quiere salir?';
  }

  inicioSesion(){
    if(this.formlogin.invalid)return;
    if (this.formlogin.value.username === 'vgguillen' &&
      this.formlogin.value.password === '1313'
    ) {
      const user = {
        username: this.formlogin.value.username,
        token: '1313',
        role: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(user));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/invitado';
      this.router.navigate([returnUrl]);
    } else {
      alert('Credenciales Incorrectas');
    }
  }

  invitado(){
    const guestUser = {
      username: 'guest',
      role: 'guest'
    };
    localStorage.setItem('user', JSON.stringify(guestUser));
    this.router.navigate(['invitado'])
  }

}
