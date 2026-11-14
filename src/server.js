// Punto de entrada del Worker: renderiza cada página en el servidor con TanStack Start.
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

export default { fetch: createStartHandler(defaultStreamHandler) };
