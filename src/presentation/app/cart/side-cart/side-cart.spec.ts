import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideCart } from './side-cart';

import { CartFacade } from '../../../../presentation/app/facades/cart.facade';
import { ConfigFacade } from '../../../../presentation/app/facades/Config.facade';
import { AlertService } from '../../shared/services/alert-service';

const alertServiceMock = {
  show: jasmine.createSpy('show'),
  confirm: jasmine.createSpy('confirm')
};

const cartFacadeMock = {
  isOpen: () => true,
  minimoRequerido:() => 2500,
  count: () => 0,
  open: jasmine.createSpy('open'),
  close: jasmine.createSpy('close'),
  toggle: jasmine.createSpy('toggle'),

  items: jasmine.createSpy('items').and.returnValue([]),
  //total: () => 0,
  escalaActiva: () => ({ nivel: 1 }),
  addToCart: jasmine.createSpy('addToCart'),
  decreaseQuantity: jasmine.createSpy('decreaseQuantity'),
  incrementQuantity: jasmine.createSpy('incrementQuantity'),
  removeItem: jasmine.createSpy('removeItem'),
  clear: jasmine.createSpy('clear'),
  setQuantity: jasmine.createSpy('setQuantity'),
  clienteNombre: jasmine.createSpy('clienteNombre').and.returnValue(''),
  hayProductosAgotados: jasmine.createSpy('hayProductosAgotados').and.returnValue(false),
  itemsConPrecio: jasmine.createSpy('itemsConPrecio').and.returnValue([]),
  total: jasmine.createSpy('total').and.returnValue(0),
};

const configFacadeMock = {
  minimoGeneral: () => 0,
  minimoConCombos: () => 0,
  escalas: () => [],
  //telefonoWhatsapp: () => '',
  tiendaAbierta: () => true,
  config: () => ({
    minimoGeneral: 0,
    minimoConCombos: 0,
    escalas: [],
    telefonoWhatsapp: '',
    tiendaAbierta: true,
  }),
  loading: () => false,
  load: jasmine.createSpy('load'),
  telefonoWhatsapp: jasmine.createSpy('telefonoWhatsapp').and.returnValue('5491100000000'),
};

describe('SideCart', () => {
  let component: SideCart;
  let fixture: ComponentFixture<SideCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideCart],
      providers: [
        { provide: CartFacade, useValue: cartFacadeMock as unknown as CartFacade },
        { provide: ConfigFacade, useValue: configFacadeMock }, 
        { provide: AlertService, useValue: alertServiceMock as unknown as AlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe generar el enlace de WhatsApp con los precios de la Escala Activa y el Total correcto', () => {
    //escenario simulando que el cliente llegó a la Escala 3
    (cartFacadeMock.clienteNombre  as jasmine.Spy).and.returnValue('Gimnasio Zeus');
    (cartFacadeMock.hayProductosAgotados as jasmine.Spy).and.returnValue(false);
    
    // Simulamos que el Facade calculó el precio con descuento (Ej: $8000 en vez de $10000)
    (cartFacadeMock.itemsConPrecio as unknown as jasmine.Spy).and.returnValue([
      {
        productoId: 'P1',
        nombre: 'Proteína Whey',
        sabor: 'Chocolate',
        cantidad: 10,
        precioEfectivo: 8000, // precio de Escala 3
        subtotalItem: 80000
      } as any
    ]);
    
    (cartFacadeMock.total as unknown as jasmine.Spy).and.returnValue(80000);

    // Espiamos window.open para que no abra una pestaña de verdad durante el test
    spyOn(window, 'open');

    // Click en Confirmar Pedido
    component.generarPedidoWhatsapp();

    // Verificamos 
    expect(window.open).toHaveBeenCalled();
    
    // Capturamos la URL exacta que el componente intentó abrir
    const urlLlamada = (window.open as jasmine.Spy).calls.mostRecent().args[0];

    // Verificamos que los datos críticos estén en el mensaje
    expect(urlLlamada).toContain('5491100000000'); // El número de teléfono
    expect(urlLlamada).toContain('Gimnasio Zeus'); // El nombre del cliente
    expect(urlLlamada).toContain('8000');          // El precio unitario con descuento aplicado
    expect(urlLlamada).toContain('Chocolate');     // El sabor
    expect(urlLlamada).toContain('80000');         // El total final
  });

  it('NO debe abrir WhatsApp y debe mostrar una alerta si hay productos agotados', () => {
    
    //SÍ cliente  puso su nombre, pasa 
    cartFacadeMock.clienteNombre.and.returnValue('Gimnasio Zeus');
    
    // Pero hay productos SIN STOCK , no pasa
    cartFacadeMock.hayProductosAgotados.and.returnValue(true);

    // Espiamos window.open
    spyOn(window, 'open');

    // intentamos generar el pedido
    component.generarPedidoWhatsapp();

    // Verificaciones
    //ventana de WhatsApp no debe abrirse
    expect(window.open).not.toHaveBeenCalled();

    // servicio de alertas debió ser llamado con el mensaje y tipo 'warning'
    expect(alertServiceMock.show).toHaveBeenCalledWith(
      jasmine.stringMatching(/productos agotados/i), // Busca "productos agotados"
      'warning'
    );
  });

 
 

});