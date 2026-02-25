import { Component, ChangeDetectionStrategy, Input, inject, computed } from '@angular/core';
import { ProductoVM } from '../models/productoVm';
import { ProductFacade } from '../product.facade';
import { CartFacade } from '../../cart/cart.facade';
import { PesoArgPipe } from '../../shared/pipes/pesos-ar';
import { VisorPrecios } from '../../shared/visor-precios/visor-precios';
import { QtySelector } from '../../shared/qty-selector/qty-selector';


@Component({
  selector: 'app-lista-productos-lista',
  imports: [PesoArgPipe, VisorPrecios, QtySelector],
  templateUrl: './lista-productos-lista.html',
  styleUrl: './lista-productos-lista.css',
})
export class ListaProductosLista {

  @Input({ required: true }) item!: ProductoVM;
  
  // Inyectamos el facade para usar sus métodos de galería
  facade = inject(ProductFacade);
  cartFacade = inject(CartFacade);

  // Si cambia el carrito, este número se actualiza.
  readonly cantidadEnCarrito = computed(() => {
    return this.cartFacade.cantidadesMap()[this.item.codigo] || 0;
  });

  // Acciones
  abrirLightbox(event: Event) {
    event.stopPropagation();
    // Abrimos siempre en la primera imagen (índice 0)
    this.facade.openLightbox(this.item, 0);
  }
  
}
