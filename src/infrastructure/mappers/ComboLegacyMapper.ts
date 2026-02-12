import { ComboLegacyDTO } from "../peristence/dto/ComboLegacyDTO";
import {Combo} from "../../domain/entities/Combo";

export function mapLegacyDtoToCombos(rows: ComboLegacyDTO[]): Combo[] {

  const map = new Map<string, Combo>();

  for (const row of rows) {

    if (!map.has(row.codigoCombo)) {
      map.set(row.codigoCombo, {
        codigo: row.codigoCombo,
        descripcion: row.descripcion,
        marcaId: row.marcaCombo,
        esNovedad: row.esNovedad,
        items: [],
        images:[]
      });
    }

    map.get(row.codigoCombo)!.items.push({
      codigoProducto: row.codigoProducto,
      codigoComboProducto: row.codigoComboProducto,
      cantidad: row.cantidad,
      precioUnitario: row.precio,
      pesoGramos: row.pesoGramos,
      descripcion:row.descripcion
    });
  }

  return Array.from(map.values());
}