import { signal, Injectable, computed } from '@angular/core';
import { Producto } from '../../../domain/entities/Producto';
import { productComposition } from '../../../composition/ProductoComposition';
import { ProductoVM } from './models/productoVm';
import { productoToVM } from './mappers/productoMapper';
import { ProductoListadoVM } from './models/productoListadoVm';
import { comboComposition } from '../../../composition/ComboComposition';
import { comboToVM } from './mappers/comboMapper';
import { PRODUCTO } from './models/tipoProducto';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly getProductsUseCase = productComposition();

  private readonly getCombosUseCase = comboComposition();

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

  // Método para alternar los filtros
 /* toggleNews() {
    this.showOnlyNews.update(v => !v);
    if (this.showOnlyNews()) this.showOnlyCombos.set(false); 
  }*/

  /*toggleCombos() {
    this.showOnlyCombos.update(v => !v);
    if (this.showOnlyCombos()) {
      this.showOnlyNews.set(false);
      
    }
  }*/

  // Extrae marcas únicas de los items cargados(ambos tipos tienen marca)
  readonly marcasDisponibles = computed(() => {
    const todasLasMarcas = this.items()
      .map(item => item.marcaId)
      .filter((m): m is string => !!m);

    return [...new Set(todasLasMarcas)];
  });

  /*selectBrand(marca: string | null) {
    this.selectedBrand.set(marca);
  }*/

  selectBrand(marca: string | null) {
    this.selectedBrand.set(marca);
    if (marca) {
      this.showOnlyNews.set(false);
      this.showOnlyCombos.set(false);
    }
  }

  toggleNews() {
    const newValue = !this.showOnlyNews();
    this.showOnlyNews.set(newValue);
    if (newValue) {
      this.selectedBrand.set(null);
      this.showOnlyCombos.set(false);
    }
  }

  toggleCombos() {
    const newValue = !this.showOnlyCombos();
    this.showOnlyCombos.set(newValue);
    if (newValue) {
      this.selectedBrand.set(null);
      this.showOnlyNews.set(false);
    }
  }

  activateNews() {
    this.showOnlyNews.set(true);
    this.showOnlyCombos.set(false);
    this.selectedBrand.set(null);
  }

  activateCombos() {
    this.showOnlyCombos.set(true);
    this.showOnlyNews.set(false);
    this.selectedBrand.set(null);
  }

  resetFilters() {
    this.showOnlyNews.set(false);
    this.showOnlyCombos.set(false);
    this.selectedBrand.set(null);
  }

  // para el class.active de "Todos"
  isAllMode() {
    return this.selectedBrand() === null && !this.showOnlyNews() && !this.showOnlyCombos();
  }

  //Creamos un 'computed' que se actualiza solo cuando cambia items o filterText
  
  /*readonly filteredItems = computed(() => {
    const query = this.filterText().toLowerCase().trim();
    const brand = this.selectedBrand();
    const onlyNews = this.showOnlyNews();
    const onlyCombos = this.showOnlyCombos();
    const allItems = this.items();

    return allItems.filter(item => {
      // Filtro de Combos
      if (onlyCombos && item.tipo !== 'COMBO') return false;

      // Filtro de Novedades (Solo aplica a Productos, a menos que el Combo también tenga esa propiedad)
      if (onlyNews && (item.tipo !== 'PRODUCTO' || !(item as any).esNovedad)) return false;

      // Filtro de Marca (Solo si no estamos filtrando solo combos)
      if (!onlyCombos && brand && item.marcaId !== brand) return false;

      // Filtro de Texto (ej: Star Choco)
      if (!query) return true;
      //const tokens = query.split(' ').filter(t => t.length > 0);
      //const superString = `${item.descripcion} ${item.titulo || ''} ${item.marcaId || ''}`.toLowerCase();

      // Tokenización (Star Choco)
      const palabras = query.split(' ').filter(p => p.length > 0);

      // Creamos un string con todo, asegurando que no haya undefined
      const desc = (item.descripcion || '').toLowerCase();
      const marc = (item.marcaId || '').toLowerCase();
      const sab = (item.tipo === PRODUCTO) ? (item as ProductoVM).sabor?.toLowerCase() || '' : '';

      const superTexto = `${desc} ${marc} ${sab}`;
      
      return palabras.every(p => superTexto.includes(p));
    });
  });*/
  
  readonly filteredItems = computed(() => {
    const query = this.filterText().toLowerCase().trim();
    const brand = this.selectedBrand();
    const onlyNews = this.showOnlyNews();
    const onlyCombos = this.showOnlyCombos();
    const allItems = this.items();

    return allItems.filter(item => {
      // 1. FILTROS DE BOTONES (Mutuamente excluyentes)
      // Si hay marca, filtramos por marca
      if (brand && item.marcaId !== brand) return false;
      
      // Si hay novedades, filtramos por esNovedad
      if (onlyNews && !item.esNovedad) return false;
      
      // Si hay combos, filtramos por tipo
      if (onlyCombos && item.tipo !== 'COMBO') return false;

      // 2. FILTRO DE TEXTO (Siempre combina con el botón activo)
      if (!query) return true;

      const palabras = query.split(' ').filter(p => p.length > 0);
      const desc = (item.descripcion || '').toLowerCase();
      const marc = (item.marcaId || '').toLowerCase();
      const sab = (item.tipo === PRODUCTO) ? (item as ProductoVM).sabor?.toLowerCase() || '' : '';

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