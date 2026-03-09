import { Injectable, signal } from '@angular/core';

export type AlertType = 'warning' | 'confirm' | 'success';

export interface AlertState {
  show: boolean;
  message: string;
  type: AlertType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  // El estado de nuestra alerta. Arranca oculta.
  readonly state = signal<AlertState>({ show: false, message: '', type: 'success' });

  // Método para mostrar un mensaje simple (ej: "Falta tu nombre")
  show(message: string, type: AlertType = 'warning') {
    this.state.set({ show: true, message, type });
  }

  // Método para pedir confirmación (ej: "Vaciar carrito")
  confirm(message: string, onConfirm: () => void) {
    this.state.set({
      show: true,
      message,
      type: 'confirm',
      onConfirm: () => {
        onConfirm(); // Ejecuta la acción
        this.close(); // Cierra la alerta
      },
      onCancel: () => this.close()
    });
  }

  close() {
    this.state.update(s => ({ ...s, show: false }));
  }
}