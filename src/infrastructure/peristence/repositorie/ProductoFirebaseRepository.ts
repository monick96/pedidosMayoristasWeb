import { ProductoRepositoryPort } from "../../../aplication/ports/ProductoRepositorioPort";
import { Producto } from "../../../domain/entities/Producto";
import { environment } from "../../../environments/environment.development";
import { fail, ok, Result } from "../../../shared/Result";
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

export class ProductoFirebaseRepository implements ProductoRepositoryPort {
  
  // Pedimos la conexión a la base de datos
  constructor(private firestore: Firestore) {}

  async getAll(): Promise<Result<Producto[]>> {
    try {
      const CACHE_KEY = 'mi_catalogo_cache';
      const FECHA_KEY = 'mi_catalogo_ultima_fecha';

      //Leemos lo que tenemos guardado en el navegador del cliente
      const cacheGuardada = localStorage.getItem(CACHE_KEY);
      const ultimaFechaString = localStorage.getItem(FECHA_KEY);
      
      let productos: Producto[] = cacheGuardada ? JSON.parse(cacheGuardada) : [];
      const productosRef = collection(this.firestore, environment.firebase.coleccionProductos);
      let consultaFirebase;

      //Armamos la consulta inteligente
      if (productos.length > 0 && ultimaFechaString) {
        // Si ya tenemos caché, pedimos SOLO los productos modificados después de esa fecha
        const fecha = new Date(parseInt(ultimaFechaString));
        consultaFirebase = query(productosRef, where('fechaActualizacion', '>', fecha));

      } else {
        // Si es la primera vez que el cliente entra, traemos TODO (Las primeras 537 lecturas)
        consultaFirebase = query(productosRef);
      }

      //Ejecutamos la consulta a Firebase
      const querySnapshot = await getDocs(consultaFirebase);

      //Si hay documentos nuevos o modificados, actualizamos nuestra caché
      if (!querySnapshot.empty) {
        console.log(`Se descargaron ${querySnapshot.size} productos actualizados de Firebase.`);

        let maxFechaServer = ultimaFechaString ? parseInt(ultimaFechaString) : 0;
        
        const productosModificados = querySnapshot.docs.map(doc => {
          const data = doc.data();

          //Extraemos la fecha del servidor que guardó Java (si existe)
          if (data['fechaActualizacion']) {
            // toDate() convierte el Timestamp de Firebase a un Date de Javascript
            const fechaDocMs = data['fechaActualizacion'].toDate().getTime();

            if (fechaDocMs > maxFechaServer) {
              maxFechaServer = fechaDocMs;
            }

          }

          return {
            codigo: doc.id,
            marcaId: data['marcaId'],
            sabor: data['sabor'],
            descripcion: data['descripcion'],
            precioBase: data['precioBase'],
            porcentajePrecioSugerido: data['porcentajePrecioSugerido'],
            porcentajeDescuento: data['porcentajeDescuento'],
            pesoGramos: data['pesoGramos'],
            pesoKg: data['pesoKg'],
            esNovedad: data['esNovedad'] || false,
            estaDisponible: data['estaDisponible'],
            unidadesPorCaja: data['unidadesPorCaja'] || 0,
            preciosMayorista: data['preciosMayorista'] || [],
            images: data['images'] || [],
            activo: data['activo'] || true // Por defecto, si no se especifica, consideramos el producto como activo
          } as Producto;
        });

        if (productos.length === 0) {
          // Si no había caché, los modificados son el catálogo entero
          productos = productosModificados;

        } else {
          // Si había caché, buscamos el producto viejo y lo reemplazamos por el nuevo
          productosModificados.forEach(prodNuevo => {

            const index = productos.findIndex(p => p.codigo === prodNuevo.codigo);

            if (index !== -1) {
              productos[index] = prodNuevo; // Actualiza el existente
            } else {
              productos.push(prodNuevo);    // Agrega si es totalmente nuevo
            }

          });

        }

        //Guardamos en el navegador para la próxima visita
        localStorage.setItem(CACHE_KEY, JSON.stringify(productos));

        //Guardamos la hora del SERVIDOR, no la del celular para usarla en el próximo query
        localStorage.setItem(FECHA_KEY, maxFechaServer.toString());
        
      } else {

        console.log("No hubo cambios en Firebase. Usando 100% la caché local (Costo 0 lecturas).");

      }

      // Devolvemos la lista final al Facade
      return ok(productos);
      
    } catch (error) {
      console.error("Error leyendo Firebase:", error);
      return fail(new Error("No se pudieron cargar los productos de la base de datos"));
    }
  }

}