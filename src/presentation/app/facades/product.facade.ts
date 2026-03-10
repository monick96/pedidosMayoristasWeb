import { signal, Injectable, computed, inject } from '@angular/core';
import {ProductoVM } from '../models/productoVm';
import { productoToVM } from '../mappers/productoMapper';
import { ProductoListadoVM } from '../models/productoListadoVm';
import { comboToVM } from '../mappers/comboMapper';
import { COMBO, PRODUCTO } from '../../../domain/value-objects/TipoProducto';
import { ViewMode } from '../models/viewType';
import { ComboVM } from '../models/comboVm';
import { GetProductosUseCase } from '../../../aplication/use-cases/GetProductosUseCase';
import { GetCombosUseCase } from '../../../aplication/use-cases/GetCombosUseCase';
import { UpdateProductoActivoUseCase } from '../../../aplication/use-cases/UpdateProductoActivoUseCase';
import { AlertService } from '../shared/services/alert-service';
import { UpdateProductoUnidadesUseCase } from '../../../aplication/use-cases/UpdateProductoUnidadesUseCase';


@Injectable({ providedIn: 'root' })
export class ProductFacade {

  private readonly getProductsUseCase = inject(GetProductosUseCase);

  private readonly getCombosUseCase = inject(GetCombosUseCase);

  private readonly updateActivoUseCase = inject(UpdateProductoActivoUseCase); 

  private readonly updateUnidadesUseCase = inject(UpdateProductoUnidadesUseCase);

  private readonly alertService = inject(AlertService);

  readonly items = signal<ProductoListadoVM[]>([]);

  readonly loading = signal<boolean>(false);

  // Agregamos el signal para el texto de búsqueda
  readonly filterText = signal<string>('');

  // Signal para saber qué marca filtrar
  readonly selectedBrand = signal<string | null>(null);

  // Agregamos un nuevo signal para filtros especiales
  //novedades
  readonly showOnlyNews = signal<boolean>(false);
  //solo combos
  readonly showOnlyCombos = signal<boolean>(false);

  readonly selectedGalleryItem = signal<ProductoListadoVM | null>(null);

  readonly currentImageIndex = signal<number>(0);

  readonly showOnlyOffers = signal<boolean>(false);

  //Signal para el modo de vista (por defecto 'list')
  readonly viewMode = signal<ViewMode>('list');

  //solo disponibles
  readonly showOnlyAvailable = signal<boolean>(true);

