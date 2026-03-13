import { TestBed } from '@angular/core/testing';
import { CartFacade } from './cart.facade';
import { AlertService } from '../shared/services/alert-service';
import { ConfigFacade } from './Config.facade';
import { ProductFacade } from './product.facade';
import { STORAGE_KEYS } from '../../../constantes/constantes';


describe('CartFacade', () => {
  let facade: CartFacade;

  const alertMock = {
    confirm: jasmine.createSpy('confirm'),
  };

  const configMock = {
    minimoGeneral: jasmine.createSpy('minimoGeneral').and.returnValue(1000),
    minimoConCombos: jasmine.createSpy('minimoConCombos').and.returnValue(2000),
    escalas: jasmine.createSpy('escalas').and.returnValue([
        { nivel: 'nivel 1', nombre: 'Precio 1', montoMinimo: 0 },
        { nivel: 'nivel 2', nombre: 'Precio 2', montoMinimo: 5000 },
        { nivel: 'nivel 3', nombre: 'Precio 3', montoMinimo: 10000 },
    ]),
    // Agregamos este para que no te falle el test de WhatsApp después
    telefonoWhatsapp: jasmine.createSpy('telefonoWhatsapp').and.returnValue('5491122334455')
   };

  const productMock = {
   itemsDictionary: jasmine.createSpy('itemsDictionary').and.returnValue({})
  };

  beforeEach(() => {
    configMock.minimoGeneral.and.returnValue(1000);
    configMock.minimoConCombos.and.returnValue(2000);
    // Evitar que el constructor cargue datos reales
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === STORAGE_KEYS.CLIENT_NAME) return null;
      return null;
    });

    // Para poder verificar persistencia/clear sin saber el key exacto
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();
    spyOn(localStorage, 'clear').and.stub();

    TestBed.configureTestingModule({
      providers: [
        CartFacade,
        { provide: AlertService, useValue: alertMock },
        { provide: ConfigFacade, useValue: configMock },
        { provide: ProductFacade, useValue: productMock },
      ],
    });

    facade = TestBed.inject(CartFacade);
  });


  it('arranca con items vacíos si no hay nada en storage', () => {
    const facade = TestBed.inject(CartFacade);
    expect(facade.items()).toEqual([]);
  });

  it('addToCart agrega nuevo item y guarda', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 2);

    expect(facade.items().length).toBe(1);
    expect(facade.items()[0].productoId).toBe('P1');
    expect(facade.items()[0].cantidad).toBe(2);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('addToCart incrementa si ya existe', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 1);
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 3);

    expect(facade.items().length).toBe(1);
    expect(facade.items()[0].cantidad).toBe(4);
  });

  it('incrementQuantity suma 1 y guarda', () => {
     facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 1);

    // reset para medir SOLO el guardado del increment
    (localStorage.setItem as jasmine.Spy).calls.reset();

    facade.incrementQuantity('P1');

    expect(facade.items()[0].cantidad).toBe(2);

    //el repo real guarda en STORAGE_KEYS.CART
    expect(localStorage.setItem).toHaveBeenCalled();
    const [key, value] = (localStorage.setItem as jasmine.Spy).calls.mostRecent().args;
    expect(key).toBe(STORAGE_KEYS.CART);
    expect(JSON.parse(value as string)[0].cantidad).toBe(2);
  });

  it('decreaseQuantity resta si >1, y elimina si ==1', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 2);
    facade.decreaseQuantity('P1');
    expect(facade.items()[0].cantidad).toBe(1);

    facade.decreaseQuantity('P1');
    expect(facade.items().length).toBe(0);
  });

  it('setQuantity <=0 elimina item', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 2);
    facade.setQuantity('P1', 0);
    expect(facade.items().length).toBe(0);
  });

  it('cantidadesMap y count son consistentes', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 2);
    facade.addToCart({ codigo: 'P2', tipo: 'PRODUCTO', descripcion: 'Prod2', precioFinal: 100 } as any, 3);

    expect(facade.cantidadesMap()).toEqual({ P1: 2, P2: 3 });
    expect(facade.count()).toBe(5);
  });

  it('minimoRequerido usa minimoGeneral si no hay combos', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 1);
    expect(facade.tieneCombos()).toBeFalse();
    expect(facade.minimoRequerido()).toBe(1000);
  });

  it('minimoRequerido usa minimoConCombos si hay combo', () => {
    facade.addToCart({ codigo: 'C1', tipo: 'COMBO', descripcion: 'Combo', precioFinal: 100 } as any, 1);
    expect(facade.tieneCombos()).toBeTrue();
    expect(facade.minimoRequerido()).toBe(2000);
  });

  it('faltaParaMinimo nunca es negativa', () => {
    // total nominal = 6000
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 6000 } as any, 1);
    expect(facade.faltaParaMinimo()).toBe(0);
  });

  it('escalaActiva elige la escala correcta por subtotal nominal', () => {
    // subtotal nominal = 7000 => nivel 2
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 7000 } as any, 1);
    expect(facade.escalaActiva().nivel).toBe('nivel 2');
  });

  it('clearCart limpia items solo si confirm acepta', () => {
    facade.addToCart({ codigo: 'P1', tipo: 'PRODUCTO', descripcion: 'Prod', precioFinal: 100 } as any, 1);
    expect(facade.items().length).toBe(1);

    // Simular confirm aceptado: el callback 2do parámetro se ejecuta
    alertMock.confirm.and.callFake((_msg: string, onConfirm: () => void) => onConfirm());

    facade.clearCart();
    expect(facade.items().length).toBe(0);
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.CART);
  });

  it('detecta correctamente cuando hay productos agotados en el carrito', () => {
    //Agregamos un producto
    facade.addToCart({ codigo: 'P1', descripcion: 'Prod', precioFinal: 100 } as any, 1);
    
    // Mockeamos que el diccionario de productos dice que P1 NO tiene stock
    (productMock.itemsDictionary as jasmine.Spy).and.returnValue({
        'P1': { codigo: 'P1', estaDisponible: false }
    });

    // Verificamos que el carrito se de cuenta
    expect(facade.hayProductosAgotados()).toBeTrue();
    expect(facade.itemsConPrecio()[0].estaDisponible).toBeFalse();
  });

  it('debe persistir el nombre del cliente/local', () => {
    facade.setClienteNombre('Mi Tienda Pepe');
    expect(facade.clienteNombre()).toBe('Mi Tienda Pepe');
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.CLIENT_NAME, 'Mi Tienda Pepe');
  });

  it('aplica precios de Escala 2 cuando el subtotal nominal supera el mínimo', () => {
    // Configuramos un producto que tiene dos precios
    const productoConEscalas = {
        codigo: 'P1',
        descripcion: 'Proteína',
        precioFinal: 1000, // Precio Nivel 1
        preciosPorEscala: [
        { nivel: 'nivel 1', precio: 1000 },
        { nivel: 'nivel 2', precio: 800 } // Más barato
        ],
        tipo: 'PRODUCTO'
    };

    // Mockeamos el ConfigFacade para que la Escala 2 empiece a los $5000
    (configMock.escalas as jasmine.Spy).and.returnValue([
        { nivel: 'nivel 1', nombre: 'Base', montoMinimo: 0 },
        { nivel: 'nivel 2', nombre: 'VIP', montoMinimo: 5000 }
    ]);

    // Agregamos 6 unidades (6 x $1000 = $6000 nominal)
    // Esto debería activarnos el precio de $800
    facade.addToCart(productoConEscalas as any, 6);

    // Verificaciones
    expect(facade.escalaActiva().nivel).toBe('nivel 2'); // salto de escala?
    expect(facade.total()).toBe(4800); // 6 unidades x $800 = $4800?
    expect(facade.total()).toBeLessThan(facade.subtotalNominal()); // El total debe ser menor al nominal
  });

  it('no debe superar la Escala 3 aunque el total supere el minimo para nivel 4(por ahora)', () => {
    // 1. Configuramos 4 escalas en el mock
    (configMock.escalas as jasmine.Spy).and.returnValue([
        { nivel: 'nivel 1', montoMinimo: 0 },
        { nivel: 'nivel 2', montoMinimo: 5000 },
        { nivel: 'nivel 3', montoMinimo: 10000 },
        { nivel: 'nivel 4', montoMinimo: 50000 } // Esta debe ser ignorada
    ]);

    // Agregamos un producto con un total nominal de $100.000 
    // (Supera ampliamente el Nivel 4)
    facade.addToCart({ 
        codigo: 'P1', 
        precioFinal: 100000, 
        tipo: 'PRODUCTO' 
    } as any, 1);

    // Verificamos que la escala activa SE QUEDE en el nivel 3
    expect(facade.escalaActiva().nivel).toBe('nivel 3');
    expect(facade.escalaActiva().nivel).not.toBe('nivel 4');
  });

  it('debe marcar como NO disponible un producto que está en el carrito pero ya no existe en el catálogo', () => {
    // Agregamos un producto al carrito
    // Usamos un objeto simple que simule un CartItem
    facade.addToCart({ 
        codigo: 'P-ELIMINADO', 
        descripcion: 'Producto Viejo', 
        precioFinal: 100,
        tipo: 'PRODUCTO' 
    } as any, 1);

    // Simulamos que el ProductFacade NO tiene este producto en su diccionario
    // (Porque no esta en la base de datos)
    (productMock.itemsDictionary as jasmine.Spy).and.returnValue({
        // El diccionario está vacío o tiene otros productos, pero NO el 'P-ELIMINADO'
        'P-OTRO': { codigo: 'P-OTRO', estaDisponible: true } 
    });

    //Verificamos la lógica del Facade
    const itemsCalculados = facade.itemsConPrecio();
    const itemFantasma = itemsCalculados.find(i => i.productoId === 'P-ELIMINADO');

    // El item debe existir en la lista del carrito...
    expect(itemFantasma).toBeDefined();
    // ...pero debe estar marcado como NO disponible para que no se pueda comprar
    expect(itemFantasma?.estaDisponible).toBeFalse();
    // Y el signal global debe avisar que hay problemas
    expect(facade.hayProductosAgotados()).toBeTrue();
  });

  it('debe resetear el mínimo requerido al eliminar el último combo del carrito', () => {
    //Configuramos los montos en el mock de configuración
    configMock.minimoGeneral.and.returnValue(290000);
    configMock.minimoConCombos.and.returnValue(490000);

    // Agregamos un producto normal
    facade.addToCart({ 
        codigo: 'PROD-1', 
        tipo: 'PRODUCTO', 
        descripcion: 'Proteína', 
        precioFinal: 10000 
    } as any);

    // Verificamos que el mínimo sea el general
    expect(facade.tieneCombos()).toBeFalse();
    expect(facade.minimoRequerido()).toBe(290000);

    // 3. Agregamos un combo
    facade.addToCart({ 
        codigo: 'COMBO-1', 
        tipo: 'COMBO', 
        descripcion: 'Pack Gym', 
        precioFinal: 50000 
    } as any);

    // Verificamos que el mínimo subió
    expect(facade.tieneCombos()).toBeTrue();
    expect(facade.minimoRequerido()).toBe(490000);

    //Eliminamos el combo
    facade.removeItem('COMBO-1');

    // Verificación final:volvio el minimo sin combo?
    expect(facade.tieneCombos()).toBeFalse();
    expect(facade.minimoRequerido()).toBe(290000);
    expect(facade.items().length).toBe(1);
  });

  it('setQuantity debe proteger el carrito de valores negativos y letras/NaN', () => {
    
    facade.addToCart({ 
      codigo: 'PROD-TRAMPA', 
      tipo: 'PRODUCTO', 
      precioFinal: 1000 
    } as any, 2);

    expect(facade.items()[0].cantidad).toBe(2);

    // Números negativos ---
    facade.setQuantity('PROD-TRAMPA', -5);
    expect(facade.items().length).toBe(0); 

    // Volvemos a agregar el producto 
    facade.addToCart({ codigo: 'PROD-TRAMPA', tipo: 'PRODUCTO', precioFinal: 1000 } as any, 2);

    //  Letras o valores inválidos (NaN) ---
    facade.setQuantity('PROD-TRAMPA', NaN);
    
    const cantidadFinal = facade.items()[0]?.cantidad;
    expect(Number.isNaN(cantidadFinal)).toBeFalse(); 
    expect(facade.items().length).toBe(0);
  });
});