import { signal, Injectable, computed, inject } from '@angular/core';
import { CartItem } from '../../../domain/entities/CartItem';
import { CartCalculator } from '../../../domain/services/CartCalculator';
import { ProductoVM } from '../models/productoVm';
import { AlertService } from '../shared/services/alert-service';
import { cartRepositoryComposition } from '../../../composition/CartComposition';
import { ConfigFacade } from './Config.facade';
import { STORAGE_KEYS } from '../../../constantes/constantes';
import { ProductFacade } from './product.facade';

@Injectable({ providedIn: 'root' })
export class CartFacade {

  private alertService = inject(AlertService);
  private cartRepository = cartRepositoryComposition();
  private configFacade = inject(ConfigFacade);
  private productFacade = inject(ProductFacade);

  // Signal principal del estado del carrito
  readonly items = signal<CartItem[]>([]);
 
  //Signal de Estado Visual
  readonly isOpen = signal<boolean>(false);

  //Signal para el nombre del cliente
  readonly clienteNombre = signal<string>('');

  constructor() {

    // Al iniciar, cargamos del storage
    this.loadFromStorage();
    //cargar nombre cliente
    this.loadNameFromStorage();
  }

  // LÓGICA DE NEGOCIO COMPUTADA (Reacciona  a los cambios)
  
  // Total usando el "Precio 1" (Para calcular en qué escala estamos sin romper el sistema)
  readonly subtotalNominal = computed(() => CartCalculator.calculateTotal(this.items()));

  readonly count = computed(() => CartCalculator.calculateTotalItems(this.items()));

  // ¿Hay algún combo en el carrito?
  readonly tieneCombos = computed(() => this.items().some(i => i.tipo === 'COMBO'));

  // Define el mínimo a pagar dinámicamente
  readonly minimoRequerido = computed(() => {
    return this.tieneCombos() ? this.configFacade.minimoConCombos() : this.configFacade.minimoGeneral();
  });

  // Calcula cuánto falta para poder comprar
  readonly faltaParaMinimo = computed(() => {
    const falta = this.minimoRequerido() - this.subtotalNominal();
    return falta > 0 ? falta : 0;
  });

  // Calcula en qué escala de precios está el cliente basado en su volumen
  readonly escalaActiva = computed(() => {
    const total = this.subtotalNominal();
    // Leemos las escalas de Firebase
    const escalasFirebase = this.configFacade.escalas();
    
    // para que .nivel nunca sea 'undefined' y la app no explote.
    if (!escalasFirebase || escalasFirebase.length === 0) {
      return { nivel: "nivel 1", nombre: 'Precio 1', montoMinimo: 0 };
    }

    // Reversamos el array para chequear desde la más alta a la más baja
    const escala = [...escalasFirebase].reverse().find(e => total >= e.montoMinimo);
    return escala || escalasFirebase[0];
  });

  // Un array de items que ya tiene el precio final calculado para la vista
  readonly itemsConPrecio = computed(() => {
    const nivelActual = this.escalaActiva().nivel;
    const catalogoLive = this.productFacade.items(); // Catálogo actualizado
    const catalogoCargado = catalogoLive.length > 0;

    return this.items().map(item => {
      
      // Buscamos el precio de la escala, si no hay usamos el base
      const precioEscala = item.preciosPorEscala?.find(p => p.nivel === nivelActual);
      const precioEfectivo = precioEscala ? precioEscala.precio : item.precioUnitario;

      //  Verificamos el estado stock
      // Si el catálogo está cargando, asumimos true para que no parpadee en rojo.
      let estaDisponible = true;
      if (catalogoCargado) {
        const productoReal = catalogoLive.find(p => p.codigo === item.productoId);
        // Si lo encuentra, copiamos su estado. Si no esta en la BD, es false.
        estaDisponible = productoReal ? (productoReal.estaDisponible ?? false) : false;
      }

      // Retornamos el item clonado, pero le agregamos los datos calculados
      return {
        ...item,
        precioEfectivo: precioEfectivo,
        subtotalItem: precioEfectivo * item.cantidad,
        estaDisponible: estaDisponible
      };
    });
  });

  //  total general suma los subtotales
  readonly total = computed(() => {
    return this.itemsConPrecio().reduce((suma, item) => suma + item.subtotalItem, 0);
  });