  async toggleProductoActivo(codigo: string, nuevoEstado: boolean) {
    // La UI cambia al instante sin esperar a Firebase
    this.items.update(items => items.map(item => {
      if (item.codigo === codigo && this.esProducto(item)) {
        return { ...item, activo: nuevoEstado, estaDisponible: nuevoEstado && item.precioFinal > 0 };
      }
      return item;
    }));

    //Guardamos en Firebase en segundo plano
    const result = await this.updateActivoUseCase.execute(codigo, nuevoEstado);
    
    if (result.isFail()) {
      this.alertService.show("Error al actualizar producto. Se revertirán los cambios.");
      this.loadProducts(); // Si falla el internet, recargamos la lista para deshacer el error visual
    } else {
      //Actualizamos la caché local 
      const CACHE_KEY = 'mi_catalogo_cache';
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) {
         const productos = JSON.parse(cache);
         const index = productos.findIndex((p: any) => p.codigo === codigo);
         if (index !== -1) {
           productos[index].activo = nuevoEstado;
           localStorage.setItem(CACHE_KEY, JSON.stringify(productos));
         }
      }
    }
  }

  // Al final de la clase:
  async updateUnidadesPorCaja(codigo: string, unidades: number) {
    // 1. Actualización Optimista (UI instantánea)
    this.items.update(items => items.map(item => {
      if (item.codigo === codigo && this.esProducto(item)) {
        return { ...item, unidadesPorCaja: unidades };
      }
      return item;
    }));

    // 2. Guardamos en Firebase en segundo plano
    const result = await this.updateUnidadesUseCase.execute(codigo, unidades);
    
    if (result.isFail()) {
      this.alertService.show("Error al actualizar unidades. Se revertirán los cambios.", "warning");
      this.loadProducts();
    } else {
      // 3. Actualizamos la caché local
      const CACHE_KEY = 'mi_catalogo_cache';
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) {
         const productos = JSON.parse(cache);
         const index = productos.findIndex((p: any) => p.codigo === codigo);
         if (index !== -1) {
           productos[index].unidadesPorCaja = unidades;
           localStorage.setItem(CACHE_KEY, JSON.stringify(productos));
         }
      }
    }
  }

  // type guard para TS: si esto devuelve true, 'item' es un ProductoVM
  esProducto(item: ProductoListadoVM): item is ProductoVM {
    return item.tipo === PRODUCTO;
  }

  // type guard para TS: si esto devuelve true, 'item' es un ComboVM
  esCombo(item: ProductoListadoVM): item is ComboVM {
    return item.tipo === COMBO;
  }

  //Métodos para cambiar la vista

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
  }
  
  toggleViewMode() {
    this.viewMode.update(current => current === 'grid' ? 'list' : 'grid');
  }

  // Métodos para controlar el Lightbox(ver imagen en grande)
  openLightbox(item: ProductoListadoVM, index: number = 0) {
    this.selectedGalleryItem.set(item);
    this.currentImageIndex.set(index);
  }

  closeLightbox() {
    this.selectedGalleryItem.set(null);
  }

  nextImage() {
    const item = this.selectedGalleryItem();
    if (!item || !item.images) return;
    const next = (this.currentImageIndex() + 1) % item.images.length;
    this.currentImageIndex.set(next);
  }

  prevImage() {
    const item = this.selectedGalleryItem();
    if (!item || !item.images) return;
    const total = item.images.length;
    const prev = (this.currentImageIndex() - 1 + total) % total;
    this.currentImageIndex.set(prev);
  }

  // Extrae marcas únicas de los items cargados(ambos tipos tienen marca)
  readonly marcasDisponibles = computed(() => {
    const todasLasMarcas = this.items()
      .map(item => item.marcaId)
      .filter((m): m is string => !!m);

    return [...new Set(todasLasMarcas)];
  });

  selectBrand(marca: string | null) {
    this.selectedBrand.set(marca);
    if (marca) {
      this.showOnlyNews.set(false);
      this.showOnlyCombos.set(false);
      this.showOnlyOffers.set(false);
    }
  }

  activateNews() {
    this.showOnlyNews.set(true);
    this.showOnlyCombos.set(false);
    this.selectedBrand.set(null);
    this.showOnlyOffers.set(false);
  }

  activateCombos() {
    this.showOnlyCombos.set(true);
    this.showOnlyNews.set(false);
    this.selectedBrand.set(null);
    this.showOnlyOffers.set(false);
  }

  activateOffers() {
    this.showOnlyOffers.set(true);
    this.showOnlyNews.set(false);
    this.showOnlyCombos.set(false);
    this.selectedBrand.set(null);
  }

  resetFilters() {
    this.showOnlyNews.set(false);
    this.showOnlyCombos.set(false);
    this.selectedBrand.set(null);
    this.showOnlyOffers.set(false);
  }

  // para el class.active de "Todos"
  isAllMode() {
    return this.selectedBrand() === null && 
    !this.showOnlyNews() && 
    !this.showOnlyCombos() && 
    !this.showOnlyOffers();
  }

  //Creamos un 'computed' que se actualiza solo cuando cambia items o filterText
  readonly filteredItems = computed(() => {
    const query = this.filterText().toLowerCase().trim();
    const brand = this.selectedBrand();
    const onlyNews = this.showOnlyNews();
    const onlyCombos = this.showOnlyCombos();
    const onlyOffers = this.showOnlyOffers();
    const onlyAvailable = this.showOnlyAvailable();
    const allItems = this.items();

    return allItems.filter(item => {
      // FILTROS DE BOTONES (Mutuamente excluyentes)

      // FILTRO Disponibilidad
      if (onlyAvailable && !item.estaDisponible) return false;

      // Si hay marca, filtramos por marca
      if (brand && item.marcaId !== brand) return false;
      
      // Si hay novedades, filtramos por esNovedad
      if (onlyNews && !item.esNovedad) return false;
      
      // Si hay combos, filtramos por tipo
      if (onlyCombos && !this.esCombo(item)) return false;

      if (onlyOffers) {
        if (!this.esProducto(item)) return false; 
        if (!item.tienePromo) return false;
      }

      // 2. FILTRO DE TEXTO (Siempre combina con el botón activo)
      if (!query) return true;

      const palabras = query.split(' ').filter(p => p.length > 0);
      const desc = (item.descripcion || '').toLowerCase();
      const marc = (item.marcaId || '').toLowerCase();
      const sab = this.esProducto(item) ? item.sabor?.toLowerCase() || '' : '';

      const superTexto = `${desc} ${marc} ${sab}`;
      
      return palabras.every(p => superTexto.includes(p));
    });
  });

  //Método para actualizar el filtro
  updateFilter(value: string) {
    this.filterText.set(value);
  }

  async loadProducts() {
    this.loading.set(true);

    //const result = await this.getProductsUseCase.execute();
     const [productosResult, combosResult] = await Promise.all([
      this.getProductsUseCase.execute(),
      this.getCombosUseCase.execute(),
    ]);

    const items: ProductoListadoVM[] = [];

    if (productosResult.isOk()) {
      items.push(...productosResult.value.map(productoToVM));
    }

    if (combosResult.isOk()) {
      items.push(...combosResult.value.map(comboToVM));
    }

    this.items.set(items);

    this.loading.set(false);
  }
}