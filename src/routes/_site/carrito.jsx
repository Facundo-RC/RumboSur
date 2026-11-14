import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import ItemCarrito from "@/components/ItemCarrito";
import Campo from "@/components/Campo";
import BotonSolar from "@/components/BotonSolar";
import Reveal from "@/components/Reveal";
import { useViaje } from "@/context/ViajeContext";
import { validarContacto } from "@/lib/reservas";
import { formatearPrecio } from "@/lib/formato";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/carrito")({
  head: () => ({ meta: [{ title: "Tu cotización — Rumbo Sur" }] }),
  component: Carrito,
});

const VACIO = { nombre: "", email: "", telefono: "", comentarios: "", acepta: false };

async function festejar() {
  try {
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 80,
      spread: 72,
      startVelocity: 32,
      origin: { y: 0.32 },
      colors: ["#d4af37", "#f0d78f", "#f2f5f7"],
      scalar: 0.9,
    });
  } catch {
    /* sin confeti: el resto de la confirmación funciona igual */
  }
}

function Carrito() {
  const { items, total, moneda, quitar, vaciar, confirmar } = useViaje();
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState(false);
  const [confirmada, setConfirmada] = useState(null);

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    const nuevo = { ...form, [name]: type === "checkbox" ? checked : value };
    setForm(nuevo);
    if (tocado) setErrores(validarContacto(nuevo));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarContacto(form);
    setErrores(encontrados);
    setTocado(true);
    if (Object.keys(encontrados).length) return;

    const reserva = confirmar({ ...form, nombre: form.nombre.trim(), email: form.email.trim() });
    setConfirmada(reserva);
    setForm(VACIO);
    setTocado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    festejar();
  }

  if (confirmada) {
    return (
      <section className="carrito-pagina">
        <div className="container">
          <div className="confirmacion">
            <div className="confirmacion__icono" aria-hidden="true">
              <Check size={30} strokeWidth={1.6} />
            </div>
            <p className="antetitulo antetitulo--centrado">Reserva confirmada</p>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>¡Buen viaje, {confirmada.contacto.nombre.split(" ")[0]}!</h1>
            <p>
              Guardamos tu reserva con el código{" "}
              <span className="codigo codigo--chico">{confirmada.codigo}</span>. Te escribimos a{" "}
              <strong>{confirmada.contacto.email}</strong> para coordinar el pago y los detalles.
            </p>
            <p className="suave">
              Total cotizado: {formatearPrecio(confirmada.total, moneda)} · {confirmada.items.length}{" "}
              {confirmada.items.length === 1 ? "viaje" : "viajes"}
            </p>
            <div className="confirmacion__acciones">
              <BotonSolar to="/reservas">Ver mis reservas</BotonSolar>
              <Link to="/paquetes" className="boton-linea">
                Seguir explorando
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="carrito-pagina">
        <div className="container">
          <Reveal className="vacio" style={{ marginTop: "2rem" }}>
            <p className="antetitulo antetitulo--centrado">Tu cotización</p>
            <p className="vacio__titulo">Todavía no elegiste ningún viaje</p>
            <p className="suave" style={{ marginBottom: "1.75rem" }}>
              Sumá un paquete desde el catálogo y volvé para completar tus datos.
            </p>
            <BotonSolar to="/paquetes">Ver los 12 destinos</BotonSolar>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="carrito-pagina">
      <div className="container">
        <p className="antetitulo">Paso 2 de 3</p>
        <h1 className="titulo-pagina">Tu cotización</h1>
        <p className="entradilla">
          Revisá los viajes elegidos y completá tus datos. No se cobra nada en línea: te contactamos para confirmar.
        </p>

        <div className="carrito-pagina__grilla">
          <div>
            <ul className="items">
              {items.map((item, i) => (
                <Reveal as="div" key={item.id} retraso={i * 60}>
                  <ItemCarrito item={item} moneda={moneda} onQuitar={quitar} />
                </Reveal>
              ))}
            </ul>

            <div className="items__pie">
              <button type="button" className="boton-texto" onClick={vaciar}>
                Vaciar carrito
              </button>
              <p className="items__total">
                <span>Total</span>
                <strong>{formatearPrecio(total, moneda)}</strong>
              </p>
            </div>
          </div>

          <Reveal as="form" variante="derecha" className="formulario-reserva" onSubmit={enviar} noValidate>
            <h2 className="formulario-reserva__titulo">Tus datos</h2>

            <Campo
              nombre="nombre"
              etiqueta="Nombre completo"
              valor={form.nombre}
              error={errores.nombre}
              onChange={cambiar}
              autoComplete="name"
              placeholder="Ana Rodríguez"
            />

            <div className="formulario-reserva__fila">
              <Campo
                nombre="email"
                etiqueta="Email"
                tipo="email"
                valor={form.email}
                error={errores.email}
                onChange={cambiar}
                autoComplete="email"
                placeholder="ana@correo.com"
              />
              <Campo
                nombre="telefono"
                etiqueta="Teléfono"
                tipo="tel"
                valor={form.telefono}
                error={errores.telefono}
                onChange={cambiar}
                autoComplete="tel"
                placeholder="099 123 456"
              />
            </div>

            <label className="campo">
              <span>Comentarios (opcional)</span>
              <textarea
                name="comentarios"
                value={form.comentarios}
                onChange={cambiar}
                placeholder="¿Viajás con niños? ¿Necesitás algo especial?"
              />
            </label>

            <label className={cn("campo-check", errores.acepta && "campo-check--error")}>
              <input
                type="checkbox"
                name="acepta"
                checked={form.acepta}
                onChange={cambiar}
                aria-invalid={Boolean(errores.acepta)}
                aria-describedby={errores.acepta ? "error-acepta" : undefined}
              />
              <span>
                Acepto las condiciones de la reserva y el tratamiento de mis datos para gestionar la cotización.
              </span>
            </label>
            {errores.acepta && (
              <p className="campo__error" id="error-acepta">
                {errores.acepta}
              </p>
            )}

            <BotonSolar type="submit" ancho>
              Confirmar reserva
            </BotonSolar>
            <p className="formulario-reserva__nota">
              Demo de portfolio: la reserva se guarda en este navegador y no se envía ningún pago.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}