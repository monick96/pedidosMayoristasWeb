import { EscalaPrecio } from '../entities/AppRuleConfig';

export class CalculadorPrecio {
  /**
   * función pura: entra un total y escalas, sale la escala activa.
   * Es facilísima de testear.
   */
  static determinarEscalaActiva(totalNominal: number, escalas: EscalaPrecio[]): EscalaPrecio {
    if (!escalas || escalas.length === 0) {
      return { nivel: "nivel 1", nombre: 'Precio 1', montoMinimo: 0 };
    }
    // Solo consideramos las primeras 3 para el cálculo según regla de negocio (por ahora)
    const escalasPermitidas = escalas.slice(0, 3); 
    return [...escalasPermitidas].reverse().find(e => totalNominal >= e.montoMinimo) || escalas[0];
  }

  static calcularFaltaParaMinimo(total: number, minimo: number): number {
    const falta = minimo - total;
    return falta > 0 ? falta : 0;
  }
}