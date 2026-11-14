# Rumbo Sur

Sitio de la agencia de viajes Rumbo Sur: catálogo de paquetes, cotizador, carrito y reservas.

Hecho con [TanStack Start](https://tanstack.com/start) (React 19), Sass y Tailwind. Las páginas se renderizan en el servidor con el [plugin de Cloudflare para Vite](https://developers.cloudflare.com/workers/vite-plugin/).

## Correr en local

```bash
npm install
npm run dev      # http://localhost:5173
```

## Compilar

```bash
npm run build    # -> dist/client (archivos estáticos) + dist/server (el Worker)
npm run preview
```

## Estructura

- `src/routes/` — páginas (rutas por archivo). `_site.jsx` es el layout común con cabecera y pie.
- `src/components/` — componentes del sitio; `ui/` son componentes base.
- `src/data/paquetes.json` — catálogo de paquetes. Las fotos están en `public/imagenes/`.
- `src/context/ViajeContext.jsx` — estado del carrito y las reservas, guardado en el navegador (localStorage).
- `src/lib/` — cotizador, filtros del catálogo, validación y formato.
- `src/styles/` — estilos Sass del sitio.
