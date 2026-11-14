import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import paquetes from "@/data/paquetes";
import { cotizar } from "@/lib/cotizador";
import { generarCodigo, generarId, guardar, leerGuardado } from "@/lib/reservas";

const ViajeContext = createContext(null);

const CLAVES = { carrito: "rumbosur:carrito", reservas: "rumbosur:reservas", moneda: "rumbosur:moneda" };

/** Une un ítem del carrito con su paquete y su cotización. Descarta ítems de paquetes que ya no existen. */
function enriquecer(item) {
  const paquete = paquetes.find((p) => p.id === item.paqueteId);
  const salida = paquete?.salidas.find((s) => s.fecha === item.salida);
  if (!paquete || !salida) return null;
  const cotizacion = cotizar(paquete.precio, { ...item, temporadaAlta: salida.alta });
  return cotizacion.valido ? { ...item, paquete, salida, cotizacion } : null;
}

export function ViajeProvider({ children }) {
  // Arranca vacío para que el HTML del servidor y el del cliente coincidan;
  // lo guardado se lee en un efecto, ya en el navegador.
  const [carrito, setCarrito] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [moneda, setMoneda] = useState("USD");
  const [aviso, setAviso] = useState(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setCarrito(leerGuardado(CLAVES.carrito, []));
    setReservas(leerGuardado(CLAVES.reservas, []));
    const guardada = leerGuardado(CLAVES.moneda, "USD");
    if (guardada === "UYU" || guardada === "USD") setMoneda(guardada);
    setListo(true);
  }, []);

  useEffect(() => {
    if (listo) guardar(CLAVES.carrito, carrito);
  }, [carrito, listo]);

  useEffect(() => {
    if (listo) guardar(CLAVES.reservas, reservas);
  }, [reservas, listo]);

  useEffect(() => {
    if (listo) guardar(CLAVES.moneda, moneda);
  }, [moneda, listo]);

  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  const items = useMemo(() => carrito.map(enriquecer).filter(Boolean), [carrito]);
  const total = items.reduce((suma, i) => suma + i.cotizacion.total, 0);

  const agregar = useCallback((item) => {
    setCarrito((actual) => [...actual, { ...item, id: generarId() }]);
    setAviso("Viaje agregado a tu carrito");
  }, []);

  const quitar = useCallback((id) => setCarrito((actual) => actual.filter((i) => i.id !== id)), []);
  const vaciar = useCallback(() => setCarrito([]), []);

  const confirmar = useCallback(
    (contacto) => {
      const reserva = {
        codigo: generarCodigo(),
        fecha: new Date().toISOString(),
        contacto,
        moneda,
        items: items.map(({ paquete, salida, cotizacion, adultos, ninos, habitacion }) => ({
          paqueteId: paquete.id,
          titulo: paquete.titulo,
          salida: salida.fecha,
          adultos,
          ninos,
          habitacion,
          total: cotizacion.total,
        })),
        total,
      };
      setReservas((actual) => [reserva, ...actual]);
      setCarrito([]);
      return reserva;
    },
    [items, total, moneda],
  );

  const cancelarReserva = useCallback((codigo) => {
    setReservas((actual) => actual.filter((r) => r.codigo !== codigo));
    setAviso(`Reserva ${codigo} cancelada`);
  }, []);

  const valor = {
    paquetes,
    items,
    total,
    reservas,
    moneda,
    aviso,
    setMoneda,
    agregar,
    quitar,
    vaciar,
    confirmar,
    cancelarReserva,
  };

  return <ViajeContext.Provider value={valor}>{children}</ViajeContext.Provider>;
}

export function useViaje() {
  const ctx = useContext(ViajeContext);
  if (!ctx) throw new Error("useViaje tiene que usarse dentro de <ViajeProvider>");
  return ctx;
}