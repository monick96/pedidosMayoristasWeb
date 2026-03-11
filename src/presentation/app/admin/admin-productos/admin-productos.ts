import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { ProductFacade } from '../../facades/product.facade';
import { FormsModule } from '@angular/forms';
import { PesoArgPipe } from '../../shared/pipes/pesos-ar';
import { ProductoVM } from '../../models/productoVm';
import { ProductoListadoVM } from '../../models/productoListadoVm';

@Component({
  selector: 'app-admin-productos',
  imports: [FormsModule, PesoArgPipe],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos implements OnInit {

  productFacade = inject(ProductFacade);

  searchTerm = signal<string>('');
  
  //solo productos (sin combos)
  /*productosFiltrados = computed<ProductoVM[]>(() => {
    const query = this.searchTerm().toLowerCase().trim();
    const todosLosItems = this.productFacade.items();

    const soloProductos = todosLosItems.filter(item => 
      this.productFacade.esProducto(item)
    ) as ProductoVM[];

    return soloProductos.filter(item => {
      // Si no hay búsqueda, devolvemos todo
      if (!query) return true;

      // separamos por palabras sueltas
      const palabras = query.split(' ').filter(p => p.length > 0);
      
      // Preparamos los textos protegiéndonos de los 'undefined' o 'null'
      const desc = (item.descripcion || '').toLowerCase();
      const cod  = (item.codigo || '').toLowerCase();
      const marc = (item.marcaId || '').toLowerCase();
      const sab  = (item.sabor || '').toLowerCase(); // Sumamos el sabor

      // Unimos todo en un mega texto
      const superTexto = `${desc} ${cod} ${marc} ${sab}`;

      // Verificamos que TODAS las palabras escritas existan en el superTexto (sin importar el orden)
      return palabras.every(p => superTexto.includes(p));
    });

  });*/

  productosFiltrados = computed<ProductoListadoVM[]>(() => {
    const query = this.searchTerm().toLowerCase().trim();
    // Tomamos ABSOLUTAMENTE TODOS los items (Productos y Combos)
    const todosLosItems = this.productFacade.items();

    return todosLosItems.filter(item => {
      // Si el buscador está vacío, mostramos todo
      if (!query) return true;

      const palabras = query.split(' ').filter(p => p.length > 0);
      
      const desc = (item.descripcion || '').toLowerCase();
      const cod  = (item.codigo || '').toLowerCase();
      const marc = (item.marcaId || '').toLowerCase();
      
      // ✨ Si es un producto, leemos el sabor. Si es combo, lo dejamos vacío.
      const sab = this.productFacade.esProducto(item) 
                  ? (item.sabor || '').toLowerCase() 
                  : '';

      const superTexto = `${desc} ${cod} ${marc} ${sab}`;

      // Búsqueda multi-palabra inteligente
      return palabras.every(p => superTexto.includes(p));
    });
  });

  ngOnInit() {
    if (this.productFacade.items().length === 0) {
      this.productFacade.loadProducts();
    }
  }

  buscar(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  cambiarEstado(item : ProductoListadoVM, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.productFacade.toggleProductoActivo(item, checkbox.checked);
  }

  cambiarUnidades(codigo: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const unidades = parseInt(input.value, 10) || 0;
    this.productFacade.updateUnidadesPorCaja(codigo, unidades);
  }

  cambiarNovedad(item: ProductoListadoVM, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.productFacade.toggleNovedad(item, checkbox.checked);
  }

}
