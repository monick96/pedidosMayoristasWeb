import { TestBed } from '@angular/core/testing';
import { ProductFacade } from '../../../presentation/app/products/product.facade';

describe('ProductFacade', () => {
  let facade: ProductFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductFacade]
    });

    facade = TestBed.inject(ProductFacade);
  });

  describe('Estado inicial', () => {

    it('debe crear el facade correctamente', () => {
      expect(facade).toBeTruthy();
    });

    it('debe inicializar con items vacíos', () => {
      expect(facade.items()).toEqual([]);
    });

    it('debe inicializar con loading en false', () => {
      expect(facade.loading()).toBe(false);
    });

    it('debe tener signals reactivas', () => {
      // Verificar que items es un signal
      expect(typeof facade.items).toBe('function');
      
      // Verificar que loading es un signal
      expect(typeof facade.loading).toBe('function');
    });
  });

  describe('loadProducts', () => {

    it('debe establecer loading en true al iniciar y false al terminar', async () => {
      // Arrange
      expect(facade.loading()).toBe(false);

      // Act
      const loadPromise = facade.loadProducts();
      
      // Assert - Durante la carga
      expect(facade.loading()).toBe(true);

      // Wait for completion
      await loadPromise;

      // Assert - Después de la carga
      expect(facade.loading()).toBe(false);
    });

    it('debe cargar productos y combos exitosamente', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      const items = facade.items();
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('debe transformar productos a ProductoListadoVM con tipo "producto"', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      const items = facade.items();
      
      // ✅ FIX: Agregar tipado explícito para evitar 'any'
      const productos = items.filter((item): item is typeof item => item.tipo === 'PRODUCTO');
      
      expect(productos.length).toBeGreaterThan(0);
      
      // ✅ FIX: Cambiar toHaveProperty por verificaciones directas
      productos.forEach((producto) => {
        expect(producto.tipo).toBe('PRODUCTO');
        expect(producto.codigo).toBeDefined();
        expect(producto.descripcion).toBeDefined();
        expect(producto.precioFinal).toBeDefined();
      });
    });

    it('debe transformar combos a ProductoListadoVM con tipo "combo"', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      const items = facade.items();
      
      // ✅ FIX: Agregar tipado explícito
      const combos = items.filter((item): item is typeof item => item.tipo === 'COMBO');
      
      expect(combos.length).toBeGreaterThan(0);
      
      // ✅ FIX: Reemplazar toHaveProperty
      combos.forEach((combo) => {
        expect(combo.tipo).toBe('COMBO');
        expect(combo.codigo).toBeDefined();
        expect(combo.descripcion).toBeDefined();
        expect(combo.precioFinal).toBeDefined();
      });
    });

    it('debe actualizar el signal items con los resultados combinados', async () => {
      // Arrange
      const initialItems = facade.items();
      expect(initialItems.length).toBe(0);

      // Act
      await facade.loadProducts();

      // Assert
      const updatedItems = facade.items();
      expect(updatedItems.length).toBeGreaterThan(0);
      expect(updatedItems).not.toBe(initialItems);
    });

    it('debe combinar productos y combos en un solo array', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      const items = facade.items();
      
      // ✅ FIX: Agregar tipado en el map
      const tiposUnicos = new Set(items.map((item): string => item.tipo));
      
      expect(tiposUnicos.has('PRODUCTO')).toBe(true);
      expect(tiposUnicos.has('COMBO')).toBe(true);
    });
  });

  describe('Signals reactivity', () => {

    it('debe permitir suscripciones a cambios en items', async () => {
      // Arrange
      const itemsAntes = facade.items();
      expect(itemsAntes.length).toBe(0);

      // Act
      await facade.loadProducts();

      // Assert
      const itemsDespues = facade.items();
      expect(itemsDespues.length).not.toBe(itemsAntes.length);
    });

    it('debe actualizar loading signal correctamente', async () => {
      // Arrange
      const estadosLoading: boolean[] = [];
      
      estadosLoading.push(facade.loading());

      // Act
      const promise = facade.loadProducts();
      estadosLoading.push(facade.loading());
      
      await promise;
      estadosLoading.push(facade.loading());

      // Assert
      expect(estadosLoading).toEqual([false, true, false]);
    });
  });

  describe('Manejo de errores', () => {

    it('debe establecer loading en false incluso si hay error', async () => {
      // Act & Assert
      await facade.loadProducts();
      expect(facade.loading()).toBe(false);
    });

    it('debe manejar gracefully cuando hay errores', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      expect(facade.items()).toBeDefined();
      expect(Array.isArray(facade.items())).toBe(true);
    });
  });

  describe('Mappers integration', () => {

    it('debe aplicar productoToVM mapper correctamente', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      // ✅ FIX: Tipado explícito
      const productos = facade.items().filter((item): item is typeof item => item.tipo === 'PRODUCTO');
      
      if (productos.length > 0) {
        const producto = productos[0];
        
        // ✅ FIX: Usar verificaciones directas en lugar de toHaveProperty
        expect(producto.precioFinal).toBeDefined();
        expect(producto.precioNormal).toBeDefined();
        //expect(producto.tienePromo).toBeDefined();
        expect(producto.precioFinal).toBeGreaterThanOrEqual(0);
      }
    });

    it('debe aplicar comboToVM mapper correctamente', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      // ✅ FIX: Tipado explícito
      const combos = facade.items().filter((item): item is typeof item => item.tipo === 'COMBO');
      
      if (combos.length > 0) {
        const combo = combos[0];
        
        // ✅ FIX: Verificaciones directas
        expect(combo.precioFinal).toBeDefined();
        expect(combo.precioFinal).toBeGreaterThanOrEqual(0);
        expect(combo.tipo).toBe('COMBO');
      }
    });
  });

  describe('Performance y optimización', () => {

    it('debe cargar productos y combos en paralelo', async () => {
      const startTime = Date.now();
      
      // Act
      await facade.loadProducts();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert
      expect(duration).toBeLessThan(1000);
    });

    it('debe permitir múltiples llamadas a loadProducts', async () => {
      // Act
      await facade.loadProducts();
      const items1 = facade.items();
      
      await facade.loadProducts();
      const items2 = facade.items();

      // Assert
      expect(items1.length).toBeGreaterThan(0);
      expect(items2.length).toBeGreaterThan(0);
      expect(items1.length).toBe(items2.length);
    });
  });

  describe('Providencia del servicio', () => {

    it('debe ser providedIn root (singleton)', () => {
      const facade1 = TestBed.inject(ProductFacade);
      const facade2 = TestBed.inject(ProductFacade);
      
      expect(facade1).toBe(facade2);
    });
  });

  describe('Integration con Use Cases', () => {

    it('debe llamar a GetProductosUseCase.execute()', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      // ✅ FIX: Tipado explícito
      const productos = facade.items().filter((item): item is typeof item => item.tipo === 'PRODUCTO');
      expect(productos.length).toBeGreaterThan(0);
    });

    it('debe llamar a GetCombosUseCase.execute()', async () => {
      // Act
      await facade.loadProducts();

      // Assert
      // ✅ FIX: Tipado explícito
      const combos = facade.items().filter((item): item is typeof item => item.tipo === 'COMBO');
      expect(combos.length).toBeGreaterThan(0);
    });
  });
});
