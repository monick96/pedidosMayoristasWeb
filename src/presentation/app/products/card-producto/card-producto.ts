import { Component, ChangeDetectionStrategy, Input, inject, computed } from '@angular/core';
import { ProductoVM } from '../../models/productoVm';
import { ProductFacade } from '../../facades/product.facade';
import { CartFacade } from '../../facades/cart.facade';
import { PesoArgPipe } from '../../shared/pipes/pesos-ar';
import { VisorPrecios } from '../../shared/visor-precios/visor-precios';
import { QtySelector } from '../../shared/qty-selector/qty-selector';
import { CarruselDirective } from '../../shared/directives/carrusel-directive';

@Component({
  selector: 'app-card-producto',
  imports: [PesoArgPipe, VisorPrecios, QtySelector, CarruselDirective],
  templateUrl: './card-producto.html',
  styleUrl: './card-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardProducto {
  
  @Input({ required: true }) item!: ProductoVM;
  
  // Inyectamos el facade para usar sus métodos de galería
  facade = inject(ProductFacade);
  
  cartFacade = inject(CartFacade);

  

  // Si cambia el carrito, este número se actualiza.
  readonly cantidadEnCarrito = computed(() => {
    return this.cartFacade.cantidadesMap()[this.item.codigo] || 0;
  }); 


}
