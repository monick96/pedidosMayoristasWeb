import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartWidget } from './cart/cart-widget/cart-widget';
import { SideCart } from './cart/side-cart/side-cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartWidget, SideCart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('pedidos-web-mayorista');
}
