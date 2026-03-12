import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideCart } from './side-cart';

import { CartFacade } from '../../../../presentation/app/facades/cart.facade';
import { ConfigFacade } from '../../../../presentation/app/facades/Config.facade';

const cartFacadeMock = {
  isOpen: () => true,
  minimoRequerido:() => 2500,
  count: () => 0,
  open: jasmine.createSpy('open'),
  close: jasmine.createSpy('close'),
  toggle: jasmine.createSpy('toggle'),

  items: () => [],
  total: () => 0,
  escalaActiva: () => ({ nivel: 1 }),
  addToCart: jasmine.createSpy('addToCart'),
  decreaseQuantity: jasmine.createSpy('decreaseQuantity'),
  incrementQuantity: jasmine.createSpy('incrementQuantity'),
  removeItem: jasmine.createSpy('removeItem'),
  clear: jasmine.createSpy('clear'),
  setQuantity: jasmine.createSpy('setQuantity'),
};

const configFacadeMock = {
  minimoGeneral: () => 0,
  minimoConCombos: () => 0,
  escalas: () => [],
  telefonoWhatsapp: () => '',
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
};

describe('SideCart', () => {
  let component: SideCart;
  let fixture: ComponentFixture<SideCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideCart],
      providers: [
        { provide: CartFacade, useValue: cartFacadeMock },
        { provide: ConfigFacade, useValue: configFacadeMock }, // ✅ ESTO TE FALTABA
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});