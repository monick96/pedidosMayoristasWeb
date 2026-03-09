import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';


// --- INTERFACES ---
export interface TiendaConfig {
  whatsapp: string;
  montoMinimo: number;
  montoMinimoCombo: number;      // Agregado
  montoMinimoMayorista2: number; // Agregado
  montoMinimoMayorista3: number; // Agregado
  montoMinimoMayorista4: number; // Agregado
  bannerText: string;
  ocultarSinStock: boolean;
  ocultarDesc: boolean;          // Agregado
}

export interface ProductoAdminDummy {
  codigo: string;
  descripcion: string;
  sabor: string;
  precio: number;
  disponible: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
// --- ESTADO DE CONFIGURACIÓN ---
  config = signal<TiendaConfig>({
    whatsapp: '',
    montoMinimo: 0,
    montoMinimoCombo: 0,
    montoMinimoMayorista2: 0,
    montoMinimoMayorista3: 0,
    montoMinimoMayorista4: 0,
    bannerText: '',
    ocultarSinStock: false,
    ocultarDesc: false
  });

  estaCargando = signal<boolean>(false);

  // --- ESTADO DEL CATÁLOGO (DUMMY) ---
  textoBusqueda = signal<string>('');
  
  productosDummy = signal<ProductoAdminDummy[]>([
    { codigo: 'PROT-01', descripcion: 'Whey Protein Ena 1Kg', sabor: 'Vainilla', precio: 25000, disponible: true },
    { codigo: 'CREA-02', descripcion: 'Creatina Monohidrato 300g', sabor: 'Sin sabor', precio: 18000, disponible: false },
    { codigo: 'PRE-03', descripcion: 'C4 Pre-entreno 30 serv.', sabor: 'Fruit Punch', precio: 32000, disponible: true },
    { codigo: 'DESC-04', descripcion: 'Shaker Mezclador', sabor: 'Negro', precio: 5000, disponible: true }
  ]);

  // Señal computada para filtrar la lista instantáneamente
  productosFiltrados = computed(() => {
    const term = this.textoBusqueda().toLowerCase();
    return this.productosDummy().filter(p => 
      p.descripcion.toLowerCase().includes(term) || 
      p.codigo.toLowerCase().includes(term)
    );
  });


  ngOnInit(): void {
    this.cargarConfiguracionDummy();
  }

  cargarConfiguracionDummy() {
    this.estaCargando.set(true);
    setTimeout(() => {
      this.config.set({
        whatsapp: '5491123456789',
        montoMinimo: 50000,
        montoMinimoCombo: 60000,
        montoMinimoMayorista2: 100000,
        montoMinimoMayorista3: 200000,
        montoMinimoMayorista4: 500000,
        bannerText: '',
        ocultarSinStock: true,
        ocultarDesc: false
      });
      this.estaCargando.set(false);
    }, 1000);
  }

  guardarConfiguracion() {
    console.log('💾 Guardando config:', this.config());
    console.log('📦 Estado del catálogo:', this.productosDummy());
    
    this.estaCargando.set(true);
    setTimeout(() => {
      this.estaCargando.set(false);
      alert('¡Excelente! Cambios guardados con éxito 🚀');
    }, 800);
  }

  // Método para el botón individual del producto
  toggleDisponibilidad(producto: ProductoAdminDummy) {
    producto.disponible = !producto.disponible;
  }

}
