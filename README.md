# PedidosWebMayorista (B2B E-commerce System)

## a. Descripción general del proyecto
PedidosWebMayorista es una Single Page Application (SPA) desarrollada en Angular. Nace como un software a medida solicitado por un comercio real y activo para resolver y digitalizar su proceso de ventas B2B (Business to Business).

El sistema se divide en dos grandes módulos:
1. **Catálogo Público y Checkout:** Permite a los clientes navegar por productos y combos, visualizando precios dinámicos que se ajustan automáticamente según el volumen de compra. Al finalizar, el pedido superando las reglas de negocio (mínimos de compra) se formatea y envía sin vía WhatsApp.
2. **Panel de Administración (Backoffice):** Un entorno privado y seguro donde el propietario del negocio puede gestionar en tiempo real el stock, la visibilidad del catálogo, las novedades y la configuración de las reglas de precios.

*Nota: Este proyecto fue diseñado como un MVP. Su arquitectura está preparada para que, en un futuro, la colección de pedidos en la base de datos sea consumida directamente por un sistema de escritorio propietario.*

---

## b. Stack tecnológico y Arquitectura

* **Frontend:** Angular (v20.x), TypeScript, HTML5, CSS.

* **Manejo de Estado:** Angular Signals.

* **Persistencia y Backend as a Service:** Firebase (Firestore para base de datos NoSQL, Firebase Auth para seguridad del Admin, Firebase Hosting).

### Arquitectura y Patrones de Diseño 
El proyecto está diseñado bajo los principios de **Clean Architecture** y principios **SOLID** para garantizar su escalabilidad y mantenibilidad:
* **Separación por Capas:** División entre `Domain` (reglas de negocio puras), `Application` (casos de uso), `Infrastructure` (conexión a Firebase) y `Presentation` (UI en Angular).

* **Patrón Facade:** Implementado en el frontend (`CartFacade`, `ProductFacade`, `ConfigFacade`) para actuar como "Directores de Orquesta", aislando por completo a los componentes visuales de la lógica de negocio compleja.

* **Inyección de Dependencias (Composition Root):** Uso de factorías para inyectar repositorios, facilitando el testing aislado (Mocking) y previniendo el acoplamiento a la base de datos.

* **Estrategia de Caché :** Implementación de un sistema de versionado en `localStorage` (`CATALOGO_VERSION`). Esto permite que la app cargue rapido y reduce los costos de lectura en Firebase, invalidando la caché solo cuando se detectan actualizaciones del servidor o cambios de versión forzados.
---

## c. Funcionalidades principales

### Experiencia del Cliente (B2B)
* **Catálogo Reactivo:** Visualización rápida de productos y combos con filtros multicriterio (por texto, marca, ofertas, novedades) procesados en tiempo real en el cliente.

* **Motor de Precios Dinámicos:** metodos que calculan la escala de precio correspondiente (Niveles 1 al 3) en base al subtotal del carrito, incentivando la compra por volumen.

* **Validación Estricta de Negocio:** El sistema calcula mínimos de compra dinámicos (que varían si el usuario incluye "Combos" en su pedido) y bloquea el checkout si detecta productos agotados.

* **WhatsApp Checkout:** Generación automática de una orden de compra detallada, enviada directamente al WhatsApp del comercio, lista para ser procesada.

### Gestión del Negocio
* **Seguridad (Auth & Guards):** Acceso restringido mediante Firebase Authentication y Angular Route Guards.

* **Dashboard de Configuración:** Interfaz para modificar en tiempo real el estado de la tienda (Modo Mantenimiento), teléfono de contacto, mínimos de compra y nombres/montos de las escalas de precios mayoristas.

* **Gestión de Catálogo (Toggle Rápido):** Tabla administrativa para activar/desactivar productos, marcar novedades (con caducidad automática de 30 días) y ajustar unidades por caja sin necesidad de recargar la página.

---

## d. Estructura del proyecto
El código fuente sigue una organización basada en dominios y responsabilidades (Clean Architecture):

```text
src/
├─ aplication/          # Casos de uso (ej. GetProductosUseCase) y Puertos (Interfaces)
├─ composition/         # Factories para la Inyección de dependencias
├─ constantes/          # Variables globales (Keys de storage, configuración de caché)
├─ domain/              # Lógica de negocio pura (Entidades, Value Objects, Calculadoras)
├─ infrastructure/      # Implementaciones de BD (FirebaseRepositories) y Mappers
├─ shared/              # Utilidades transversales a toda la app (Patrón Result)
└─ presentation/        # Capa de Interfaz de Usuario (Angular)
   ├─ app/admin/        # Componentes del Backoffice (Login, Dashboard, Tabla de Productos)
   ├─ app/cart/         # Lógica visual del carrito lateral y widget flotante
   ├─ app/facades/      # Servicios Facade que manejan el estado con Angular Signals
   ├─ app/products/     # Componentes de UI (Listas, Tarjetas, Buscador)
   └─ app/shared/       # Componentes y utilidades reutilizables (Modales, Alertas, Pipes)
```
---
## URL DESPLIEGUE
* ruta pública:  https://web-mayorista-3a54c.web.app/productos/productos

* ruta admin: https://web-mayorista-3a54c.web.app/productos/admin  (environment y claves en slides)



