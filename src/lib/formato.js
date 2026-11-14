// Formato de precios y fechas.
// Todos los precios del catálogo están en dólares por persona en habitación doble.

// Cotización de referencia para mostrar precios en pesos. Es un valor fijo de demo.
export const COTIZACION_UYU = 40;

export function formatearPrecio(usd, moneda = "USD") {
  const enPesos = moneda === "UYU";
  const valor = enPesos ? usd * COTIZACION_UYU : usd;
  const numero = Math.round(valor).toLocaleString("es-UY");
  return enPesos ? `$ ${numero}` : `US$ ${numero}`;
}

export function formatearFecha(iso, opciones = { day: "numeric", month: "long", year: "numeric" }) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-UY", opciones);
}

export function formatearFechaCorta(iso) {
  return formatearFecha(iso, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatearCantidad(numero, singular, plural) {
  return `${numero} ${numero === 1 ? singular : plural}`;
}