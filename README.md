# 🛠️ Frontend Products App

Aplicación de gestión de productos desarrollada con **Angular** siguiendo principios de **Clean Architecture, SOLID y buenas prácticas de desarrollo**.  
Incluye **backend local en Node.js/Express** y pruebas unitarias con **Jest** con cobertura mínima del 70% (actualmente superior).

---

## 📂 Estructura del Proyecto

frontend-products-angular/
│── backend/ # API local (Node.js/Express)
│ ├── package.json
│ ├── src/
│ └── ...
│
│── src/ # Angular (frontend principal)
│── jest.config.ts
│── README.md
│── package.json # dependencias del frontend
└── ...


---

## 🚀 Requisitos

- **Node.js** v18 o superior  
- **npm** v9 o superior  
- **Angular CLI** v14 o superior  
- **Jest** (para pruebas unitarias)

---

## 🔧 Instalación

Clonar el repositorio:

`bash`
git clone [https://github.com/tu-usuario/frontend-products-angular.git](https://github.com/Rodriguezp809rd/frontend-products-angular.git)
cd frontend-products-angular

## Backend (API local)

Abrir terminal dentro de la carpeta backend/

Instalar dependencias:

npm install


Levantar servidor:

npm start


Por defecto el backend se ejecuta en:

http://localhost:3000

## Frontend (Angular)

Abrir terminal en la carpeta raíz (frontend-products-angular/)

Instalar dependencias:

npm install


Ejecutar en modo desarrollo:

npm start


Por defecto el frontend se ejecuta en:

http://localhost:4200

## Pruebas Unitarias

Ejecutar pruebas unitarias con Jest y generar reporte de cobertura:

npm run test:cov


Las pruebas cubren:

Componentes de UI (inputs, tablas, modales, loaders).

Servicios de aplicación.

Repositorios API e InMemory.

Interceptores HTTP.

Páginas principales (Home y Create Product).

La cobertura mínima exigida es 70% y actualmente se supera este umbral.

## Funcionalidades Implementadas

## Listado de productos con paginación, búsqueda y acciones.

## Creación de productos con validaciones y feedback visual.

## Edición de productos reutilizando el mismo formulario.

## Eliminación de productos con modal de confirmación.

## Manejo de errores HTTP con interceptor y notificaciones.

## Diseño modular y mantenible siguiendo Clean Architecture.

## Pruebas unitarias con Jest (coverage > 70%).

## Entregables

 Código fuente (Frontend + Backend en la misma carpeta).

 README.md con instrucciones claras de ejecución.

 Pruebas unitarias con cobertura mínima del 70%.

 Repositorio en GitHub público.

 Archivo .zip con todo el proyecto.

## Notas Finales

Se aplicaron principios SOLID y Clean Code.

El frontend fue desarrollado sin frameworks de estilos externos ni componentes preconstruidos.

Todos los mensajes de error y validaciones se manejan visualmente.

El backend es local y corre en paralelo con el frontend.

## Autor: Rodrigo Rodriguez Paulino
 Repositorio: GitHub - frontend-products-angular
