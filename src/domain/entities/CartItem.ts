import { tipoProducto } from "../value-objects/TipoProducto";

export interface CartItem {
  productoId: string;
  tipo: tipoProducto; // para saber qué repositorio consultar si hiciera falta
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  observacion?: string; //para notas en pedidos mayoristas, si no hay stock cambiar por otro sabor o algo asi
}

// Casos de uso típicos
//- Agregar al carrito
//- Calcular total del pedido
//- Generar orden de compra



