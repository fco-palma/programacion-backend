# Lily Pets

Tienda de productos para mascotas con una interfaz React, una API Express y persistencia en PostgreSQL.

## Estructura del proyecto

```text
coso_mascotas/
├── src/          Interfaz web vigente
├── backend/      API, autenticación y lógica del servidor
├── database/     Esquema, datos iniciales y consultas SQL
├── postman/      Colección y entorno para probar la API
├── index.html    Entrada de Vite
└── package.json  Comandos y dependencias del frontend
```

Dentro de `src/app/components/`, los componentes se agrupan por responsabilidad:

- `admin/`: administración de productos, categorías, anuncios e inventario.
- `auth/`: inicio de sesión y registro.
- `landing/`: contenido principal de la tienda.
- `layout/`: cabecera, pie de página y decoración global.
- `shop/`: catálogo, tarjetas y carrito.
- `ui/`: componentes base que realmente utiliza la aplicación.

## Funcionalidades principales

- Catálogo y categorías almacenados en PostgreSQL.
- Registro e inicio de sesión con cookies `HttpOnly`.
- Administración de productos, categorías, inventario y anuncios.
- Imágenes mediante URL o carga directa de JPG, PNG, WebP y GIF de hasta 5 MB.
- Tema visual persistente hasta que un administrador lo cambie.
- Carrusel de anuncios configurable bajo el buscador.
- Favoritos, carrito y pedidos por usuario.
- Colección Postman para comprobar las rutas de la API.

## Preparación

Instala las dependencias de ambas aplicaciones:

```bash
npm install
npm --prefix backend install
```

Después:

1. Inicia PostgreSQL y crea la base de datos `tienda_mascotas`.
2. Copia `backend/.env.example` como `backend/.env` y ajusta la conexión.
3. Crea o actualiza las tablas con `npm run db:setup`.
4. Configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `backend/.env`.
5. Crea la cuenta administrativa con `npm run admin:create`.

El archivo `backend/.env` contiene datos privados y está excluido del repositorio.

## Ejecución

Abre dos terminales desde la raíz del proyecto.

API:

```bash
npm run dev:api
```

Interfaz:

```bash
npm run dev
```

- Interfaz: `http://localhost:5173`
- API: `http://localhost:3000/api`
- Estado de la base: `http://localhost:3000/api/health`

Si el puerto `3000` ya está ocupado, detén la API anterior o cambia `PORT` en `backend/.env`. En ese caso también debes actualizar `VITE_API_URL` en el archivo `.env` de la raíz.

## Comprobaciones

```bash
npm run check
npm run test:smoke
```

`check` compila el frontend y revisa la sintaxis de la API. `test:smoke` requiere que la API y PostgreSQL estén funcionando; crea datos temporales, comprueba el flujo principal y los elimina al finalizar.

## Variables de entorno

Frontend, en `.env` (opcional si se usa el puerto predeterminado):

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Backend, en `backend/.env`:

```dotenv
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tienda_mascotas
DATABASE_SSL=false
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@lilypets.cl
ADMIN_PASSWORD=una_contraseña_segura
```

## API y Postman

Las rutas de la API se agrupan bajo `/api`: autenticación, productos, categorías, imágenes, configuración, anuncios, favoritos, carrito y pedidos.

La colección importable está en [`postman`](./postman). Consulta [`postman/README.md`](./postman/README.md) para ejecutar los flujos administrativo y de compra.
