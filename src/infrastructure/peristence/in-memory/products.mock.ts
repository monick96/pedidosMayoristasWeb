import { Producto } from "../../../domain/entities/Producto";

export const PRODUCTS_MOCK: Producto[] = [
  {
    codigo: 'S1',
    marcaId: 'STAR NUTRITION',
    sabor: 'Chocolate',
    descripcion: 'Platinum Whey Protein 2 lb',
    precioBase: 19842,
    porcentajePrecioSugerido: 60,
    porcentajeDescuento: 10, // hay promo
    pesoGramos: 930,
    pesoKg: 0.93,
    preciosMayorista: [
      { tipo: 'MAYORISTA_1', porcentaje: 34.5 },
      { tipo: 'MAYORISTA_2', porcentaje: 27.5 },
      { tipo: 'MAYORISTA_3', porcentaje: 20.6 },
      { tipo: 'MAYORISTA_4', porcentaje: 15.5 }
    ],
    images: [
      {
        url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/platinum-whey-protein-2lb-chocolate-204f5f28ff5484f4ea17675643049352-1024-1024.webp',
        alt: 'Platinum Whey Protein Chocolate'
      }
    ]
  },
  {
    codigo: 'S2',
    marcaId: 'STAR NUTRITION',
    sabor: 'Vainilla',
    esNovedad: true,
    descripcion: 'Platinum Whey Protein 2 lb',
    precioBase: 25000,
    porcentajePrecioSugerido: 60,
    // sin descuento
    pesoGramos: 930,
    pesoKg: 0.93,
    preciosMayorista: [
      { tipo: 'MAYORISTA_1', porcentaje: 30 },
      { tipo: 'MAYORISTA_2', porcentaje: 25 },
      { tipo: 'MAYORISTA_3', porcentaje: 20 },
      { tipo: 'MAYORISTA_4', porcentaje: 15 }
    ],
    images: [
      {
        url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/vainilla-ebf4722f4094a8a25417062137787328-640-0.webp',
        alt: 'Vista frontal Platinum Whey Protein Vainilla',
        order:0,
        small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/small-s1.webp'
      },
      {
        url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/vainilla-ebf4722f4094a8a25417062137787328-640-0.webp',
        alt: 'Vista frontal Platinum Whey Protein Vainilla',
        order: 1,
        small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/small-s1.webp'
      }
      
    ]
  },
  {
    codigo: 'S3',
    marcaId: 'STAR NUTRITION',
    sabor: 'Frutilla',
    descripcion: 'Platinum Whey Protein 2 lb',
    precioBase: 21000,
    porcentajePrecioSugerido: 60,
    porcentajeDescuento: 5,
    pesoGramos: 930,
    pesoKg: 0.93,
    preciosMayorista: [
      { tipo: 'MAYORISTA_1', porcentaje: 28 },
      { tipo: 'MAYORISTA_2', porcentaje: 22 },
      { tipo: 'MAYORISTA_3', porcentaje: 18 },
      { tipo: 'MAYORISTA_4', porcentaje: 12 }
    ],
    images: [
      {
        url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/frutilla-a4c08de90c2e1e898d17062143259929-640-0.webp',
        alt: 'Platinum Whey Protein Frutilla'
      }
    ]
  }
];