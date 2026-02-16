import { Component, ChangeDetectionStrategy, Input, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductoVM } from '../models/productoVm';
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

  // Si cambia el carrito, este número se actualiza solo.
  readonly cantidadEnCarrito = computed(() => {
    const itemEnCarrito = this.cartFacade.items().find(i => i.productoId === this.item.codigo);
    return itemEnCarrito ? itemEnCarrito.cantidad : 0;
  });

  agregarAlCarrito(event: Event) {
    event.stopPropagation(); // para que no abra el Lightbox al hacer click en el botón
    this.cartFacade.addToCart(this.item);
  }

  restar(event: Event) {
    event.stopPropagation();
    this.cartFacade.decreaseQuantity(this.item.codigo);
  }
  
}
