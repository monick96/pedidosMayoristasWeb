import { signal, Injectable, computed } from '@angular/core';
import { CartItem } from '../../../domain/entities/CartItem';
import { CartCalculator } from '../../../domain/services/CartCalculator';
import { ProductoVM } from '../products/models/productoVm';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  // Signal principal del estado del carrito
  readonly items = signal<CartItem[]>([]);
  
  // Computed values (se actualizan solos)
  readonly total = computed(() => CartCalculator.calculateTotal(this.items()));
  readonly count = computed(() => CartCalculator.calculateTotalItems(this.items()));

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

  // Método para actualizar y guardar el nombre
  setClienteNombre(nombre: string) {
    this.clienteNombre.set(nombre);
    localStorage.setItem('mayorista_cliente_nombre', nombre);
  }

  //Método para cargar el nombre guardado
  private loadNameFromStorage() {
    const savedName = localStorage.getItem('mayorista_cliente_nombre');
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
        cantidad: cantidad
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
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      );
    });
    this.saveToStorage();
  }
  
  private saveToStorage() {
    // Aquí llamarímos al repositorio o useCase de guardar
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }
  
  private loadFromStorage() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.items.set(JSON.parse(data));
    }
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
}