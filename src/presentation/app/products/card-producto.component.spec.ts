import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardProducto } from './card-producto/card-producto';
import { ProductoVM } from '../products/models/productoVm';
import { CurrencyPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CardProducto Component', () => {
  let component: CardProducto;
  let fixture: ComponentFixture<CardProducto>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProducto] // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(CardProducto);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Renderizado de datos del producto', () => {

    it('debe mostrar el código del producto', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'PROT-001',
        descripcion: 'Proteína Whey Gold',
        precioFinal: 25000,
        precioNormal: 30000,
        tienePromo: true,
        images: [
          {
            url:'https://example.com/whey.jpg'
          }
        ],
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const codigoElement = compiled.querySelector('.codigo');
      expect(codigoElement?.textContent).toContain('PROT-001');
    });

    it('debe mostrar la descripción del producto', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'CREAT-001',
        descripcion: 'Creatina Monohidrato 500g',
        precioFinal: 15000,
        precioNormal: 15000,
        tienePromo: false,
        images: [
          {
            url:'https://example.com/whey.jpg'
          }
        ],
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain('Creatina Monohidrato 500g');
    });

    it('debe mostrar la imagen del producto con src correcto', () => {
      //poner url imagen ejemplo real
      const urlImagen : string = 'https://example.com/whey.jpg';
      const productoMock: ProductoVM = {
        codigo: 'PROD-123',
        descripcion: 'Producto Test',
        precioFinal: 10000,
        precioNormal: 10000,
        tienePromo: false,
        images: [
          {
            url:'https://example.com/whey.jpg'
          }
        ],
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      

      // Act
      fixture.detectChanges();

      // Assert
      const imgElement = compiled.querySelector('img') as HTMLImageElement;
      expect(imgElement).toBeTruthy();
      expect(imgElement.src).toBe(urlImagen);
    });

    it('debe mostrar el precio final formateado como moneda', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'PROD-001',
        descripcion: 'Producto',
        precioFinal: 45000,
        precioNormal: 50000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const precioFinalElement = compiled.querySelector('.final');
      expect(precioFinalElement?.textContent).toContain('45,000'); // CurrencyPipe formatea con comas
    });
  });

  describe('Lógica de promoción', () => {

    it('debe mostrar el precio normal tachado cuando hay promoción', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'PROMO-001',
        descripcion: 'Producto en Oferta',
        precioFinal: 20000,
        precioNormal: 25000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const precioNormalElement = compiled.querySelector('.tachado');
      expect(precioNormalElement).toBeTruthy();
      expect(precioNormalElement?.textContent).toContain('25,000');
    });

    it('NO debe mostrar el precio normal tachado cuando NO hay promoción', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'NORMAL-001',
        descripcion: 'Producto sin Promoción',
        precioFinal: 20000,
        precioNormal: 20000,
        tienePromo: false,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const precioNormalElement = compiled.querySelector('.tachado');
      expect(precioNormalElement).toBeFalsy(); // No debe existir
    });

    it('debe mostrar el badge "PROMO" cuando tienePromo es true', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'PROMO-002',
        descripcion: 'Producto en Promoción',
        precioFinal: 18000,
        precioNormal: 22000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const badgeElement = compiled.querySelector('.badge');
      expect(badgeElement).toBeTruthy();
      expect(badgeElement?.textContent?.trim()).toBe('PROMO');
    });

    it('NO debe mostrar el badge "PROMO" cuando tienePromo es false', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'NORMAL-002',
        descripcion: 'Producto sin Promoción',
        precioFinal: 15000,
        precioNormal: 15000,
        tienePromo: false,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const badgeElement = compiled.querySelector('.badge');
      expect(badgeElement).toBeFalsy();
    });
  });

  describe('Atributo @Input', () => {

    it('debe requerir el input "item"', () => {
      // El componente tiene @Input({ required: true })
      // Si intentamos renderizar sin item, Angular lanzará error
      
      // Este test verifica que la metadata está correcta
      const inputs = (component.constructor as any).ɵcmp.inputs;
      expect(inputs.item).toBeDefined();
    });

    it('debe actualizar la vista cuando cambia el input', () => {
      // Arrange
      const producto1: ProductoVM = {
        codigo: 'PROD-001',
        descripcion: 'Producto 1',
        precioFinal: 10000,
        precioNormal: 10000,
        tienePromo: false,
        tipo: "PRODUCTO"
      };

      const producto2: ProductoVM = {
        codigo: 'PROD-002',
        descripcion: 'Producto 2',
        precioFinal: 20000,
        precioNormal: 25000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };

      // Act - Primer render
      component.item = producto1;
      fixture.detectChanges();
      
      let descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain('Producto 1');

      // Act - Cambiar input
      component.item = producto2;
      fixture.detectChanges();

      // Assert - Debe reflejar el nuevo producto
      descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain('Producto 2');
      
      const badgeElement = compiled.querySelector('.badge');
      expect(badgeElement).toBeTruthy(); // Ahora tiene promo
    });
  });

  describe('ChangeDetection OnPush', () => {

    it('debe usar OnPush change detection strategy', () => {
      // Verificar que el componente tiene la estrategia OnPush configurada
      const changeDetection = (component.constructor as any).ɵcmp.changeDetection;
      expect(changeDetection).toBe(1); // 1 = ChangeDetectionStrategy.OnPush
    });

    it('NO debe detectar cambios automáticamente con OnPush', () => {
      // AVERIGUAR PARA QUE ES .. POR QUE EL ON PUSH ES PARA ACTUALIZAR ANTE CAMBIOS
      const producto: ProductoVM = {
        codigo: 'PROD-001',
        descripcion: 'Original',
        precioFinal: 10000,
        precioNormal: 10000,
        tienePromo: false,
        tipo: "PRODUCTO"
      };
      
      component.item = producto;
      fixture.detectChanges();

      // Act - Mutar el objeto (anti-patrón, pero demuestra OnPush)
      producto.descripcion = 'Modificado';
      // NO llamamos a detectChanges()

      // Assert - No debe reflejar el cambio
      const descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain('Original');
      
      // Ahora sí detectamos cambios manualmente
      fixture.detectChanges();
      expect(descripcionElement?.textContent).toContain('Modificado');
    });
  });

  describe('Accesibilidad y atributos HTML', () => {

    it('debe tener un alt apropiado en la imagen', () => {
      // Arrange
      const descripcion = 'Proteína Whey Premium';
      const productoMock: ProductoVM = {
        codigo: 'PROT-001',
        descripcion: descripcion,
        precioFinal: 25000,
        precioNormal: 30000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const imgElement = compiled.querySelector('img') as HTMLImageElement;
      // Asumiendo que el template usa {{ item.descripcion }} como alt
      expect(imgElement.alt).toBe(descripcion);
    });
  });

  describe('Casos edge', () => {

    it('debe manejar descripciones muy largas', () => {
      // Arrange
      const descripcionLarga = 'Proteína Whey Isolate Ultra Premium con Glutamina Añadida y BCAA para Máxima Recuperación Muscular Post-Entrenamiento 2kg Sabor Chocolate';
      const productoMock: ProductoVM = {
        codigo: 'PROT-ULTRA',
        descripcion: descripcionLarga,
        precioFinal: 50000,
        precioNormal: 60000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert - No debe romper el layout
      const descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain(descripcionLarga);
    });

    it('debe manejar precios de 0', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'FREE-001',
        descripcion: 'Producto Gratis',
        precioFinal: 0,
        precioNormal: 0,
        tienePromo: false,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const precioElement = compiled.querySelector('.final');
      expect(precioElement?.textContent).toContain('0'); // o $0.00 según el pipe
    });

    it('debe manejar URLs de imagen vacías o inválidas', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'NO-IMG',
        descripcion: 'Sin Imagen',
        precioFinal: 10000,
        precioNormal: 10000,
        tienePromo: false,
        tipo: "PRODUCTO",
        images: [
          {
            url:'https://example.com'
          }
        ],
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert - El componente no debe romper
      const imgElement = compiled.querySelector('img') as HTMLImageElement;
      expect(imgElement).toBeTruthy();
      expect(imgElement.src).toBe(''); // o manejar con imagen placeholder
    });
  });

  describe('Integración con CurrencyPipe', () => {

    it('debe formatear correctamente precios grandes', () => {
      // Arrange
      const productoMock: ProductoVM = {
        codigo: 'EXPENSIVE',
        descripcion: 'Producto Caro',
        precioFinal: 1500000,
        precioNormal: 2000000,
        tienePromo: true,
        tipo: "PRODUCTO"
      };
      
      component.item = productoMock;

      // Act
      fixture.detectChanges();

      // Assert
      const precioFinalElement = compiled.querySelector('.final');
      const precioNormalElement = compiled.querySelector('.tachado');
      
      // CurrencyPipe debería formatear con comas
      expect(precioFinalElement?.textContent).toMatch(/1.*500.*000/);
      expect(precioNormalElement?.textContent).toMatch(/2.*000.*000/);
    });
  });
});
