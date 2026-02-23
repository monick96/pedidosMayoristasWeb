import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductFacade } from '../product.facade';
import { CardProducto } from '../card-producto/card-producto';
import { Buscador } from '../buscador/buscador';
import { NgClass } from '@angular/common';
import { ListaProductosLista } from '../lista-productos-lista/lista-productos-lista';
import { NivelesModal } from '../../shared/niveles-modal/niveles-modal';

@Component({
  selector: 'app-lista-productos',
  imports: [CardProducto, Buscador, NgClass, ListaProductosLista, NivelesModal],
  templateUrl: './lista-productos-grid.html',
  styleUrl: './lista-productos-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ListaProductos {

  facade =  inject(ProductFacade);

  ngOnInit() {
    this.facade.loadProducts();
  }

}
