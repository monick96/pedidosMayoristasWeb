import { Component, inject } from '@angular/core';
import { CartFacade } from '../../facades/cart.facade';
import { TELEFONO_DESTINO } from '../../../../environment/telefono';
import { AlertService } from '../../shared/alert-service';
import { NivelesModal } from '../../shared/niveles-modal/niveles-modal';
import { PesoArgPipe } from '../../shared/pipes/pesos-ar';
import { VisorPrecios } from '../../shared/visor-precios/visor-precios';
import { QtySelector } from '../../shared/qty-selector/qty-selector';

@Component({
  selector: 'app-side-cart',
  imports: [PesoArgPipe, NivelesModal, VisorPrecios, QtySelector],
  templateUrl: './side-cart.html',
  styleUrl: './side-cart.css',
})
export class SideCart {

  facade = inject(CartFacade);

  private alertService = inject(AlertService);

  updateNombre(event: Event) {
    const input = event.target as HTMLInputElement;
    this.facade.setClienteNombre(input.value); 
  }

  // Generador de pedido para WhatsApp (para MVP)
  generarPedidoWhatsapp() {

    // Leemos el nombredesde el Facade
    const nombre = this.facade.clienteNombre().trim();
    
    if (!nombre) {
      this.alertService.show('Por favor, ingresa tu nombre / local para confirmar el pedido.', 'warning');
      return;
    }

    const telefono = TELEFONO_DESTINO; // NUMERO AQUI
    const items = this.facade.itemsConPrecio();
    
    let mensaje = `Hola! Soy *${nombre}* y quiero realizar el siguiente pedido mayorista:%0A%0A`;
    
    items.forEach(item => {
      const saborTexto = item.sabor ? ` (${item.sabor})` : '';
      mensaje += `- ${item.cantidad}x ${item.nombre}${saborTexto} ($${item.precioEfectivo})%0A`;
    });
    
    mensaje += `%0A*Total Estimado: $${this.facade.total()}*`;
    
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  }

}
