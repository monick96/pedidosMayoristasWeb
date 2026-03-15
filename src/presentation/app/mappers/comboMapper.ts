import { Combo } from "../../../domain/entities/Combo";
import { ComboCalculador } from "../../../domain/services/ComboCalculador";
import { ComboVM } from "../models/comboVm";
import { COMBO } from "../../../domain/value-objects/TipoProducto";

import { imagenProductoToVM } from "./productoMapper";

export function comboToVM(combo: Combo): ComboVM {
  // Calculamos el precio final antes
  // El operador '??' significa "Si es null o undefined, usa lo de la derecha"
  const precioFinal = combo.precioTotal ?? ComboCalculador.precioTotal(combo);

   // Verificamos si la lista imagenes está vacía o es nula
  const imagenesVacias = !combo.images || combo.images.length === 0;
 
  return {
    codigo: combo.codigo,
    //titulo: buildDescripcion(combo),
    marcaId: (combo as any).marcaId || null, 
    descripcion: buildDescripcion(combo), //+ combo.descripcion,
    precioFinal,
    pesoGramos: ComboCalculador.pesoTotalGramos(combo),
    tipo:COMBO,
    esNovedad: combo.vencimientoNovedadMs 
             ? Date.now() < combo.vencimientoNovedadMs 
             : (combo.esNovedad || false),
    images:imagenesVacias 
      ? [{ url: 'https://dcdn-us.mitiendanube.com/assets/stores/img/no-photo-1024-1024.webp', alt: 'imagen por defecto' }]
      : combo.images?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(imagenProductoToVM),
  
    estaDisponible: (combo.estaDisponible || false) && precioFinal > 0,
    activo: combo.activo !== false // Si no existe el campo, asumimos que es true
  };

}

// Esta lógica de formateo es puramente para la UI
//
function buildDescripcion(combo: Combo): string {
  const uniqueDescriptions = new Set(combo.items.map(i => i.descripcion));
  return `${combo.codigo}: ${Array.from(uniqueDescriptions).join(" + ")}`;
}