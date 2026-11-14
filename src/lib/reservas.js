// Validación del formulario de reserva, códigos y persistencia local.

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_TELEFONO = /^\+?[\d\s-]{8,15}$/;

export function validarContacto({ nombre = "", email = "", telefono = "", acepta = false } = {}) {
  const errores = {};
  if (nombre.trim().length < 3) errores.nombre = "Escribí tu nombre completo.";
  if (!RE_EMAIL.test(email.trim())) errores.email = "El email no parece válido.";
  if (!RE_TELEFONO.test(telefono.trim())) errores.telefono = "Escribí un teléfono de 8 a 15 dígitos.";
  if (!acepta) errores.acepta = "Tenés que aceptar las condiciones.";
  return errores;
}

const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O, 0, I ni 1 para que no se confundan

export function generarCodigo(azar = Math.random) {
  let codigo = "RS-";
  for (let i = 0; i < 5; i++) codigo += LETRAS[Math.floor(azar() * LETRAS.length)];
  return codigo;
}

/** Identificador único para cada ítem del carrito. */
export function generarId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Lee JSON de localStorage sin romper si no existe, está corrupto o el navegador lo bloquea. */
export function leerGuardado(clave, porDefecto, almacen = globalThis.localStorage) {
  try {
    const crudo = almacen?.getItem(clave);
    if (!crudo) return porDefecto;
    const valor = JSON.parse(crudo);
    return Array.isArray(porDefecto) && !Array.isArray(valor) ? porDefecto : valor;
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor, almacen = globalThis.localStorage) {
  try {
    almacen?.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}