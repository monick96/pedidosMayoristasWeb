import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductos } from './admin-productos';

import { GetProductosUseCase } from '../../../../aplication/use-cases/GetProductosUseCase';
import { GetCombosUseCase } from '../../../../aplication/use-cases/GetCombosUseCase';
import { UpdateProductoActivoUseCase } from '../../../../aplication/use-cases/UpdateProductoActivoUseCase';
import { UpdateProductoUnidadesUseCase } from '../../../../aplication/use-cases/UpdateProductoUnidadesUseCase';
import { UpdateComboActivoUseCase } from '../../../../aplication/use-cases/UpdateComboActivoUseCase';

// Si usás Result/ok en tu proyecto, mejor.
// Si no, devolvé lo que tus usecases realmente devuelven.
import { ok } from '../../../../shared/Result';

describe('AdminProductos', () => {
  let component: AdminProductos;
  let fixture: ComponentFixture<AdminProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductos],
      providers: [
        {
          provide: GetProductosUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok([])) },
        },
        {
          provide: GetCombosUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok([])) },
        },
        {
          provide: UpdateProductoActivoUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
        },
        {
          provide: UpdateProductoUnidadesUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
        },
        {
          provide: UpdateComboActivoUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});