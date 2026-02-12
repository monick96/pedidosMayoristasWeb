import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProducto } from './card-producto';

describe('CardProducto', () => {
  let component: CardProducto;
  let fixture: ComponentFixture<CardProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProducto);
    component = fixture.componentInstance;

    //  datos de prueba al input 
    component.item = {
      codigo: 'TEST-1',
      descripcion: 'Producto de prueba',
      precioFinal: 100,
      tipo: 'PRODUCTO',
      images: [{ url: 'test.jpg', alt: 'test' }]
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
