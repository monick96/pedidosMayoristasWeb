import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductoVM } from '../models/productoVm';
import { ProductoListadoVM } from '../models/productoListadoVm';
import { ProductFacade } from '../product.facade';
import { CartFacade } from '../../cart/cart.facade';

@Component({
  selector: 'app-card-producto',
  imports: [CurrencyPipe],
  templateUrl: './card-producto.html',
  styleUrl: './card-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardProducto {
  
  @Input({ required: true }) item!: ProductoVM;
  
  // Inyectamos el facade para usar sus métodos de galería
  facade = inject(ProductFacade);
  cartFacade = inject(CartFacade);

  agregarAlCarrito(event: Event) {
    event.stopPropagation(); // para que no abra el Lightbox al hacer click en el botón
    this.cartFacade.addToCart(this.item);
  }
  
}
