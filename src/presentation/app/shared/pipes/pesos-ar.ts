import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
  name: 'pesoArg'
  //standalone: true // para usarlo directamente en componentes standalone
})
export class PesoArgPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return formatCurrency(value, 'es-AR', '$', 'ARS', '1.0-0');
  }
}