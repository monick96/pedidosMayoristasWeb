export const STORAGE_KEYS = {
  // Carrito y Cliente
  CART: 'mayorista_cart_v1',
  CLIENT_NAME: 'mayorista_cliente_nombre',
  
  // Caché de Productos
  PRODUCTOS_CACHE: 'mi_catalogo_cache',
  PRODUCTOS_FECHA: 'mi_catalogo_ultima_fecha',
  PRODUCTOS_VERSION: 'mi_catalogo_version',
  
  // Caché de Combos
  COMBOS_CACHE: 'mi_catalogo_combos_cache',
  COMBOS_FECHA: 'mi_catalogo_combos_fecha',
  COMBOS_VERSION: 'mi_catalogo_combos_version',
};

export const APP_CONFIG = {
  // Subir este número (ej: '1.0.2') en el futuro si necesitamos que TODOS 
  // los clientes borren su caché y bajen el catálogo de cero.
  CATALOGO_VERSION: '1.0.1', 
  
  // Duración de la etiqueta "Novedad" (30 días en milisegundos)
  NOVEDAD_DURATION_MS: 30 * 24 * 60 * 60 * 1000, 
};

export const DEFAULT_IMAGES = {
  // Imagen a usar cuando un producto/combo no tiene foto en TiendaNube
  NO_PHOTO: 'https://dcdn-us.mitiendanube.com/assets/stores/img/no-photo-1024-1024.webp',
  ALT: "Imagen no disponible"
};
