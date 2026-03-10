import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigFacade } from '../../facades/Config.facade';
import { AppRuleConfig } from '../../../../domain/entities/AppRuleConfig';
import { AlertService } from '../../shared/services/alert-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  
  // Inyectamos el Facade que trae los datos reales
  private configFacade = inject(ConfigFacade);
  private alertService = inject(AlertService);

  // Variables locales del formulario
  minimoGeneral = signal<number>(0);
  minimoConCombos = signal<number>(0);
  telefonoWhatsapp = signal<string>('');
  
  escala1_nombre = signal<string>('');
  escala2_nombre = signal<string>('');
  escala2_minimo = signal<number>(0);
  escala3_nombre = signal<string>('');
  escala3_minimo = signal<number>(0);
  escala4_nombre = signal<string>('');
  escala4_minimo = signal<number>(0);

  estaCargando = signal<boolean>(false);

  constructor() {
    //Effect escucha los Signals del Facade.
    // Cuando terminan de cargar desde Firebase, llenamos el formulario automáticamente.
    effect(() => {
      const loading = this.configFacade.loading();
      
      if (!loading) {
        this.minimoGeneral.set(this.configFacade.minimoGeneral());
        this.minimoConCombos.set(this.configFacade.minimoConCombos());
        this.telefonoWhatsapp.set(this.configFacade.telefonoWhatsapp());
        
        const escalas = this.configFacade.escalas();
        if (escalas && escalas.length >= 3) {
           this.escala1_nombre.set(escalas[0].nombre);
           this.escala2_nombre.set(escalas[1].nombre);
           this.escala2_minimo.set(escalas[1].montoMinimo);
           this.escala3_nombre.set(escalas[2].nombre);
           this.escala3_minimo.set(escalas[2].montoMinimo);
        }

        //Solo intentamos leer el Nivel 4 si realmente vino de Firebase
        if (escalas && escalas.length >= 4) {
           this.escala4_nombre.set(escalas[3].nombre);
           this.escala4_minimo.set(escalas[3].montoMinimo); 
        }
      }
    });
  }

  async guardarConfiguracion() {
    this.estaCargando.set(true);
    
    // Armamos el objeto con el formato que espera la base de datos
    const nuevaConfig: AppRuleConfig = {
      minimoGeneral: Number(this.minimoGeneral()),
      minimoConCombos: Number(this.minimoConCombos()),
      telefonoWhatsapp: this.telefonoWhatsapp(), 
      escalas: [
        { nivel: "nivel 1", nombre: this.escala1_nombre(), montoMinimo: 0 },
        { nivel: "nivel 2", nombre: this.escala2_nombre(), montoMinimo: Number(this.escala2_minimo()) },
        { nivel: "nivel 3", nombre: this.escala3_nombre(), montoMinimo: Number(this.escala3_minimo()) },
        { nivel: "nivel 4", nombre: this.escala4_nombre() , montoMinimo: Number(this.escala4_minimo()) }
      ]
    };

    // Le pedimos al Facade que guarde en Firebase
    const exito = await this.configFacade.saveConfig(nuevaConfig);
    
    this.estaCargando.set(false);
    
    if (exito) {

      this.alertService.show('Cambios guardados con éxito en Firebase', 'success');

    } else {

      this.alertService.show('Hubo un error al guardar. Revisa tu conexión.', 'warning');

    }
  }

  // Convierte 290000 a "290.000"
  formatearNumero(valor: number): string {
    if (!valor) return '0';
    return new Intl.NumberFormat('es-AR').format(valor);
  }

  // Toma "290.000", le quita el punto, lo guarda en el Signal y lo vuelve a dibujar
  actualizarValor(event: Event, signalToUpdate: any) {
    const input = event.target as HTMLInputElement;
    
    // Quitamos los puntos para poder convertirlo a matemática pura
    const valorLimpio = input.value.replace(/\./g, '');
    const numeroReal = parseInt(valorLimpio, 10) || 0;

    // Guardamos el número real en la memoria de Angular
    signalToUpdate.set(numeroReal);

    // Obligamos al input a redibujarse con los puntos
    input.value = this.formatearNumero(numeroReal);
  }
}