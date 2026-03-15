import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboard } from './admin-dashboard';
import { ConfigFacade } from '../../../../presentation/app/facades/Config.facade';
import { GetConfigRuleUseCase } from '../../../../aplication/use-cases/GetConfigRuleUseCase';
import { signal } from '@angular/core';
import { ProductFacade } from '../../facades/product.facade';
import { ok } from '../../../../shared/Result';


const configFacadeMock = {
  // señales/computed -> funciones
  minimoGeneral: () => 0,
  minimoConCombos: () => 0,
  escalas: () => [],
  telefonoWhatsapp: () => '',
  tiendaAbierta: () => true,
  marcasDestacadas: () => [],

  // si el template/ts usa config() también
  config: () => ({
    minimoGeneral: 0,
    minimoConCombos: 0,
    escalas: [],
    telefonoWhatsapp: '',
    tiendaAbierta: true,
    marcasDestacadas: () => [],
  }),

  loading: () => false,

  // si el dashboard llama acciones:
  load: jasmine.createSpy('load'),
  updateConfig: jasmine.createSpy('updateConfig'),
  marcasDisponibles: signal([]),
};

const productFacadeMock = {
  items: signal([]),        // Usamos señales reales para que el template no falle
  loading: signal(false),
  loadProducts: jasmine.createSpy('loadProducts'),
  marcasDisponibles: signal([]),
  config: () => ({ 
        minimoGeneral: 0, 
        escalas: [], 
        marcasDestacadas: [] 
  })
};

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [
        { provide: ConfigFacade, useValue: configFacadeMock },
        { provide: ProductFacade, useValue: productFacadeMock },
        {
          provide: GetConfigRuleUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
        },
  
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
