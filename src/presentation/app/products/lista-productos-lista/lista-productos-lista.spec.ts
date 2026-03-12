import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosLista } from './lista-productos-lista';
import { ProductoVM } from '../../models/productoVm';
import { ConfigFacade } from '../../../../presentation/app/facades/Config.facade';
import { ProductFacade } from '../../../../presentation/app/facades/product.facade';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

beforeAll(() => {
  registerLocaleData(localeEsAr, 'es-AR');
});

const configFacadeMock = {
  config: () => ({
    minimoGeneral: 0,
    minimoConCombos: 0,
    escalas: [],
    telefonoWhatsapp: '',
    tiendaAbierta: true,
  }),
  loading: () => false,
};

// 👇 mock mínimo: agregá solo lo que el template/ts use realmente
const productFacadeMock = {
  openLightbox: jasmine.createSpy('openLightbox'),
};

describe('ListaProductosLista', () => {
  let component: ListaProductosLista;
  let fixture: ComponentFixture<ListaProductosLista>;

  const productoMock: ProductoVM = {
    codigo: '1',
    descripcion: 'Producto Test',
    precioFinal: 100,
    precioNormal: 120,
    tienePromo: false,
    unidadesPorCaja: 12,
    estaDisponible: true,
    tipo: 'PRODUCTO',
  } as ProductoVM;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductosLista],
      providers: [
        { provide: ConfigFacade, useValue: configFacadeMock },
        { provide: ProductFacade, useValue: productFacadeMock }, // ✅ ESTO TE FALTABA AHORA
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProductosLista);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', productoMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
