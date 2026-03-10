import { ComboRepositorioPort } from "../../../aplication/ports/ComboRepositorio";
import { Combo } from "../../../domain/entities/Combo";
import { environment } from "../../../environments/environment.development";
import { fail, ok, Result } from "../../../shared/Result";
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

export class ComboFirebaseRepository implements ComboRepositorioPort {
  
  constructor(private firestore: Firestore) {}

  async getAll(): Promise<Result<Combo[]>> {
    try {
      const CACHE_KEY = 'mi_catalogo_combos_cache';
      const FECHA_KEY = 'mi_catalogo_combos_fecha';
      //AGREGAMOS EL VERSIONADO DE CACHÉ
      const VERSION_KEY = 'mi_catalogo_combos_version';
      const CURRENT_VERSION = '1.0.1'; // <-Subir este número (ej: '1.0.1') cuando queramos forzar a todos a borrar su caché

      const versionGuardada = localStorage.getItem(VERSION_KEY);

      // Si la versión del navegador es vieja o no existe, destruimos la caché
      if (versionGuardada !== CURRENT_VERSION) {
        console.log("Nueva versión detectada. Limpiando caché antigua...");
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(FECHA_KEY);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION); // Guardamos la versión nueva
      }

      const cacheGuardada = localStorage.getItem(CACHE_KEY);
      const ultimaFechaString = localStorage.getItem(FECHA_KEY);
      
      let combos: Combo[] = cacheGuardada ? JSON.parse(cacheGuardada) : [];
      
      // lamamaos a colección de combos en Firebase 
      const combosRef = collection(this.firestore, environment.firebase.coleccionCombos); 
      let consultaFirebase;

      if (combos.length > 0 && ultimaFechaString) {
        const fecha = new Date(parseInt(ultimaFechaString));
        consultaFirebase = query(combosRef, where('fechaActualizacion', '>', fecha));
      } else {
        consultaFirebase = query(combosRef);
      }

      const querySnapshot = await getDocs(consultaFirebase);

      if (!querySnapshot.empty) {
        console.log(`Se descargaron ${querySnapshot.size} combos actualizados de Firebase.`);

        let maxFechaServer = ultimaFechaString ? parseInt(ultimaFechaString) : 0;
        
        const combosModificados = querySnapshot.docs.map(doc => {
          const data = doc.data();

          if (data['fechaActualizacion']) {
            const fechaDocMs = data['fechaActualizacion'].toDate().getTime();
            if (fechaDocMs > maxFechaServer) {
              maxFechaServer = fechaDocMs;
            }
          }

          return {
            codigo: doc.id,
            marcaId: data['marcaId'],
            descripcion: data['descripcion'],
            precioTotal: data['precioTotal'],
            pesoTotalGramos: data['pesoTotalGramos'],
            items: data['items'] || [],
            images: data['images'] || [],
            estaDisponible: data['estaDisponible'] !== false, // Si no existe, asumimos true
            activo: data['activo'] !== false // Si no existe, asumimos true 
          } as Combo;
        });

        if (combos.length === 0) {
          combos = combosModificados;
        } else {
          combosModificados.forEach(comboNuevo => {
            const index = combos.findIndex(c => c.codigo === comboNuevo.codigo);
            if (index !== -1) {
              combos[index] = comboNuevo;
            } else {
              combos.push(comboNuevo);
            }
          });
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify(combos));
        localStorage.setItem(FECHA_KEY, maxFechaServer.toString());
        
      } else {
        console.log("No hubo cambios en Combos. Usando caché local.");
      }

      return ok(combos);
      
    } catch (error) {
      console.error("Error leyendo Combos de Firebase:", error);
      return fail(new Error("No se pudieron cargar los combos de la base de datos"));
    }
  }
}