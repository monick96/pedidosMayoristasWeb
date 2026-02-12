import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Producto } from '../../../../domain/entities/Producto';
import { CalculadorPrecioProducto} from '../../../../domain/services/CalculadorPrecioProducto';
import { CurrencyPipe } from '@angular/common';
import { ProductoVM } from '../models/productoVm';
import { ProductoListadoVM } from '../models/productoListadoVm';

@Component({
  selector: 'app-card-producto',
  imports: [CurrencyPipe],
  templateUrl: './card-producto.html',
  styleUrl: './card-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardProducto {
  
  @Input({ required: true }) item!: ProductoVM;
  
}
