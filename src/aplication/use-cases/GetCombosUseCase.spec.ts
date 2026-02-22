import { GetCombosUseCase } from './GetCombosUseCase';
import { ComboRepositorioPort } from '../ports/ComboRepositorio';
import { Combo } from '../../domain/entities/Combo';
import { ok, fail } from '../../shared/Result';

describe('GetCombosUseCase', () => {
  let useCase: GetCombosUseCase;
  let mockRepository: jasmine.SpyObj<ComboRepositorioPort>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('ComboRepositorioPort', ['getAll']);
    useCase = new GetCombosUseCase(mockRepository);
  });

  describe('execute', () => {

    it('debe retornar los combos tal como vienen del repositorio', async () => {
      // Arrange
      const combosDelRepo: Combo[] = [
        {
          codigo: 'COMBO001',
          descripcion: 'Combo básico',  // descripción original, sin transformar
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

      mockRepository.getAll.and.returnValue(Promise.resolve(ok(combosDelRepo)));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value.length).toBe(1);
        const combo = result.value[0];

        // Solo verificamos que lleguen los datos crudos del repo
        expect(combo.codigo).toBe('COMBO001');
        expect(combo.descripcion).toBe('Combo básico');  // sin transformar
        expect(combo.items).toEqual(combosDelRepo[0].items);
        expect(combo.images).toEqual([]);

        // El use case NO calcula precio ni peso, eso es responsabilidad del mapper
        // para probar los cálculos, testear ComboCalculador o comboToVM 
      }
    });

    it('debe retornar error cuando el repositorio falla', async () => {
      // Arrange
      const error = new Error('Error de conexión a la base de datos');
      mockRepository.getAll.and.returnValue(Promise.resolve(fail(error)));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFail()).toBe(true);

      if (result.isFail()) {
        expect(result.error).toBe(error);
      }
    });

    it('debe retornar lista vacía cuando el repositorio no tiene combos', async () => {
      // Arrange
      mockRepository.getAll.and.returnValue(Promise.resolve(ok([])));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toEqual([]);
        expect(result.value.length).toBe(0);
      }
    });

    it('debe retornar múltiples combos sin modificarlos', async () => {
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

      mockRepository.getAll.and.returnValue(Promise.resolve(ok(combosDelRepo)));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value.length).toBe(2);
        expect(result.value[0].codigo).toBe('COMBO001');
        expect(result.value[1].codigo).toBe('COMBO002');

        // ✅ Verificamos que los datos lleguen intactos, sin modificaciones
        expect(result.value[0]).toEqual(combosDelRepo[0]);
        expect(result.value[1]).toEqual(combosDelRepo[1]);
      }
    });

    it('debe llamar al repositorio exactamente una vez por ejecución', async () => {
      // Arrange
      mockRepository.getAll.and.returnValue(Promise.resolve(ok([])));

      // Act
      await useCase.execute();
      await useCase.execute();

      // Assert — cada llamada a execute() dispara una sola consulta al repo
      expect(mockRepository.getAll).toHaveBeenCalledTimes(2);
    });

    it('debe propagar cualquier error que venga del repositorio', async () => {
      // Arrange
      const error = new Error('Error crítico del sistema');
      mockRepository.getAll.and.returnValue(Promise.resolve(fail(error)));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFail()).toBe(true);

      if (result.isFail()) {
        expect(result.error).toBe(error);
      }
    });

  });
});
