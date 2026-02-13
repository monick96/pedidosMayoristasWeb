import { GetCombosUseCase } from './GetCombosUseCase';
import { ComboRepositorioPort } from '../ports/ComboRepositorio';
import { Combo } from '../../domain/entities/Combo';
import { ok, fail } from '../../shared/Result';

describe('GetCombosUseCase', () => {
  let useCase: GetCombosUseCase;
  let mockRepository: jasmine.SpyObj<ComboRepositorioPort>;

  beforeEach(() => {
    // Crear un mock del repositorio con Jasmine
    mockRepository = jasmine.createSpyObj('ComboRepositorioPort', ['getAll']);
    
    // Inyectar el mock en el use case
    useCase = new GetCombosUseCase(mockRepository);
  });

  describe('execute', () => {

    it('debe retornar combos con sus cálculos cuando el repositorio tiene éxito', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO001',
          descripcion: 'Combo básico',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO001-PROT001',
              cantidad: 2,
              precioUnitario: 5000,
              descripcion: 'Proteína Whey',
              pesoGramos: 1000
            }
          ],
          images: []
        }
      ];

      // Configurar el mock para retornar un Result exitoso
      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);
      
      // ✅ FIX: Verificar que isOk() antes de acceder a value
      if (result.isOk()) {
        expect(result.value).toBeDefined();
        expect(result.value.length).toBe(1);
        
        const combo = result.value[0];
        expect(combo.codigo).toBe('COMBO001');
        expect(combo.precioTotal).toBe(10000); // 2 * 5000
        expect(combo.pesoTotalGramos).toBe(2000); // 2 * 1000
        expect(combo.items).toEqual(combosDelRepo[0].items);
      }
      
      // Verificar que el repositorio fue llamado
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('debe construir la descripción correctamente con items únicos', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO_STACK',
          descripcion: 'Stack Ganancia',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_STACK-PROT001',
              cantidad: 1,
              precioUnitario: 5000,
              descripcion: 'Proteína Whey',
              pesoGramos: 1000
            },
            {
              codigoProducto: 'CREAT001',
              codigoComboProducto: 'COMBO_STACK-CREAT001',
              cantidad: 1,
              precioUnitario: 3000,
              descripcion: 'Creatina',
              pesoGramos: 500
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      if (result.isOk()) {
        const combo = result.value[0];
        expect(combo.descripcion).toBe('Combo COMBO_STACK: Proteína Whey + Creatina');
      }
    });

    it('debe manejar items con descripciones repetidas (no duplicar en descripción)', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO_DOBLE',
          descripcion: 'Doble Proteína',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_DOBLE-PROT001',
              cantidad: 2,
              precioUnitario: 5000,
              descripcion: 'Proteína Whey', // Mismo producto
              pesoGramos: 1000
            },
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_DOBLE-PROT001-2',
              cantidad: 1,
              precioUnitario: 5000,
              descripcion: 'Proteína Whey', // Repetida
              pesoGramos: 1000
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      if (result.isOk()) {
        const combo = result.value[0];
        // No debe duplicar "Proteína Whey" en la descripción
        expect(combo.descripcion).toBe('Combo COMBO_DOBLE: Proteína Whey');
      }
    });

    it('debe retornar error cuando el repositorio falla', async () => {
      // Arrange
      // ✅ FIX: Usar Error en lugar de string
      const error = new Error('Error de conexión a la base de datos');
      mockRepository.getAll.and.returnValue(
        Promise.resolve(fail(error))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFail()).toBe(true);
      
      // ✅ FIX: Verificar isFail() antes de acceder a error
      if (result.isFail()) {
        expect(result.error).toBe(error);
      }
      
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('debe manejar una lista vacía de combos', async () => {
      // Arrange
      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok([]))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);
      
      if (result.isOk()) {
        expect(result.value).toEqual([]);
        expect(result.value.length).toBe(0);
      }
    });

    it('debe procesar múltiples combos correctamente', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO001',
          descripcion: 'Combo 1',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO001-PROT001',
              cantidad: 1,
              precioUnitario: 5000,
              descripcion: 'Proteína',
              pesoGramos: 1000
            }
          ],
          images: []
        },
        {
          codigo: 'COMBO002',
          descripcion: 'Combo 2',
          items: [
            {
              codigoProducto: 'CREAT001',
              codigoComboProducto: 'COMBO002-CREAT001',
              cantidad: 2,
              precioUnitario: 3000,
              descripcion: 'Creatina',
              pesoGramos: 500
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);
      
      if (result.isOk()) {
        expect(result.value.length).toBe(2);
        
        // Verificar primer combo
        expect(result.value[0].codigo).toBe('COMBO001');
        expect(result.value[0].precioTotal).toBe(5000);
        expect(result.value[0].pesoTotalGramos).toBe(1000);
        
        // Verificar segundo combo
        expect(result.value[1].codigo).toBe('COMBO002');
        expect(result.value[1].precioTotal).toBe(6000); // 2 * 3000
        expect(result.value[1].pesoTotalGramos).toBe(1000); // 2 * 500
      }
    });

    it('debe manejar combos con items sin peso definido', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO_SIN_PESO',
          descripcion: 'Combo sin peso',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_SIN_PESO-PROT001',
              cantidad: 2,
              precioUnitario: 5000,
              descripcion: 'Proteína',
              pesoGramos: undefined // Sin peso
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);
      
      if (result.isOk()) {
        const combo = result.value[0];
        expect(combo.precioTotal).toBe(10000); // 2 * 5000
        expect(combo.pesoTotalGramos).toBe(0); // Sin peso = 0
      }
    });

    it('debe preservar todos los campos del combo original más los calculados', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO_COMPLETO',
          descripcion: 'Descripción original',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_COMPLETO-PROT001',
              cantidad: 1,
              precioUnitario: 5000,
              descripcion: 'Proteína Whey',
              pesoGramos: 1000
            }
          ],
          images: [
            { url: 'https://example.com/image.jpg', alt: 'Imagen combo' }
          ],
          precioTotal: 5000,
          porcentajeDescuento: 10,
          pesoTotalGramos: 1000
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      if (result.isOk()) {
        const combo = result.value[0];
        expect(combo.codigo).toBe('COMBO_COMPLETO');
        expect(combo.descripcion).toBe('Combo COMBO_COMPLETO: Proteína Whey');
        expect(combo.precioTotal).toBe(5000); // Calculado
        expect(combo.pesoTotalGramos).toBe(1000); // Calculado
        expect(combo.items).toBeDefined();
        expect(combo.items.length).toBe(1);
      }
    });

    it('debe manejar descripciones con caracteres especiales', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO_ESPECIAL',
          descripcion: 'Combo especial',
          items: [
            {
              codigoProducto: 'PROT001',
              codigoComboProducto: 'COMBO_ESPECIAL-PROT001',
              cantidad: 1,
              precioUnitario: 5000,
              descripcion: 'Proteína & Creatina',
              pesoGramos: 1000
            },
            {
              codigoProducto: 'BCAA001',
              codigoComboProducto: 'COMBO_ESPECIAL-BCAA001',
              cantidad: 1,
              precioUnitario: 3000,
              descripcion: 'BCAA 2:1:1',
              pesoGramos: 500
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      if (result.isOk()) {
        const combo = result.value[0];
        expect(combo.descripcion).toBe('Combo COMBO_ESPECIAL: Proteína & Creatina + BCAA 2:1:1');
      }
    });

    it('debe llamar al repositorio solo una vez por ejecución', async () => {
      // Arrange
      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok([]))
      );

      // Act
      await useCase.execute();
      await useCase.execute();

      // Assert
      expect(mockRepository.getAll).toHaveBeenCalledTimes(2);
    });

    it('debe propagar errores inesperados del repositorio', async () => {
      // Arrange
      const error = new Error('Error crítico del sistema');
      mockRepository.getAll.and.returnValue(
        Promise.resolve(fail(error))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFail()).toBe(true);
      
      if (result.isFail()) {
        expect(result.error).toBe(error);
      }
    });
  });

  describe('buildDescripcion (método privado - testing indirecto)', () => {
    
    it('debe construir descripción con formato "Combo {código}: {items unidos por +}"', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'STACK_PRO',
          descripcion: 'Original',
          items: [
            {
              codigoProducto: 'A',
              codigoComboProducto: 'STACK_PRO-A',
              cantidad: 1,
              precioUnitario: 100,
              descripcion: 'Item A',
            },
            {
              codigoProducto: 'B',
              codigoComboProducto: 'STACK_PRO-B',
              cantidad: 1,
              precioUnitario: 200,
              descripcion: 'Item B',
            },
            {
              codigoProducto: 'C',
              codigoComboProducto: 'STACK_PRO-C',
              cantidad: 1,
              precioUnitario: 300,
              descripcion: 'Item C',
            }
          ],
          images: []
        }
      ];

      mockRepository.getAll.and.returnValue(
        Promise.resolve(ok(combosDelRepo))
      );

      // Act
      const result = await useCase.execute();

      // Assert
      if (result.isOk()) {
        expect(result.value[0].descripcion).toBe('Combo STACK_PRO: Item A + Item B + Item C');
      }
    });
  });
});
