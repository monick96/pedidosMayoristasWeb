import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboard } from './admin-dashboard';
import { ConfigFacade } from '../../../../presentation/app/facades/Config.facade';

const configFacadeMock = {
  // señales/computed -> funciones
  minimoGeneral: () => 0,
  minimoConCombos: () => 0,
  escalas: () => [],
  telefonoWhatsapp: () => '',
  tiendaAbierta: () => true,

  // si el template/ts usa config() también
  config: () => ({
    minimoGeneral: 0,
    minimoConCombos: 0,
    escalas: [],
    telefonoWhatsapp: '',
    tiendaAbierta: true,
  }),

  loading: () => false,

  // si el dashboard llama acciones:
  load: jasmine.createSpy('load'),
  updateConfig: jasmine.createSpy('updateConfig'),
};

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [{ provide: ConfigFacade, useValue: configFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
