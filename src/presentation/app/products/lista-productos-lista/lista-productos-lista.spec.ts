import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosLista } from './lista-productos-lista';

describe('ListaProductosLista', () => {
  let component: ListaProductosLista;
  let fixture: ComponentFixture<ListaProductosLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductosLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProductosLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
