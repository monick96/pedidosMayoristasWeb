import { Injectable, signal, inject } from '@angular/core';
import { AppRuleConfig, EscalaPrecio } from '../../../domain/entities/AppRuleConfig';
import { GetConfigRuleUseCase } from '../../../aplication/use-cases/GetConfigRuleUseCase';
import { UpdateRuleConfigUseCase } from '../../../aplication/use-cases/UpdateRuleConfigUseCase';

@Injectable({ providedIn: 'root' })
export class ConfigFacade {
  
  private readonly getUseCase = inject(GetConfigRuleUseCase);
  private readonly updateUseCase = inject(UpdateRuleConfigUseCase);

  // Signals Reactivos que toda la app podrá leer
  readonly minimoGeneral = signal<number>(0);
  readonly minimoConCombos = signal<number>(0);
  readonly escalas = signal<EscalaPrecio[]>([]);
  readonly loading = signal<boolean>(true);
  readonly telefonoWhatsapp = signal<string>('');
  

  constructor() {
    this.loadConfig(); // Al arrancar la app, va a buscar los datos a Firebase
  }

  async loadConfig() {
    this.loading.set(true);
    const result = await this.getUseCase.execute();
    
    if (result.isOk()) {
      const config = result.value;
      this.minimoGeneral.set(config.minimoGeneral);
      this.minimoConCombos.set(config.minimoConCombos);
      this.escalas.set(config.escalas);
      this.telefonoWhatsapp.set(config.telefonoWhatsapp || '');
    } else {
      console.error("Error al cargar la configuración general:", result.error);
    }
    
    this.loading.set(false);
  }

  // Método que usaremos desde el Panel de Admin
  async saveConfig(newConfig: AppRuleConfig): Promise<boolean> {
    const result = await this.updateUseCase.execute(newConfig);
    if (result.isOk()) {
      // Actualizamos los signals para que la pantalla cambie al instante
      this.minimoGeneral.set(newConfig.minimoGeneral);
      this.minimoConCombos.set(newConfig.minimoConCombos);
      this.escalas.set(newConfig.escalas);
      this.telefonoWhatsapp.set(newConfig.telefonoWhatsapp);
      return true;
    }
    return false;
  }
}