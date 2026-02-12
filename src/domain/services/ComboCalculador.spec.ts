import { ComboCalculador } from "./ComboCalculador";

describe('ComboCalculador', () => {
  const mockCombo: any = {
    items: [
      { precioUnitario: 100, cantidad: 2, pesoGramos: 500 }, // Total: 200, Peso: 1000
      { precioUnitario: 50, cantidad: 1, pesoGramos: 100 }   // Total: 50,  Peso: 100
    ]
  };


  it('debería calcular el precio total multiplicando cantidades', () => {
    const total = ComboCalculador.precioTotal(mockCombo);
    expect(total).toBe(250);
  });


  it('debería calcular el peso total en gramos', () => {
    const peso = ComboCalculador.pesoTotalGramos(mockCombo);
    expect(peso).toBe(1100);
  });
  
});