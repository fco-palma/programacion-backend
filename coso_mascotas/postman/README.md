# Colección Postman de Lily Pets

## Importar

1. Inicia la API con `npm.cmd run dev:api` desde la raíz del proyecto.
2. En Postman selecciona **Import**.
3. Importa `Lily_Pets_API.postman_collection.json`.
4. Importa `Lily_Pets_Local.postman_environment.json`.
5. Selecciona el entorno **Lily Pets - Local**.
6. Edita el entorno y completa `adminPassword` con el valor configurado en `backend/.env`.

Postman guarda automáticamente la cookie `pet_session`. Al iniciar una sesión nueva, reemplaza la sesión anterior para `localhost`.

## Flujos recomendados

### Administración

1. `01 - Estado y catálogo / Estado de la API y PostgreSQL`.
2. `02 - Autenticación / Login administrador`.
3. `03 - Administración de categorías / Crear categoría`.
4. `04 - Administración de productos / Crear producto`.
5. Ejecuta las consultas de actualización o eliminación que quieras probar.

Para probar la carga local, ejecuta `03B - Carga de imágenes / Subir imagen desde el equipo`, selecciona un archivo en **Body** y usa la variable `uploadedImageUrl` en una categoría o producto.

Las peticiones de creación guardan automáticamente `categoryId` y `productId` en el entorno.

### Compra de cliente

1. `02 - Autenticación / Reiniciar correo del cliente de prueba`.
2. `02 - Autenticación / Registrar cliente`.
3. Elige un producto activo y establece su identificador en `productId`.
4. `05 - Favoritos / Agregar favorito`.
5. `06 - Carrito / Agregar o cambiar cantidad`.
6. `07 - Pedidos / Crear pedido`.
7. `07 - Pedidos / Listar mis pedidos`.

Crear un pedido descuenta stock real. Usa productos de prueba si no quieres modificar el inventario inicial.
