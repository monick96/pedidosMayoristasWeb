import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-qty-selector',
  imports: [],
  templateUrl: './qty-selector.html',
  styleUrl: './qty-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QtySelector {

  // Recibimos la cantidad actual
  @Input({ required: true }) cantidad!: number;
  
  // Avisamos al padre qué acción ocurrió
  @Output() onIncrease = new EventEmitter<void>();
  @Output() onDecrease = new EventEmitter<void>();
  
  // Avisamos al padre si el usuario escribió un número manualmente
  @Output() onChange = new EventEmitter<number>();

  manejarInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevoValor = parseInt(input.value, 10);

    // Emitimos el nuevo valor (el padre y el facade decidirán qué hacer con él)
    this.onChange.emit(nuevoValor);
  }
  
}
