import { Component, inject } from '@angular/core';
import { CartFacade } from '../../facades/cart.facade';

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  template: `
    @if (facade.count() > 0) {
      <button class="cart-fab" (click)="facade.toggleSidebar()">
        🛒
        <span class="badge">{{ facade.count() }}</span>
      </button>
    }
  `,
  styleUrl: './cart-widget.css',
})
export class CartWidget {
  facade = inject(CartFacade);
}