import { Component, inject } from '@angular/core';
import { CartFacade } from '../cart.facade';

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
  styles: [`
    .cart-fab {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--secondary-black);
      color: var(--primary-mustard);
      border: 2px solid var(--primary-mustard);
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 1000;
      transition: transform 0.2s;
    }
    .cart-fab:hover { transform: scale(1.1); }
    
    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: red;
      color: white;
      font-size: 12px;
      font-weight: bold;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
  `]
})
export class CartWidget {
  facade = inject(CartFacade);
}