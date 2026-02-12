import { ImagenProducto } from "../value-objects/ImagenProducto";

export interface Combo {
  codigo: string; //sera el nombre de grupo del combo, ej: combo1

  marcaId?: string;

  precioTotal?: number;//sera una suma de los precios del combo item

  porcentajeDescuento?: number; // no hay descuento segun mayorista segun entiendo, pero lo dejamos por si acaso 

  pesoTotalGramos?: number;//sera una suma de los precios del combo item

  //pesoTotalKg?: number;//suma de pesos de los items

  descripcion: string; //combinacion de combo + marca(primera palabra si tiene mas de 2) + descripciones sin repetir +sabores de las cosas

  items: ComboItem[];

  images?: ImagenProducto[];
  
  esNovedad?: boolean; 
}