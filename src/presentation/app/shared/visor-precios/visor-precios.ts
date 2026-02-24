import { Component, Input } from '@angular/core';
import { PesoArgPipe } from '../pipes/pesos-ar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-visor-precios',
  imports: [PesoArgPipe, NgClass],
  templateUrl: './visor-precios.html',
  styleUrl: './visor-precios.css',
})
export class VisorPrecios {
  // Recibimos los precios calculados
  @Input({ required: true }) precios!: { nivel: string; precio: number }[];
  
  // Recibimos en qué nivel está el usuario actualmente (1, 2 o 3)
  @Input({ required: true }) nivelActivo!: string;

}
