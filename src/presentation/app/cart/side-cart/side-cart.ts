import { Component, inject } from '@angular/core';
import { CartFacade } from '../cart.facade';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-side-cart',
  imports: [CurrencyPipe],
  templateUrl: './side-cart.html',
  styleUrl: './side-cart.css',
})
export class SideCart {

  facade = inject(CartFacade);

  // Generador de pedido para WhatsApp (para MVP)
  generarPedidoWhatsapp() {
    const telefono = TELEFONO_DESTINO; // NUMERO AQUI
    const items = this.facade.items();
    
    let mensaje = `Hola! Quiero realizar el siguiente pedido mayorista:%0A%0A`;
    
    items.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.nombre} ($${item.precioUnitario})%0A`;
    });
    
    mensaje += `%0A*Total Estimado: $${this.facade.total()}*`;
    
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  }

}
