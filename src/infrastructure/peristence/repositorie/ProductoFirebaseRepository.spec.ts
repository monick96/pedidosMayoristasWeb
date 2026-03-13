import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ProductoFirebaseRepository } from './ProductoFirebaseRepository';
import { STORAGE_KEYS, APP_CONFIG } from '../../../constantes/constantes';

describe('ProductoFirebaseRepository', () => {
  let repository: ProductoFirebaseRepository;
  let firestoreMock: any;

  beforeEach(() => {
    // Creamos un mock mínimo de Firestore
    //Mock de Firestore para que las utilidades de Firebase no fallen
    firestoreMock = {
      type: 'firestore',
      getFirestore: () => ({})
    };

    // Limpiamos el localStorage antes de cada test para no tener "basura" de otros tests
    localStorage.clear();

    spyOn(console, 'log');

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: firestoreMock }
      ]
    });

    // Inyectamos el repositorio usando el mock
    repository = new ProductoFirebaseRepository(TestBed.inject(Firestore));
  });

  it('debe limpiar la caché local si la versión guardada es diferente a la versión actual de la app', async () => {
    // Versión vieja en el "navegador" del test
    const VERSION_VIEJA = '1.0.0';
    const VERSION_ACTUAL = APP_CONFIG.CATALOGO_VERSION; // '1.0.1'

    localStorage.setItem(STORAGE_KEYS.PRODUCTOS_VERSION, VERSION_VIEJA);
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS_CACHE, JSON.stringify([{ codigo: 'P1' }]));
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS_FECHA, '123456789');

    //ejecutamos el método que dispara la lógica de verificación
    // Al llamar a getAll, el repositorio revisa las versiones
    // intentará llamar a collection() y fallará, 
    // usamos un try/catch o simplemente verificamos que la limpieza ocurrió primero.
    try {
      await repository.getAll();
    } catch (e) {
      // Ignoramos el error de Firebase porque la limpieza de caché ocurre ANTES
    };

    // Verificaciones
    // La versión vieja debe haber sido borrada y reemplazada por la nueva
    expect(localStorage.getItem(STORAGE_KEYS.PRODUCTOS_VERSION)).toBe(VERSION_ACTUAL);

    // Los datos viejos (caché y fecha) deben haber sido eliminados antes de la nueva carga
    // después de borrar, el repo guarda los nuevos datos si Firebase responde.
    // solo validamos que se detectó el cambio de versión.
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/Nueva versión detectada/));
  });

});