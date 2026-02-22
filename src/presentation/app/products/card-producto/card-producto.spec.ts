import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardProducto } from './card-producto';
import { ProductoVM } from '../models/productoVm';
import { signal, ChangeDetectionStrategy } from '@angular/core';
import { CartFacade } from '../../cart/cart.facade';
import { ProductFacade } from '../product.facade';

//Mocks de los servicios que inyecta el componente
const mockProductFacade = {
  openLightbox: jasmine.createSpy('openLightbox')
};

const mockCartFacade = {
  items: signal([]),
  addToCart: jasmine.createSpy('addToCart'),
  decreaseQuantity: jasmine.createSpy('decreaseQuantity')
};

// Helper para no repetir el mock base en cada test
function crearProductoMock(overrides: Partial<ProductoVM> = {}): ProductoVM {
  return {
    estaDisponible: true,
    codigo: 'TEST-001',
    descripcion: 'Producto de prueba',
    precioFinal: 10000,
    precioNormal: 10000,
    tienePromo: false,
    images: [{ url: 'https://example.com/test.jpg' }],
    tipo: 'PRODUCTO',
    ...overrides
  } as ProductoVM;
}

describe('CardProducto Component', () => {
  let component: CardProducto;
  let fixture: ComponentFixture<CardProducto>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProducto],
      providers: [
        // Proveemos los mocks para que inject() funcione
        { provide: ProductFacade, useValue: mockProductFacade },
        { provide: CartFacade, useValue: mockCartFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardProducto);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // Asignamos el input ANTES del detectChanges
    // setInput() + detectChanges() es la forma correcta con OnPush
    fixture.componentRef.setInput('item', crearProductoMock());
    fixture.detectChanges();
  });
  

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Renderizado de datos del producto', () => {

    it('debe mostrar la descripción del producto', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ descripcion: 'Creatina Monohidrato 500g' }));
      fixture.detectChanges();

      // Assert
      const descripcionElement = compiled.querySelector('h3');
      expect(descripcionElement?.textContent).toContain('Creatina Monohidrato 500g');
    });

    it('debe mostrar la imagen del producto con src correcto', () => {
      // Arrange
      const url = 'https://cdn.example.com/producto-123.jpg';
      fixture.componentRef.setInput('item', crearProductoMock({ images: [{ url }] }));
      // Act
      fixture.detectChanges();

      // Assert
      const imgElement = compiled.querySelector('img') as HTMLImageElement;
      expect(imgElement).toBeTruthy();
      expect(imgElement.src).toBe(url);
    });

    it('debe mostrar el precio final formateado como moneda', () => {

      fixture.componentRef.setInput('item', crearProductoMock({ precioFinal: 45000 }));
      fixture.detectChanges();

      const precioFinalElement = compiled.querySelector('.price-final');
      expect(precioFinalElement?.textContent).toContain('45,000');
    });
  });

  describe('Lógica de promoción', () => {

    it('debe mostrar el precio normal tachado cuando hay promoción', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ precioNormal: 25000, tienePromo: true }));
      fixture.detectChanges();

      // Assert
      const precioOldElement = compiled.querySelector('.price-old');
      expect(precioOldElement).toBeTruthy();
      expect(precioOldElement?.textContent).toContain('25,000');
    });

    it('NO debe mostrar el precio normal tachado cuando NO hay promoción', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ tienePromo: false }));
      fixture.detectChanges();

      // Assert
      const precioOldElement = compiled.querySelector('.price-old');
      expect(precioOldElement).toBeFalsy();
    });

    it('debe mostrar el badge "OFERTA" cuando tienePromo es true', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ tienePromo: true }));
      fixture.detectChanges();

      // Assert
      const badgeElement = compiled.querySelector('.badge-promo');
      expect(badgeElement).toBeTruthy();
      expect(badgeElement?.textContent?.trim()).toBe('OFERTA');
    });

    it('NO debe mostrar el badge "OFERTA" cuando tienePromo es false', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ tienePromo: false }));
      fixture.detectChanges();

      // Assert
      const badgeElement = compiled.querySelector('.badge-promo');
      expect(badgeElement).toBeFalsy();
    });
  });

  describe('Atributo @Input', () => {

    it('debe actualizar la vista cuando cambia el input', () => {
      // Arrange
      const producto1 = crearProductoMock({ descripcion: 'Producto 1', tienePromo: false });
      const producto2 = crearProductoMock({ descripcion: 'Producto 2', tienePromo: true });

      fixture.componentRef.setInput('item', producto1);
      fixture.detectChanges();
      expect(compiled.querySelector('h3')?.textContent).toContain('Producto 1');

      //setInput() marca la vista como dirty correctamente en OnPush
      fixture.componentRef.setInput('item', producto2);
      fixture.detectChanges();

      expect(compiled.querySelector('h3')?.textContent).toContain('Producto 2');
      expect(compiled.querySelector('.badge-promo')).toBeTruthy();
    });
  });

  describe('ChangeDetection OnPush', () => {

    it('NO debe re-renderizar si el objeto se muta internamente (comportamiento OnPush)', () => {
      const producto = crearProductoMock({ descripcion: 'Original' });
      fixture.componentRef.setInput('item', producto);
      fixture.detectChanges();

      // Mutamos el objeto directamente sin pasar por setInput
      (component.item as any).descripcion = 'Modificado';
      fixture.detectChanges(); // OnPush no debería detectar esto

      const h3 = compiled.querySelector('h3');
      expect(h3?.textContent).toContain('Original'); // sigue mostrando el valor anterior
    });

  });

  describe('Accesibilidad y atributos HTML', () => {

    it('debe usar item.descripcion como alt cuando la imagen no tiene alt propio', () => {

      const descripcion = 'Proteína Whey Premium';
      // Sin alt en la imagen → template usa: img.alt || item.descripcion
      fixture.componentRef.setInput('item', crearProductoMock({
        descripcion,
        images: [{ url: 'https://example.com/img.jpg' }]
      }));
      fixture.detectChanges();

      const img = compiled.querySelector('img') as HTMLImageElement;
      expect(img.alt).toBe(descripcion);

    });
  });

  describe('Casos edge', () => {

    it('debe manejar descripciones muy largas', () => {
      // Arrange
      const descripcionLarga = 'Proteína Whey Isolate Ultra Premium con Glutamina Añadida y BCAA';
      fixture.componentRef.setInput('item', crearProductoMock({ descripcion: descripcionLarga }));
      fixture.detectChanges();

      // Assert
      const h3 = compiled.querySelector('h3');
      expect(h3?.textContent).toContain(descripcionLarga);
    });

    it('debe manejar precios de 0', () => {
      // Arrange
      fixture.componentRef.setInput('item', crearProductoMock({ precioFinal: 0, precioNormal: 0, tienePromo: false }));
      fixture.detectChanges();

      // Assert
      const precioElement = compiled.querySelector('.price-final');
      expect(precioElement?.textContent).toContain('0');
    });

    it('debe renderizar imagen aunque la URL esté vacía', () => {
      fixture.componentRef.setInput('item', crearProductoMock({ images: [{ url: '' }] }));
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img).toBeTruthy();
    });

  });

});
