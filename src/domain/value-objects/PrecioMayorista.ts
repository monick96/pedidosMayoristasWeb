import { MayoristaTipo } from "./TipoMayorista";

export interface MayoristaPrecio {

  tipo: MayoristaTipo;//1,2,3,4

  porcentaje: number;          // margen mayorista
}