# PedidosWebMayorista
### Estado readme: borrador
## a) Descripción general del proyecto

PedidosWebMayorista es una SPA desarrollada con Angular (TypeScript) pensada y diseñada como MVP para la gestión de pedidos mayoristas. Permite a usuarios registrarse, navegar catálogo de productos y combos (con mínimos de compra), ver precios por defecto, armar un carrito y crear pedidos que quedan almacenados en Firestore. Estos orders seran retomados desde una app de escritorio del comerciante; leerá la colección `orders` directamente desde el mismo proyecto Firebase para procesar pedidos y notificar al dueño.

Estado del proyecto: desarrollo en producción. Este trabajo corresponde a una funcionalidad solicitada por un comercio real con el que colaboro. La aplicación de escritorio del comerciante ya está desarrollada y en uso, aunque actualmente no dispone aún de la capacidad para leer y procesar la colección `orders` de este proyecto Firebase. La integración (lectura en tiempo real de `orders`, gestion de estados y notificaciones) está pensada como parte del alcance futuro.

## b) Stack tecnológico utilizado
- Lenguajes: TypeScript, HTML, CSS
- Frontend: Angular (proyecto generado con Angular CLI; versión 20.x en package.json)
- Arquitectura: Clean Architecture (Domain, Application, Infrastructure, Presentation, Cmposition, Shared)
- Persistencia y hosting: Firebase (Firestore, Auth, Hosting) con plan Spark (gratuito) por que aun es un MVP

## c) Información sobre instalación y ejecución

Requisitos previos:
- Git
- Node.js (recomendado 18.x)
- npm (o algun otro gestor de dependencias node)

Clonar repo:
```
git clone https://github.com/monick96/web-app-mayorista-pedidos-va.git
cd web-app-mayorista-pedidos-va
```

Instalar dependencias (con npm):
```
npm i
```

Levantar el server:
```
ng serve
```

## d) Estructura del proyecto
```
src/
├─ main.ts                       # bootstrap de Angular
├─ index.html
├─ styles.css
├─ environments/
│  ├─ environment.ts
│  └─ environment.prod.ts
├─ presentation/                  # Capa UI (Angular)
│  ├─ app/
│  │  ├─ app.ts
│  │  ├─ app.html
│  │  ├─ app.css
│  │  ├─ app.routes.ts
│  │  └─ app.config.ts
│  ├─ pages/
│  │  ├─ catalog/
│  │  ├─ product/
│  │  ├─ cart/
│  │  ├─ checkout/
│  │  ├─ auth/                    # login / register / profile
│  │  └─ not-authorized/          # pantalla para usuarios pendientes
│  ├─ components/                 # botones, product-card, combo-card, price-badge...
│  └─ services/                   # adaptadores Angular que usan use-cases
├─ domain/                        # Lógica pura (no depende de Angular)
│  ├─ entities/
│  │  ├─ Producto.ts
│  │  ├─ Combo.ts
│  │  └─ Order.ts
│  ├─ value-objects/
│  └─ errors/
├─ application/                   # Casos de uso y puertos (interfaces)
│  ├─ use-cases/
│  │  ├─ CalculatePrice.ts
│  │  ├─ CreateOrder.ts
│  │  └─ ListProducts.ts
│  └─ ports/
│     ├─ repositories/
│     │  ├─ IProductRepository.ts
│     │  └─ IOrderRepository.ts
│     └─ notifiers/
│        └─ INotifier.ts
├─ infrastructure/                # Implementaciones concretas (Firestore, Firebase Auth)
│  └─ firebase/
│     ├─ productRepository.firestore.ts
│     ├─ orderRepository.firestore.ts
│     └─ auth.adapter.ts
├─ shared/
│  └─ Result.ts                   # helper Result<T,E>
├─ assets/
├─ docs/                          # ERD, diagramas, ejemplos, guías para desktop
├─ seed/                          # seeds JSON para poblar Firestore local
tests/                            # e2e / integration tests (opcional)
firebase.json
firestore.rules
package.json
README.md
```

## e) Funcionalidades principales
- Registro e inicio de sesión de usuarios (Firebase Auth)

    - Descripción: registro con email/password; al registrarse se crea users/{uid} con authorized: true (MVP).
    - Criterio de aceptación: usuario puede registrarse y acceder a catálogo con precios por defecto.
    - Implementación: Presentation (UI) + Infrastructure (auth.adapter) + users doc create.
- Listado y detalle de productos (Catálogo)

    - Descripción: ver lista paginada, búsqueda básica, filtro por marca/categoría, ver detalle con imágenes.
    - Criterio de aceptación: muestra defaultPrice y botón "Añadir al carrito".
    - Implementación: domain Produto, application ListProducts, infra productRepository.firestore, presentation components/pages.

- Listado de Combos 

    - Descripción: combos compuestos por items con minPurchaseQty. En MVP los combos se muestran y validan en frontend.
    - Criterio de aceptación: UI muestra combos; al añadir al carrito valida minPurchaseQty.
    - Implementación: domain Combo, validation en use-case y UI.

- Carrito y checkout (crear pedido)

    - Descripción: cliente arma carrito, calcula totales (CalculatePrice) y crea orders/{orderId} en Firestore con snapshot detalla.
    - Criterio de aceptación: nuevo documento order con items unitPrice/lineTotal, subtotal y total, status "pending".
    - Implementación: application CreateOrder + orderRepository.firestore.

- Precios por defecto y cálculo básico (CalculatePrice)

    - Descripción: mostrar precio por defecto (product.precioBase).
    - Criterio de aceptación: cálculo consistente, precios guardados en order snapshot.
    - Implementación: use-case CalculatePrice en application layer.

- Persistencia en Firestore (orders consumibles por app desktop)

    - Descripción: la desktop leerá orders directamente del mismo proyecto Firebase.
    - Criterio de aceptación: orders contienen toda la info necesaria para procesar pedidos (schemaVersion incluido).
    - Implementación: order document schema definido y versionado.


