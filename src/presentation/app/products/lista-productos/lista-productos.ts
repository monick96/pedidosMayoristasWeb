import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductFacade } from '../product.facade';
import { CardProducto } from '../card-producto/card-producto';
import { Buscador } from '../buscador/buscador';

@Component({
  selector: 'app-lista-productos',
  imports: [CardProducto, Buscador],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ListaProductos {
  facade =  inject(ProductFacade);

  ngOnInit() {
    this.facade.loadProducts();
  }

}
