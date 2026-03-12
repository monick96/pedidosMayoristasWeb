import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth-service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos el estado de Firebase UNA vez (take 1)
  return authService.user$.pipe(
    take(1),
    map(user => {
      // Si hay usuario, lo dejamos pasar
      if (user) return true;
      
      // Si no hay, lo llevamos a la pantalla de login
      return router.createUrlTree(['/login']);
    })
  );
};