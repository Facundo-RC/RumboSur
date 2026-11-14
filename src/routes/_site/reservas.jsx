import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import BotonSolar from "@/components/BotonSolar";
import { useViaje } from "@/context/ViajeContext";
import { formatearPrecio } from "@/lib/formato";

export const Route = createFileRoute("/_site/reservas")({
  head: () => ({ meta: [{ title: "Mis reservas — Rumbo Sur" }] }),
  component: Reservas,
});

function formatearSello(iso) {
  return new Date(iso).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatearSalida(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-UY", { day: "numeric", month: "short", year: "numeric" });
}

function Reservas() {
  const { reservas, moneda, cancelarReserva } = useViaje();

  return (
    <section className="carrito-pagina">
      <div className="container">
        <p className="antetitulo">Paso 3 de 3</p>
        <h1 className="titulo-pagina">Mis reservas</h1>
        <p className="entradilla">
          Las reservas de este navegador. Cada una tiene un código para consultar por teléfono o email.
        </p>

        <div style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
          {reservas.length === 0 ? (
            <Reveal className="vacio">
              <p className="vacio__titulo">No tenés reservas guardadas</p>
              <p className="suave" style={{ marginBottom: "1.75rem" }}>
                Cuando confirmes una cotización va a aparecer acá con su código.
              </p>
              <BotonSolar to="/paquetes">Ver los destinos</BotonSolar>
            </Reveal>
          ) : (
            <ul className="reservas">
              {reservas.map((reserva, i) => (
                <Reveal as="li" key={reserva.codigo} retraso={i * 60} className="reserva">
                  <div className="reserva__cabecera">
                    <div>
                      <span className="codigo codigo--chico">{reserva.codigo}</span>
                      <p style={{ marginTop: "0.6rem" }}>Reservada el {formatearSello(reserva.fecha)}</p>
                    </div>
                    <p>
                      <Check size={14} strokeWidth={2} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
                      {reserva.contacto?.nombre}
                    </p>
                  </div>

                  <ul className="reserva__lista">
                    {reserva.items.map((item) => (
                      <li key={`${reserva.codigo}-${item.paqueteId}-${item.salida}`}>
                        {item.titulo}
                        <span>
                          {formatearSalida(item.salida)} · {item.adultos} ad.
                          {item.ninos > 0 ? ` · ${item.ninos} niños` : ""} · {item.habitacion}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="reserva__pie">
                    <p className="reserva__total">{formatearPrecio(reserva.total, moneda)}</p>
                    <button
                      type="button"
                      className="boton-linea boton-linea--chico"
                      onClick={() => cancelarReserva(reserva.codigo)}
                    >
                      <X size={14} strokeWidth={2} aria-hidden="true" /> Cancelar reserva
                    </button>
                  </div>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}