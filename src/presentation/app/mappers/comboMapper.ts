import { Combo } from "../../../domain/entities/Combo";
import { ComboCalculador } from "../../../domain/services/ComboCalculador";
import { ComboVM } from "../models/comboVm";
import { COMBO } from "../../../domain/value-objects/TipoProducto";

import { imagenProductoToVM } from "./productoMapper";

export function comboToVM(combo: Combo): ComboVM {
 
  return {
    codigo: combo.codigo,
    //titulo: buildDescripcion(combo),
    marcaId: (combo as any).marcaId || null, 
    descripcion: buildDescripcion(combo), //+ combo.descripcion,
    precioFinal: ComboCalculador.precioTotal(combo),
    pesoGramos: ComboCalculador.pesoTotalGramos(combo),
    tipo:COMBO,
    esNovedad: combo.esNovedad || false,
    images: combo.images?.map(imagenProductoToVM),
    estaDisponible: combo.estaDisponible || false
  };
}

// Esta lógica de formateo es puramente para la UI
//
function buildDescripcion(combo: Combo): string {
  const uniqueDescriptions = new Set(combo.items.map(i => i.descripcion));
  return `${combo.codigo}: ${Array.from(uniqueDescriptions).join(" + ")}`;
}