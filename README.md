# Chat grupal con WebSocket · TICS316

Dos carpetas:

- `servidor/` — servidor de chat en Deno (lo despliega el profesor, una sola vez).
- `cliente/` — cliente base en React + Vite (cada estudiante lo rediseña y lo publica en Vercel).

## Protocolo (el contrato entre cliente y servidor)

Todo viaja como texto JSON (`JSON.stringify` para enviar, `JSON.parse` para recibir).

| Mensaje | Dirección | Contenido |
|---|---|---|
| entrar | cliente → servidor | `{ tipo: "entrar", nombre }` |
| mensaje | cliente → servidor | `{ tipo: "mensaje", texto }` |
| mensaje | servidor → todos | `{ tipo: "mensaje", nombre, texto, hora }` |
| sistema | servidor → todos | `{ tipo: "sistema", texto, hora }` |
| usuarios | servidor → todos | `{ tipo: "usuarios", lista: [...] }` |
| historial | servidor → recién llegado | `{ tipo: "historial", mensajes: [...] }` |

Reglas del servidor: nombre máx. 20 caracteres, texto máx. 300, mensajes vacíos se ignoran, no se acepta `mensaje` antes de `entrar`, se guardan los últimos 30 mensajes.

## Servidor (profesor)

Local: `deno run --allow-net --allow-env main.ts` (puerto 8000, o el de la variable `PORT`).
Prueba automática con el servidor encendido: `deno run --allow-net prueba.ts`.
Abrir `http://localhost:8000` en el navegador responde "Servidor de chat TICS316 activo".

### Dónde publicarlo

Vercel **no** sirve para el servidor: sus funciones terminan al responder y no mantienen conexiones abiertas. Usa un host con proceso persistente:

- **Render / Railway / Fly.io**: incluye `Dockerfile`; crea un Web Service desde el repositorio.
- **Deno Deploy**: sube `main.ts` como app.

**Importante:** el servidor guarda las conexiones en memoria, así que debe correr en **una sola instancia**. Si el host crea varias, los usuarios conectados a instancias distintas no se verán entre sí.
En planes gratuitos el servicio puede dormirse: ábrelo (`https://tu-servidor/`) unos minutos antes de la clase.

La URL que se entrega a los estudiantes es la del servicio cambiando `https://` por `wss://`.

Plan B sin hosting: levantar el servidor en tu computador y exponerlo con un túnel (por ejemplo Cloudflare Tunnel), que entrega una URL https/wss. Una página en Vercel no puede conectarse a `ws://` (contenido mixto).

## Cliente (estudiantes)

```
cd cliente
npm install
cp .env.example .env.local   # editar VITE_WS_URL
npm run dev
```

La lógica de WebSocket está en `src/useChat.js`; la interfaz en `src/App.jsx` y `src/App.css`: ahí está el espacio para rediseñar.

### Publicar en Vercel

1. Subir el proyecto a GitHub.
2. Vercel → Add New → Project → importar el repositorio (detecta Vite solo).
3. En Environment Variables: `VITE_WS_URL = wss://<URL del servidor>`.
4. Deploy. Si cambias la variable, hay que volver a desplegar (Vite la lee al construir).

### Si no conecta

- Se queda en "reconectando…": URL mal escrita o servidor dormido. Abre la URL https:// del servidor en el navegador.
- Funciona local pero no en Vercel: usaste `ws://` en vez de `wss://`.
- Cambiaste la variable y nada cambia: redesplegar.
