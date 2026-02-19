import { Component, inject } from '@angular/core';
import { CartFacade } from '../cart.facade';
import { CurrencyPipe } from '@angular/common';
import { TELEFONO_DESTINO } from '../../../../environment/telefono';

@Component({
  selector: 'app-side-cart',
  imports: [CurrencyPipe],
  templateUrl: './side-cart.html',
  styleUrl: './side-cart.css',
})
export class SideCart {

  facade = inject(CartFacade);

  
  updateNombre(event: Event) {
    const input = event.target as HTMLInputElement;
    this.facade.setClienteNombre(input.value); 
  }

  // Generador de pedido para WhatsApp (para MVP)
  generarPedidoWhatsapp() {

    // Leemos el nombredesde el Facade
    const nombre = this.facade.clienteNombre().trim();
    
    if (!nombre) {
      alert('Por favor, ingresa tu nombre para confirmar el pedido.');
      return;
    }

    const telefono = TELEFONO_DESTINO; // NUMERO AQUI
    const items = this.facade.items();
    
    let mensaje = `Hola! Soy *${nombre}* y quiero realizar el siguiente pedido mayorista:%0A%0A`;
    
    items.forEach(item => {
      const saborTexto = item.sabor ? ` (${item.sabor})` : '';
      mensaje += `- ${item.cantidad}x ${item.nombre}${saborTexto} ($${item.precioUnitario})%0A`;
    });
    
    mensaje += `%0A*Total Estimado: $${this.facade.total()}*`;
    
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  }

}
