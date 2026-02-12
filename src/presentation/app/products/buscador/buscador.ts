import { Component, output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-buscador',
  imports: [],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})
export class Buscador {
  onSearch = output<string>();

  inputSubject = new Subject<string>();

  constructor() {
    this.inputSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      takeUntilDestroyed() // Esto sería lo ideal para limpiar la suscripción
    ).subscribe(value => {
       console.log('Buscando:', value); // Agrega este log para probar
       this.onSearch.emit(value);
    });
  }


}
