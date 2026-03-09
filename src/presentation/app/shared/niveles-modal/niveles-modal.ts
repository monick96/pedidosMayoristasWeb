import { Component, signal, inject } from '@angular/core';
import { PesoArgPipe } from '../pipes/pesos-ar';
import { ConfigFacade } from '../../facades/Config.facade';

@Component({
  selector: 'app-niveles-modal',
  imports: [PesoArgPipe],
  templateUrl: './niveles-modal.html',
  styleUrl: './niveles-modal.css',
})
export class NivelesModal {
  private configFacade = inject(ConfigFacade);
  readonly isOpen = signal(false);
  readonly escalas = this.configFacade.escalas;
  readonly minimoGeneral = this.configFacade.minimoGeneral;
  readonly minimoConCombos = this.configFacade.minimoConCombos;

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }

}
