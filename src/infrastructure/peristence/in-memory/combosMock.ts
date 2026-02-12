import { Combo } from "../../../domain/entities/Combo";

export const COMBOS_MOCK: Combo[] = [
    {
        codigo: "COMBO1",
        descripcion: "Combo Creatina + proteina Star Nutrition",
        marcaId: 'STAR NUTRITION',
        items: [
          {
           
            codigoProducto: "PROD1",
            codigoComboProducto:"COMBO1-PROD1",
            cantidad: 1,
            precioUnitario: 20000,
            pesoGramos: 1000,
            descripcion: "Whey Protein"
          },
          {
            codigoProducto: "PROD2",
            codigoComboProducto:"COMBO1-PROD2",
            cantidad: 1,
            precioUnitario: 15000,
            pesoGramos: 300,
            descripcion: "Creatina"
          }
        ],
        images: [
            {
                url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/combo-star-nutrition-pote-399328f7890010465c17321982653518-1024-1024.webp',
                alt: 'Combo Creatina + proteina',
                order: 0,
                small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/combo-small.webp'
            },
            {
                url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/combo-star-nutrition-pote-399328f7890010465c17321982653518-1024-1024.webp',
                alt: 'Combo Creatina + proteina',
                order: 1,
                small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/combo-small.webp'
            }
        ]
    },
    {
        codigo: "COMBO2",
        descripcion: "Combo Creatina + proteina Gentech",
        marcaId: 'GENTECH',
        items: [
          {
           
            codigoProducto: "PROD1",
            codigoComboProducto:"COMBO2-PROD1",
            cantidad: 1,
            precioUnitario: 25000,
            pesoGramos: 1000,
            descripcion: "Whey Protein"
          },
          {
            codigoProducto: "PROD2",
            codigoComboProducto:"COMBO2-PROD2",
            cantidad: 1,
            precioUnitario: 15000,
            pesoGramos: 300,
            descripcion: "Creatina"
          }
        ],
        images: [
            {
                url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/combo-star-nutrition-pote-399328f7890010465c17321982653518-1024-1024.webp',
                alt: 'Combo Creatina + proteina',
                order: 0,
                small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/combo-small.webp'
            },
            {
                url: 'https://acdn-us.mitiendanube.com/stores/002/956/718/products/combo-star-nutrition-pote-399328f7890010465c17321982653518-1024-1024.webp',
                alt: 'Combo Creatina + proteina',
                order: 1,
                small: 'https://raw.githubusercontent.com/dev-Va-lab/img/refs/heads/main/combo-small.webp'
            }
        ]
    }
    
]