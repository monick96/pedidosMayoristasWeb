import { Component, Input, signal, computed } from '@angular/core';
import { PesoArgPipe } from '../pipes/pesos-ar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-visor-precios',
  imports: [PesoArgPipe, NgClass],
  templateUrl: './visor-precios.html',
  styleUrl: './visor-precios.css',
})
export class VisorPrecios {
  
  @Input({ required: true }) nivelActivo!: string;

  //Signal interno para interceptar los precios que entran
  private _precios = signal<{ nivel: string; precio: number }[]>([]);

  //Interceptamos el Input y lo guardamos en el Signal
  @Input({ required: true }) set precios(val: { nivel: string; precio: number }[]) {
    this._precios.set(val);
  }

  //Filtramos los precios repetidos de forma reactiva
  readonly preciosUnicos = computed(() => {
    const listaOriginal = this._precios();
    const listaFiltrada: { nivel: string; precio: number }[] = [];

    listaOriginal.forEach(actual => {
      // Verificamos si ya guardamos este valor de precio exacto
      const yaExiste = listaFiltrada.some(p => p.precio === actual.precio);
      if (!yaExiste) {
        listaFiltrada.push(actual);
      }
    });

    return listaFiltrada;
  });

}
