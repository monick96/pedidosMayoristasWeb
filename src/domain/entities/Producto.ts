import { MayoristaPrecio } from "../value-objects/PrecioMayorista";
import { ImagenProducto } from "../value-objects/ImagenProducto";

export interface Producto {
  codigo: string;
  marcaId: string;
  sabor?: string;
  descripcion: string;

  precioBase: number;
  porcentajePrecioSugerido?: number;
  porcentajeDescuento?: number; // no todos los productos tienen descuento, pero para todos es el mismo cuando lo tiene

  pesoGramos?: number;
  pesoKg?: number;

  esNovedad?: boolean; 

  /*stock: {
    inicial: number;
    local: number;
    global: number;
  };*/

  preciosMayorista: MayoristaPrecio[];

  images?: ImagenProducto[];
}

//ejemplo vista en json
//el stock lo ignoramos por ahora lo dejo por si cambia algo
/*
    {
        "id": "S1",
        "marca": "STAR NUTRITION",
        "sabor": "Chocolate",
        "descripcion": "Platinum Whey Protein 2 lb",
        "precioBase": 19842,
        "porcentajePrecioSugerido": 60,
        "porcentajeDescuento": 10,
        "pesoGramos": 930,
        "imagen_url"
        "pesoKg": 0.93,
        "stock": {
            "inicial": -101,
            "local": -101,
            "global": -78
        },
        "preciosMayorista": [
            { "tipo": "MAYORISTA_1", "porcentaje": 34.5 },
            { "tipo": "MAYORISTA_2", "porcentaje": 27.5 },
            { "tipo": "MAYORISTA_3", "porcentaje": 20.6 },
            { "tipo": "MAYORISTA_4", "porcentaje": 15.5 }
        ],
        "images": [
            {
            "url": "https://cdn.tuservicio.com/products/S1-medium.jpg",
            "alt": "Platinum Whey Protein Chocolate"
            }
        ]
    }
 */