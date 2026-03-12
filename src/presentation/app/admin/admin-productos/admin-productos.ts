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
  
  currentPage = signal<number>(1);

  itemsPerPage = signal<number>(20);

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

  /*buscar(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }*/

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

  //Corta la lista para la página actual
  productosPaginados = computed<ProductoListadoVM[]>(() => {
    const inicio = (this.currentPage() - 1) * this.itemsPerPage();
    const fin = inicio + this.itemsPerPage();
    return this.productosFiltrados().slice(inicio, fin);
  });

  // Calcula cuántas páginas hay en total
  totalPages = computed<number>(() => {
    return Math.ceil(this.productosFiltrados().length / this.itemsPerPage()) || 1;
  });


  buscar(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1); // Volvemos a la página 1 al buscar algo nuevo
  }

  //Funciones para cambiar de página
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

}
