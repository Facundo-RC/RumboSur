// Lógica del catálogo: búsqueda, filtros y orden.
import paquetes from "@/data/paquetes";

export const ETIQUETAS_TIPO = {
  playa: "Playa",
  nieve: "Nieve",
  ciudad: "Ciudad",
  aventura: "Aventura",
  escapada: "Escapada",
};

export const TIPOS = Object.keys(ETIQUETAS_TIPO);

export const ORDENES = [
  { valor: "destacados", texto: "Destacados" },
  { valor: "precio-asc", texto: "Menor precio" },
  { valor: "precio-desc", texto: "Mayor precio" },
  { valor: "noches", texto: "Más noches" },
  { valor: "nombre", texto: "A – Z" },
];

export const CANTIDAD_TEXTO = (n) => `${n} ${n === 1 ? "paquete" : "paquetes"}`;

/** Pasa a minúsculas y saca tildes: "Florianópolis" -> "florianopolis". */
export function normalizar(texto = "") {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const FILTROS_INICIALES = {
  busqueda: "",
  tipo: "todos",
  region: "todas",
  precioMax: null,
  mes: null,
  orden: "destacados",
};

export function filtrarPaquetes(lista, filtros = FILTROS_INICIALES) {
  const { busqueda, tipo, region, precioMax, mes } = { ...FILTROS_INICIALES, ...filtros };
  const termino = normalizar(busqueda);

  return lista.filter((p) => {
    if (tipo !== "todos" && p.tipo !== tipo) return false;
    if (region !== "todas" && p.region !== region) return false;
    if (precioMax != null && p.precio > precioMax) return false;
    if (mes && !(p.salidas ?? []).some((salida) => salida.fecha.slice(0, 7) === mes)) return false;
    if (termino) {
      const texto = normalizar(`${p.destino} ${p.pais} ${p.titulo} ${p.region}`);
      if (!texto.includes(termino)) return false;
    }
    return true;
  });
}

const comparadores = {
  destacados: (a, b) => Number(b.destacado) - Number(a.destacado) || a.precio - b.precio,
  "precio-asc": (a, b) => a.precio - b.precio,
  "precio-desc": (a, b) => b.precio - a.precio,
  noches: (a, b) => b.noches - a.noches,
  nombre: (a, b) => a.destino.localeCompare(b.destino, "es"),
};

export function ordenarPaquetes(lista, orden = "destacados") {
  const comparar = comparadores[orden] ?? comparadores.destacados;
  return [...lista].sort(comparar);
}

export function buscarPaquetes(lista, filtros) {
  return ordenarPaquetes(filtrarPaquetes(lista, filtros), filtros?.orden);
}

/** Valores distintos de un campo, en orden alfabético. */
export function valoresUnicos(lista, campo) {
  return [...new Set(lista.map((p) => p[campo]))].sort((a, b) => a.localeCompare(b, "es"));
}

export const REGIONES = valoresUnicos(paquetes, "region");

// Meses con salidas cargadas: "2027-01" -> "Enero 2027". La búsqueda de la portada
// y el filtro del catálogo comparten esta lista.
const NOMBRES_MES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const MESES_DISPONIBLES = [
  ...new Set(paquetes.flatMap((p) => (p.salidas ?? []).map((salida) => salida.fecha.slice(0, 7)))),
]
  .sort()
  .map((valor) => {
    const [anio, mes] = valor.split("-").map(Number);
    return { valor, texto: `${NOMBRES_MES[mes - 1]} ${anio}` };
  });

export function buscarPaquete(id) {
  return paquetes.find((p) => p.id === id) ?? null;
}

export function paquetesPorTipo(tipo) {
  return paquetes.filter((p) => p.tipo === tipo);
}

/** Un paquete representativo de cada estilo, para las tarjetas de estilo de viaje. */
export function imagenDeTipo(tipo) {
  return paquetesPorTipo(tipo)[0]?.imagen;
}