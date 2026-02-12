export interface Marca {
  id: string;
  nombre: string;

  fechaUltModificacion: string;   // ISO date
}

//ejemplo vista que debe venir como json
//es que en la fuente de datos no lo tengo asi debo ver la forma de enviarlo asi 
/* 
    {
        "id": "STAR_NUTRITION",
        "nombre": "Star Nutrition",
        "fechaUltModificacion": "2026-01-09T14:32:00Z"
    }
*/