import { Producto } from "../entities/Producto";
import { MayoristaPrecio } from "../value-objects/PrecioMayorista";
import { CalculadorPrecioProducto } from "./CalculadorPrecioProducto";

describe('CalculadorPrecioProducto', () => {

    it('calcularPrecioFinal debería aplicar el descuento del producto si existe no el porcentaje en precioMayorista', () => {
        const productoMock: Partial<Producto> = {
            precioBase: 100,
            porcentajeDescuento: 10, // Descuento especial
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 30 }]
        };

        const precio = CalculadorPrecioProducto.calcularPrecioFinal(productoMock as Producto);

        // 100 + 10% = 110 (Ignora el 30% del mayorista porque hay promo)

        expect(precio).toBe(110);

    });

    it('calcularPrecioFinal debería usar el porcentaje del mayorista si el descuento del producto es 0', () => {
        const productoSinPromo: any = {
            precioBase: 1000,
            porcentajeDescuento: 0,
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 20 }]
        };
        const precio = CalculadorPrecioProducto.calcularPrecioFinal(productoSinPromo);
        expect(precio).toBe(1200); // 1000 + 20%
    });

    it('calcularPrecioNormal no debería verse afectado por el descuento del producto', () => {
        const productoConPromo: any = {
            precioBase: 1000,
            porcentajeDescuento: 10,
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 30 }]
        };
        const precioNormal = CalculadorPrecioProducto.calcularPrecioNormal(productoConPromo);
        expect(precioNormal).toBe(1300); // Debería ignorar el 10 y usar el 30
    });

  
  // Helper function para crear productos de prueba
  function crearProductoMock(overrides?: Partial<Producto>): Producto {
    return {
      codigo: 'PROD001',
      descripcion: 'Producto Test',
      precioBase: 100,
      porcentajeDescuento: 0,
      marca: { nombre: 'Test Brand' },
      pesoGramos: 500,
      images: [],
      preciosMayorista: [
        { tipo: 'MAYORISTA_1', porcentaje: 20 },
        { tipo: 'MAYORISTA_2', porcentaje: 25 }
      ],
      ...overrides
    } as Producto;
  }

  describe('calcularPrecioMayorista', () => {
    
    it('debe calcular correctamente el precio cuando el producto NO tiene descuento', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: 0
      });
      
      const mayorista: MayoristaPrecio = {
        tipo: 'MAYORISTA_1',
        porcentaje: 20
      };
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioMayorista(
        producto, 
        mayorista
      );
      
      // Assert
      // Precio base 100 + 20% = 120
      expect(resultado).toBe(120);
    });

    it('debe usar el descuento del producto cuando existe y es mayor que 0', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: 15 // El producto tiene su propio descuento
      });
      
      const mayorista: MayoristaPrecio = {
        tipo: 'MAYORISTA_1',
        porcentaje: 20 // Este NO debe usarse
      };
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioMayorista(
        producto, 
        mayorista
      );
      
      // Assert
      // Debe usar el 15% del producto, no el 20% del mayorista
      // 100 + (100 * 15 / 100) = 115
      expect(resultado).toBe(115);
    });

    it('debe usar el porcentaje del mayorista cuando el descuento del producto es 0', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 200,
        porcentajeDescuento: 0
      });
      
      const mayorista: MayoristaPrecio = {
        tipo: 'MAYORISTA_2',
        porcentaje: 30
      };
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioMayorista(
        producto, 
        mayorista
      );
      
      // Assert
      // 200 + (200 * 30 / 100) = 260
      expect(resultado).toBe(260);
    });

    it('debe manejar correctamente porcentajes negativos (descuentos)', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: -10 // Descuento del 10%
      });
      
      const mayorista: MayoristaPrecio = {
        tipo: 'MAYORISTA_1',
        porcentaje: 20
      };
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioMayorista(
        producto, 
        mayorista
      );
      
      // Assert
      // 100 + (100 * -10 / 100) = 90
      expect(resultado).toBe(90);
    });

    it('debe calcular correctamente con precios decimales', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 99.99,
        porcentajeDescuento: 0
      });
      
      const mayorista: MayoristaPrecio = {
        tipo: 'MAYORISTA_1',
        porcentaje: 15
      };
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioMayorista(
        producto, 
        mayorista
      );
      
      // Assert
      // 99.99 + (99.99 * 15 / 100) = 114.9885
      expect(resultado).toBeCloseTo(114.9885, 2);
    });
  });

  describe('calcularPrecioFinal', () => {
    
    it('debe calcular el precio final usando el primer mayorista de la lista', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: 0,
        preciosMayorista: [
          { tipo: 'MAYORISTA_1', porcentaje: 20 }, // Este debe usarse
          { tipo: 'MAYORISTA_2', porcentaje: 30 }
        ]
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioFinal(producto);
      
      // Assert
      // Debe usar MAYORISTA_1 (20%)
      expect(resultado).toBe(120);
    });

    it('debe respetar el descuento del producto sobre el mayorista', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 150,
        porcentajeDescuento: 10,
        preciosMayorista: [
          { tipo: 'MAYORISTA_1', porcentaje: 25 }
        ]
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioFinal(producto);
      
      // Assert
      // Debe usar el 10% del producto, no el 25% del mayorista
      // 150 + (150 * 10 / 100) = 165
      expect(resultado).toBe(165);
    });
  });

  describe('calcularPrecioNormal', () => {
    
    it('debe calcular el precio normal sin considerar el descuento del producto', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: 15, // Esto NO debe afectar
        preciosMayorista: [
          { tipo: 'MAYORISTA_1', porcentaje: 20 }
        ]
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioNormal(producto);
      
      // Assert
      // Debe usar siempre el porcentaje del mayorista
      // 100 + (100 * 20 / 100) = 120
      expect(resultado).toBe(120);
    });

    it('debe calcular usando solo el precio base y el porcentaje del mayorista', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 200,
        porcentajeDescuento: 0,
        preciosMayorista: [
          { tipo: 'MAYORISTA_1', porcentaje: 30 }
        ]
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.calcularPrecioNormal(producto);
      
      // Assert
      // 200 + (200 * 30 / 100) = 260
      expect(resultado).toBe(260);
    });
  });

  describe('tienePromocion', () => {
    
    it('debe retornar true cuando el producto tiene descuento mayor a 0', () => {
      // Arrange
      const producto = crearProductoMock({
        porcentajeDescuento: 10
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.tienePromocion(producto);
      
      // Assert
      expect(resultado).toBe(true);
    });

    it('debe retornar false cuando el descuento es 0', () => {
      // Arrange
      const producto = crearProductoMock({
        porcentajeDescuento: 0
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.tienePromocion(producto);
      
      // Assert
      expect(resultado).toBe(false);
    });

    it('debe retornar false cuando el descuento es undefined', () => {
      // Arrange
      const producto = crearProductoMock({
        porcentajeDescuento: undefined
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.tienePromocion(producto);
      
      // Assert
      expect(resultado).toBe(false);
    });

    it('debe retornar false cuando el descuento es null', () => {
      // Arrange
      const producto = crearProductoMock({
        porcentajeDescuento: null as any
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.tienePromocion(producto);
      
      // Assert
      expect(resultado).toBe(false);
    });

    it('debe retornar true incluso con descuentos negativos', () => {
      // Arrange
      const producto = crearProductoMock({
        porcentajeDescuento: -5
      });
      
      // Act
      const resultado = CalculadorPrecioProducto.tienePromocion(producto);
      
      // Assert
      expect(resultado).toBe(true);
    });
  });

  describe('Edge cases y casos límite', () => {
    
    it('debe manejar precio base en 0', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 0,
        porcentajeDescuento: 20
      });
      
      // Act
      const precioFinal = CalculadorPrecioProducto.calcularPrecioFinal(producto);
      
      // Assert
      expect(precioFinal).toBe(0);
    });

    it('debe manejar porcentajes muy grandes', () => {
      // Arrange
      const producto = crearProductoMock({
        precioBase: 100,
        porcentajeDescuento: 200 // 200% de aumento
      });
      
      // Act
      const precioFinal = CalculadorPrecioProducto.calcularPrecioFinal(producto);
      
      // Assert
      // 100 + (100 * 200 / 100) = 300
      expect(precioFinal).toBe(300);
    });
  });
});
