import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CartWidget } from './cart/cart-widget/cart-widget';
import { SideCart } from './cart/side-cart/side-cart';
import { AlertServiceComponent } from './shared/alert-service-component/alert-service-component';
import { ConfigFacade } from './facades/Config.facade';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartWidget, SideCart, AlertServiceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('pedidos-web-mayorista');
  configFacade = inject(ConfigFacade);

  private router = inject(Router);

  //Signal que sabrá si estamos en el admin o no
  isAdminRoute = signal<boolean>(false);

  constructor() {
    // Escuchamos cada vez que el usuario cambia de URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL empieza con /admin o /login, permitimos ver contenido
     
      const esRutaSistema = event.urlAfterRedirects.startsWith('/admin') || 
                            event.urlAfterRedirects.startsWith('/login');
                            
      this.isAdminRoute.set(esRutaSistema);
    });
  }
}
