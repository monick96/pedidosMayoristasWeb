export interface ComboLegacyDTO {//como lo voya mandar desde la app mayorista a firebase
  codigoComboProducto: string;   // COMBO1-PROD1 //el codigo original en app mayorista
  codigoCombo: string;           // COMBO1
  codigoProducto: string;        // PROD1
  marcaCombo: string; 
  cantidad: number;
  descripcion: string;
  precio: number;
  pesoGramos?: number;
  images?: string[];
  esNovedad?: boolean; 
}