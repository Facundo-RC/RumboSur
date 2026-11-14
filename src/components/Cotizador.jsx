import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import BotonSolar from "@/components/BotonSolar";
import { cotizar } from "@/lib/cotizador";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import { useViaje } from "@/context/ViajeContext";
import { cn } from "@/lib/utils";

function Contador({ etiqueta, valor, min, max, deshabilitado, onCambio }) {
  return (
    <div className="contador-campo">
      <span>{etiqueta}</span>
      <div className="contador-campo__controles">
        <button
          type="button"
          onClick={() => onCambio(valor - 1)}
          disabled={deshabilitado || valor <= min}
          aria-label={`Quitar ${etiqueta.toLowerCase()}`}
        >
          −
        </button>
        <output aria-live="polite">{valor}</output>
        <button
          type="button"
          onClick={() => onCambio(valor + 1)}
          disabled={deshabilitado || valor >= max}
          aria-label={`Agregar ${etiqueta.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function Cotizador({ paquete }) {
  const { agregar, moneda } = useViaje();
  const navegar = useNavigate();

  const [salida, setSalida] = useState(paquete.salidas[0].fecha);
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [habitacion, setHabitacion] = useState("doble");

  const datosSalida = paquete.salidas.find((s) => s.fecha === salida);
  const cotizacion = cotizar(paquete.precio, {
    adultos,
    ninos,
    habitacion,
    temporadaAlta: datosSalida?.alta,
  });

  const esSingle = habitacion === "single";

  function elegirHabitacion(valor) {
    setHabitacion(valor);
    if (valor === "single") {
      setAdultos(1);
      setNinos(0);
    }
  }

  function reservar(irAlCarrito) {
    if (!cotizacion.valido) return;
    agregar({ paqueteId: paquete.id, salida, adultos, ninos, habitacion });
    if (irAlCarrito) navegar({ to: "/carrito" });
  }

  return (
    <aside className="cotizador" aria-label="Cotizador del viaje">
      <div>
        <p className="cotizador__precio">
          <strong>{formatearPrecio(paquete.precio, moneda)}</strong>
          <span>por persona</span>
        </p>
        <p className="cotizador__nota" style={{ textAlign: "left", marginTop: "0.35rem" }}>
          En habitación doble. {paquete.noches} noches.
        </p>
      </div>

      <fieldset>
        <legend>Fecha de salida</legend>
        {paquete.salidas.map((opcion) => (
          <label key={opcion.fecha} className={cn("opcion", salida === opcion.fecha && "opcion--activa")}>
            <input
              type="radio"
              name="salida"
              value={opcion.fecha}
              checked={salida === opcion.fecha}
              onChange={() => setSalida(opcion.fecha)}
            />
            <span className="opcion__fecha">{formatearFecha(opcion.fecha)}</span>
            {opcion.alta && <span className="etiqueta-alta">Temporada alta</span>}
          </label>
        ))}
      </fieldset>

      <div className="cotizador__fila">
        <Contador
          etiqueta="Adultos"
          valor={adultos}
          min={1}
          max={9}
          deshabilitado={esSingle}
          onCambio={(n) => setAdultos(Math.min(9, Math.max(1, n)))}
        />
        <Contador
          etiqueta="Niños"
          valor={ninos}
          min={0}
          max={9 - adultos}
          deshabilitado={esSingle}
          onCambio={(n) => setNinos(Math.min(9 - adultos, Math.max(0, n)))}
        />
      </div>

      <fieldset>
        <legend>Habitación</legend>
        <div className="segmentado">
          <label className={cn(habitacion === "doble" && "activo")}>
            <input
              type="radio"
              name="habitacion"
              value="doble"
              checked={habitacion === "doble"}
              onChange={() => elegirHabitacion("doble")}
            />
            Doble
          </label>
          <label className={cn(habitacion === "single" && "activo")}>
            <input
              type="radio"
              name="habitacion"
              value="single"
              checked={habitacion === "single"}
              onChange={() => elegirHabitacion("single")}
            />
            Single
          </label>
        </div>
      </fieldset>

      {!cotizacion.valido ? (
        <ul className="errores" role="alert">
          {cotizacion.errores.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : (
        <dl className="desglose">
          <div>
            <dt>
              Adultos · {adultos} × {formatearPrecio(cotizacion.precioPorAdulto, moneda)}
            </dt>
            <dd>{formatearPrecio(cotizacion.subtotalAdultos, moneda)}</dd>
          </div>
          {ninos > 0 && (
            <div>
              <dt>Niños · {ninos} (70 %)</dt>
              <dd>{formatearPrecio(cotizacion.subtotalNinos, moneda)}</dd>
            </div>
          )}
          {cotizacion.recargoSingle > 0 && (
            <div>
              <dt>Recargo single (35 %)</dt>
              <dd>{formatearPrecio(cotizacion.recargoSingle, moneda)}</dd>
            </div>
          )}
          {cotizacion.descuento > 0 && (
            <div className="desglose__descuento">
              <dt>Descuento por grupo (5 %)</dt>
              <dd>− {formatearPrecio(cotizacion.descuento, moneda)}</dd>
            </div>
          )}
          <div className="desglose__total">
            <dt>Total</dt>
            <dd>{formatearPrecio(cotizacion.total, moneda)}</dd>
          </div>
        </dl>
      )}

      <BotonSolar ancho onClick={() => reservar(true)} disabled={!cotizacion.valido}>
        Reservar ahora
      </BotonSolar>
      <button type="button" className="boton-linea" onClick={() => reservar(false)} disabled={!cotizacion.valido}>
        Agregar al carrito
      </button>
      <p className="cotizador__nota">Sin pago en línea: te contactamos para confirmar la reserva.</p>
    </aside>
  );
}