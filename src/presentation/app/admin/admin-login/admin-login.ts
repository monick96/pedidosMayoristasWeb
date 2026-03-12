import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  email = signal('');
  password = signal('');
  loading = signal(false);

  authService = inject(AuthService);
  router = inject(Router);
  alertService = inject(AlertService);

  async onSubmit() {
    if(!this.email() || !this.password()) return;
    
    this.loading.set(true);

    try {

      await this.authService.login(this.email(), this.password());

      // Si el login es exitoso, Firebase guarda la sesión y vamos al panel
      this.router.navigate(['/admin']);

    } catch (error) {

      this.alertService.show('Email o contraseña incorrectos.', 'warning');

    } finally {

      this.loading.set(false);

    }
  }

}
