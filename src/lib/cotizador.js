// Cálculo del precio de un viaje. Todos los precios del catálogo son por persona
// en habitación doble. Sin DOM para poder testearlo.

export const REGLAS = {
  factorNino: 0.7, // un niño (2 a 11 años) paga el 70 %
  recargoSingle: 0.35, // habitación single: +35 % para ese adulto
  recargoTemporadaAlta: 0.15,
  descuentoGrupo: 0.05, // 5 % de descuento desde 4 viajeros
  minimoGrupo: 4,
  maxViajeros: 9,
};

export function validarViajeros({ adultos, ninos, habitacion }) {
  const errores = [];
  if (!Number.isInteger(adultos) || adultos < 1) errores.push("Tiene que viajar al menos un adulto.");
  if (!Number.isInteger(ninos) || ninos < 0) errores.push("La cantidad de niños no es válida.");
  if (adultos + ninos > REGLAS.maxViajeros) errores.push(`El máximo por reserva es de ${REGLAS.maxViajeros} viajeros.`);
  if (habitacion === "single" && (adultos !== 1 || ninos > 0)) {
    errores.push("La habitación single es para un adulto que viaja solo.");
  }
  return errores;
}

const redondear = (n) => Math.round(n * 100) / 100;

/**
 * Devuelve el desglose del precio en USD.
 * opciones: { adultos, ninos, habitacion: 'doble' | 'single', temporadaAlta: boolean }
 */
export function cotizar(precioBase, { adultos = 1, ninos = 0, habitacion = "doble", temporadaAlta = false } = {}) {
  const errores = validarViajeros({ adultos, ninos, habitacion });
  if (errores.length) return { valido: false, errores };

  const base = precioBase * (temporadaAlta ? 1 + REGLAS.recargoTemporadaAlta : 1);
  const subtotalAdultos = base * adultos;
  const subtotalNinos = base * REGLAS.factorNino * ninos;
  const recargoSingle = habitacion === "single" ? base * REGLAS.recargoSingle : 0;
  const subtotal = subtotalAdultos + subtotalNinos + recargoSingle;
  const viajeros = adultos + ninos;
  const descuento = viajeros >= REGLAS.minimoGrupo ? subtotal * REGLAS.descuentoGrupo : 0;

  return {
    valido: true,
    errores: [],
    viajeros,
    precioPorAdulto: redondear(base),
    subtotalAdultos: redondear(subtotalAdultos),
    subtotalNinos: redondear(subtotalNinos),
    recargoSingle: redondear(recargoSingle),
    descuento: redondear(descuento),
    total: redondear(subtotal - descuento),
  };
}