  // COMPUTED: Nos avisa si el carrito tiene no disponibles
  readonly hayProductosAgotados = computed(() => {
    return this.itemsConPrecio().some(item => !item.estaDisponible);
  });

  // Método para actualizar y guardar el nombre
  setClienteNombre(nombre: string) {
    this.clienteNombre.set(nombre);
    localStorage.setItem(STORAGE_KEYS.CLIENT_NAME, nombre);
  }

  //Método para cargar el nombre guardado
  private loadNameFromStorage() {
    const savedName = localStorage.getItem(STORAGE_KEYS.CLIENT_NAME);
    if (savedName) {
      this.clienteNombre.set(savedName);
    }
  }

  // Métodos de control
  toggleSidebar() {
    this.isOpen.update(v => !v);
  }

  closeSidebar() {
    this.isOpen.set(false);
  }
  
  openSidebar() {
    this.isOpen.set(true);
  }

  addToCart(producto: ProductoVM, cantidad: number = 1) {
    this.items.update(current => {
      const existente = current.find(i => i.productoId === producto.codigo);
      
      if (existente) {
        // Si ya existe, sumamos cantidad (inmutable)
        return current.map(i => 
          i.productoId === producto.codigo 
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      
      // Si es nuevo, lo creamos
      const newItem: CartItem = {
        productoId: producto.codigo,
        tipo: producto.tipo,
        sabor: producto.sabor,
        nombre: producto.descripcion,
        imagen: producto.images?.[0]?.url || '',
        precioUnitario: producto.precioFinal,
        cantidad: cantidad,
        preciosPorEscala: producto.preciosPorEscala ,
        tienePromocion: producto.tienePromo
      };
      
      return [...current, newItem];
    });
    
    this.saveToStorage();
  }

  

  // Solo busca por ID y suma 1. No necesita el objeto entero.
  incrementQuantity(productoId: string) {
    this.items.update(current => {
      return current.map(i => 
        i.productoId === productoId 
          ? { ...i, cantidad: i.cantidad + 1}
          : i
      );
    });
    this.saveToStorage();
  }

  // Método para restar cantidad
  decreaseQuantity(productoId: string) {
    this.items.update(current => {
      const existing = current.find(i => i.productoId === productoId);
      
      if (!existing) return current; // Si no existe, no hacemos nada

      if (existing.cantidad > 1) {
        // Si hay más de 1, restamos
        return current.map(i => 
          i.productoId === productoId 
            ? { ...i, cantidad: i.cantidad - 1 }
            : i
        );
      } else {
        // Si es 1 y restamos, lo eliminamos del carrito
        return current.filter(i => i.productoId !== productoId);
      }
    });
    
    this.saveToStorage();
  }

  //establecer una cantidad exacta desde un input
  setQuantity(productoId: string, cantidad: number) {
    // Si escribe 0 o borra el input, dejamos producto con cantidad 1
    if (isNaN(cantidad) || cantidad <= 0) {
      this.removeItem(productoId);
      return;
    }

    this.items.update(current => {
      return current.map(i => 
        i.productoId === productoId 
          ? { ...i, cantidad: cantidad } // Actualizamos a la cantidad exacta
          : i
      );
    });
    
    this.saveToStorage();
  }

  //Eliminar un producto específico completamente
  removeItem(productoId: string) {
    this.items.update(current => current.filter(i => i.productoId !== productoId));
    this.saveToStorage();
  }

  // cantidad en carrito
  readonly cantidadesMap = computed(() => {
    return this.items().reduce((map, item) => {
      map[item.productoId] = item.cantidad;
      return map;
    }, {} as Record<string, number>);
  });
  
  //metodos refactorizados para usar el repositorio en lugar del localStorage directo
  loadFromStorage() {
    const result = this.cartRepository.load();
    if (result.isOk()) {
      this.items.set(result.value);
    } else {
      console.error('Error al cargar carrito:', result.error);
    }
  }

  saveToStorage() {
    const result = this.cartRepository.save(this.items());
    if (result.isFail()) {
      console.error('No se pudo guardar el carrito:', result.error);
    }
  }

  clearCart() {
    this.alertService.confirm('¿Estás seguro de que deseas vaciar todo el pedido?', () => {
      this.items.set([]); // Limpia la memoria UI
      
      const result = this.cartRepository.clear(); // Limpia la cart storage
      if (result.isFail()) {
        console.error('Error al limpiar el storage:', result.error);
      }
    });
  }

}