import { Component, ChangeDetectionStrategy, Input, inject, computed } from '@angular/core';
import { ProductoVM } from '../models/productoVm';
import { ProductFacade } from '../product.facade';
import { CartFacade } from '../../cart/cart.facade';
import { PesoArgPipe } from '../../shared/pipes/pesos-ar';


@Component({
  selector: 'app-lista-productos-lista',
  imports: [PesoArgPipe],
  templateUrl: './lista-productos-lista.html',
  styleUrl: './lista-productos-lista.css',
})
export class ListaProductosLista {

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

  // Acciones
  abrirLightbox(event: Event) {
    event.stopPropagation();
    // Abrimos siempre en la primera imagen (índice 0)
    this.facade.openLightbox(this.item, 0);
  }
  
}
