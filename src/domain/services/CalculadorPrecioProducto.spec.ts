import { Producto } from "../entities/Producto";
import { CalculadorPrecioProducto } from "./CalculadorPrecioProducto";

describe('CalculadorPrecioProducto', () => {

    it('calcularPrecioFinal debería aplicar el descuento del producto si existe no el porcentaje en precioMayorista', () => {
        const productoMock: Partial<Producto> = {
            precioBase: 100,
            porcentajeDescuento: 10, // Descuento especial
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 30 }]
        };

        const precio = CalculadorPrecioProducto.calcularPrecioFinal(productoMock as Producto);

        // 100 + 10% = 110 (Ignora el 30% del mayorista porque hay promo)

        expect(precio).toBe(110);

    });

    it('calcularPrecioFinal debería usar el porcentaje del mayorista si el descuento del producto es 0', () => {
        const productoSinPromo: any = {
            precioBase: 1000,
            porcentajeDescuento: 0,
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 20 }]
        };
        const precio = CalculadorPrecioProducto.calcularPrecioFinal(productoSinPromo);
        expect(precio).toBe(1200); // 1000 + 20%
    });

    it('calcularPrecioNormal no debería verse afectado por el descuento del producto', () => {
        const productoConPromo: any = {
            precioBase: 1000,
            porcentajeDescuento: 10,
            preciosMayorista: [{ tipo: 'MAYORISTA_1', porcentaje: 30 }]
        };
        const precioNormal = CalculadorPrecioProducto.calcularPrecioNormal(productoConPromo);
        expect(precioNormal).toBe(1300); // Debería ignorar el 10 y usar el 30
    });
});

