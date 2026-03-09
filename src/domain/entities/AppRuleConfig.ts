export interface EscalaPrecio {
  nivel: string;
  nombre: string;
  montoMinimo: number;
}

export interface AppRuleConfig {
  minimoGeneral: number;
  minimoConCombos: number;
  escalas: EscalaPrecio[];
}