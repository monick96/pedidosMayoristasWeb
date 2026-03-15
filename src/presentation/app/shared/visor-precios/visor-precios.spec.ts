import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPrecios } from './visor-precios';

describe('VisorPrecios', () => {
  let component: VisorPrecios;
  let fixture: ComponentFixture<VisorPrecios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorPrecios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorPrecios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar máximo 3 precios aunque reciba 4 o más', () => {
    const cuatroPrecios = [
        { nivel: 'nivel 1', precio: 100 },
        { nivel: 'nivel 2', precio: 90 },
        { nivel: 'nivel 3', precio: 80 },
        { nivel: 'nivel 4', precio: 70 }
    ];
    
    component.precios = cuatroPrecios;
    
    // preciosUnicos es un computed que hace el slice(0, 3)
    expect(component.preciosUnicos().length).toBe(3);
    expect(component.preciosUnicos()).not.toContain(jasmine.objectContaining({ nivel: 'nivel 4' }));
  });
  
});
