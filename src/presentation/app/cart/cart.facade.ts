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

  constructor() {
    // Al iniciar, cargamos del storage
    this.loadFromStorage();
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
        nombre: producto.descripcion,
        imagen: producto.images?.[0]?.url || '',
        precioUnitario: producto.precioFinal,
        cantidad: cantidad
      };
      
      return [...current, newItem];
    });
    
    this.saveToStorage();
  }
  
  // ... métodos removeFromCart, updateQuantity, etc.

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
}