import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosLista } from './lista-productos-lista';
import { ProductoVM } from '../models/productoVm';

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
    tipo: 'PRODUCTO'
    // completá los campos obligatorios que tenga ProductoVM
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductosLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProductosLista);
    component = fixture.componentInstance;

    component.item = productoMock; // ✅ asignamos ANTES del detectChanges

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
