import { ComboCalculador } from "./ComboCalculador";
import { Combo } from '../entities/Combo';

describe('ComboCalculador', () => {
  const mockCombo: any = {
    items: [
      { precioUnitario: 100, cantidad: 2, pesoGramos: 500 }, // Total: 200, Peso: 1000
      { precioUnitario: 50, cantidad: 1, pesoGramos: 100 }   // Total: 50,  Peso: 100
    ]
  };


  it('debería calcular el precio total multiplicando cantidades', () => {
    const total = ComboCalculador.precioTotal(mockCombo);
    expect(total).toBe(250);
  });


  it('debería calcular el peso total en gramos', () => {
    const peso = ComboCalculador.pesoTotalGramos(mockCombo);
    expect(peso).toBe(1100);
  });
  
  // Helper para crear combos de prueba
  function crearComboMock(overrides?: Partial<Combo>): Combo {
    return {
      codigo: 'COMBO001',
      descripcion: 'Combo Test',
      items: [],
      images: [],
      ...overrides
    };
  }

  describe('precioTotal', () => {

    it('debe calcular correctamente el precio total de un combo con un solo item', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Proteína Whey',
            pesoGramos: 1000
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      // 2 unidades * $50 = $100
      expect(resultado).toBe(100);
    });

    it('debe calcular correctamente el precio total con múltiples items', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Proteína Whey'
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 1,
            precioUnitario: 30,
            descripcion: 'Creatina'
          },
          {
            codigoProducto: 'PROD003',
            codigoComboProducto: 'COMBO001-PROD003',
            cantidad: 3,
            precioUnitario: 20,
            descripcion: 'Barras Proteicas'
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      // (2 * 50) + (1 * 30) + (3 * 20) = 100 + 30 + 60 = 190
      expect(resultado).toBe(190);
    });

    it('debe retornar 0 cuando el combo no tiene items', () => {
      // Arrange
      const combo = crearComboMock({
        items: []
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      expect(resultado).toBe(0);
    });

    it('debe manejar correctamente items con cantidad 0', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 0,
            precioUnitario: 100,
            descripcion: 'Proteína'
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Creatina'
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      // (0 * 100) + (2 * 50) = 0 + 100 = 100
      expect(resultado).toBe(100);
    });

    it('debe manejar correctamente precios decimales', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 3,
            precioUnitario: 33.33,
            descripcion: 'Producto A'
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 2,
            precioUnitario: 25.50,
            descripcion: 'Producto B'
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      // (3 * 33.33) + (2 * 25.50) = 99.99 + 51 = 150.99
      expect(resultado).toBeCloseTo(150.99, 2);
    });

    it('debe sumar correctamente grandes cantidades de items', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 100,
            precioUnitario: 10,
            descripcion: 'Item masivo'
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.precioTotal(combo);

      // Assert
      expect(resultado).toBe(1000);
    });
  });

  describe('pesoTotalGramos', () => {

    it('debe calcular correctamente el peso total con un solo item', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Proteína',
            pesoGramos: 1000 // 1kg
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // 2 unidades * 1000g = 2000g
      expect(resultado).toBe(2000);
    });

    it('debe calcular correctamente el peso total con múltiples items', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Proteína',
            pesoGramos: 1000
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 3,
            precioUnitario: 30,
            descripcion: 'Creatina',
            pesoGramos: 300
          },
          {
            codigoProducto: 'PROD003',
            codigoComboProducto: 'COMBO001-PROD003',
            cantidad: 5,
            precioUnitario: 20,
            descripcion: 'Barras',
            pesoGramos: 60
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // (2 * 1000) + (3 * 300) + (5 * 60) = 2000 + 900 + 300 = 3200
      expect(resultado).toBe(3200);
    });

    it('debe retornar 0 cuando el combo no tiene items', () => {
      // Arrange
      const combo = crearComboMock({
        items: []
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      expect(resultado).toBe(0);
    });

    it('debe manejar items sin peso (pesoGramos undefined)', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Producto sin peso',
            pesoGramos: undefined // Sin peso definido
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 1,
            precioUnitario: 30,
            descripcion: 'Producto con peso',
            pesoGramos: 500
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // (2 * 0) + (1 * 500) = 500
      expect(resultado).toBe(500);
    });

    it('debe manejar items con peso null', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 3,
            precioUnitario: 50,
            descripcion: 'Producto',
            pesoGramos: null as any
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      expect(resultado).toBe(0);
    });

    it('debe manejar una mezcla de items con y sin peso', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 2,
            precioUnitario: 50,
            descripcion: 'Con peso',
            pesoGramos: 1000
          },
          {
            codigoProducto: 'PROD002',
            codigoComboProducto: 'COMBO001-PROD002',
            cantidad: 1,
            precioUnitario: 30,
            descripcion: 'Sin peso',
            pesoGramos: undefined
          },
          {
            codigoProducto: 'PROD003',
            codigoComboProducto: 'COMBO001-PROD003',
            cantidad: 3,
            precioUnitario: 20,
            descripcion: 'Con peso',
            pesoGramos: 200
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // (2 * 1000) + (1 * 0) + (3 * 200) = 2000 + 0 + 600 = 2600
      expect(resultado).toBe(2600);
    });

    it('debe manejar pesos decimales correctamente', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 3,
            precioUnitario: 50,
            descripcion: 'Producto',
            pesoGramos: 333.33
          }
        ]
      });

      // Act
      const resultado = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // 3 * 333.33 = 999.99
      expect(resultado).toBeCloseTo(999.99, 2);
    });
  });

  describe('Edge cases combinados', () => {

    it('debe calcular correctamente precio y peso para un combo complejo', () => {
      // Arrange
      const combo = crearComboMock({
        codigo: 'COMBO_MEGA',
        descripcion: 'Combo Mega Ganancia',
        items: [
          {
            codigoProducto: 'PROT001',
            codigoComboProducto: 'COMBO_MEGA-PROT001',
            cantidad: 2,
            precioUnitario: 5000,
            descripcion: 'Proteína Premium',
            pesoGramos: 2000
          },
          {
            codigoProducto: 'CREAT001',
            codigoComboProducto: 'COMBO_MEGA-CREAT001',
            cantidad: 1,
            precioUnitario: 3000,
            descripcion: 'Creatina Monohidrato',
            pesoGramos: 500
          },
          {
            codigoProducto: 'BCAA001',
            codigoComboProducto: 'COMBO_MEGA-BCAA001',
            cantidad: 3,
            precioUnitario: 2500,
            descripcion: 'BCAA 2:1:1',
            pesoGramos: 300
          }
        ]
      });

      // Act
      const precioTotal = ComboCalculador.precioTotal(combo);
      const pesoTotal = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      // Precio: (2 * 5000) + (1 * 3000) + (3 * 2500) = 10000 + 3000 + 7500 = 20500
      expect(precioTotal).toBe(20500);
      
      // Peso: (2 * 2000) + (1 * 500) + (3 * 300) = 4000 + 500 + 900 = 5400
      expect(pesoTotal).toBe(5400);
    });

    it('debe manejar combo con items de cantidad 0', () => {
      // Arrange
      const combo = crearComboMock({
        items: [
          {
            codigoProducto: 'PROD001',
            codigoComboProducto: 'COMBO001-PROD001',
            cantidad: 0,
            precioUnitario: 1000,
            descripcion: 'Sin stock',
            pesoGramos: 500
          }
        ]
      });

      // Act
      const precioTotal = ComboCalculador.precioTotal(combo);
      const pesoTotal = ComboCalculador.pesoTotalGramos(combo);

      // Assert
      expect(precioTotal).toBe(0);
      expect(pesoTotal).toBe(0);
    });
  });
});
