import { Component, signal } from '@angular/core';
import { PesoArgPipe } from '../pipes/pesos-ar';
import { APP_CONFIG } from '../../../../infrastructure/peristence/in-memory/appConfigMock';

@Component({
  selector: 'app-niveles-modal',
  imports: [PesoArgPipe],
  templateUrl: './niveles-modal.html',
  styleUrl: './niveles-modal.css',
})
export class NivelesModal {
  readonly isOpen = signal(false);
  readonly escalas = APP_CONFIG.escalas;
  readonly minimoGeneral = APP_CONFIG.minimoGeneral;
  readonly minimoConCombos = APP_CONFIG.minimoConCombos;

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }

}
