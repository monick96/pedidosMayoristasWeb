import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCarrusel]', // Así la llamaremos en el HTML
  exportAs: 'appCarrusel',   // Esto nos permite usar sus métodos directamente en los botones
  standalone: true
})
export class CarruselDirective {
  
  // Angular inyecta automáticamente el elemento HTML al que le pegamos la directiva
  constructor(private el: ElementRef<HTMLDivElement>) {}

  scrollAnterior(event?: Event) {
    event?.stopPropagation();
    
    const carrusel = this.el.nativeElement;
    if (carrusel.scrollLeft <= 0) {
      carrusel.scrollLeft = carrusel.scrollWidth;
    } else {
      carrusel.scrollLeft -= carrusel.offsetWidth;
    }
  }

  scrollSiguiente(event?: Event) {
    event?.stopPropagation();
    
    const carrusel = this.el.nativeElement;
    if (carrusel.scrollLeft + carrusel.offsetWidth >= carrusel.scrollWidth - 5) {
      carrusel.scrollLeft = 0;
    } else {
      carrusel.scrollLeft += carrusel.offsetWidth;
    }
  }

  // 2. Creamos el método que ejecutan los botones
  scrollMarcas(distancia: number) {
    const contenedorMarcas = this.el.nativeElement;
    if (contenedorMarcas) {
      // Usamos la API nativa del navegador para hacer scroll suave
      contenedorMarcas.scrollBy({
        left: distancia,
        behavior: 'smooth' // ¡Esta es la magia que hace que no sea de golpe!
      });
    }
  }


}