import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { formatearFecha, formatearPrecio } from "@/lib/formato";

export default function ItemCarrito({ item, moneda, onQuitar }) {
  const { paquete, salida, cotizacion, adultos, ninos, habitacion } = item;

  return (
    <li className="item">
      <Link to="/paquetes/$paqueteId" params={{ paqueteId: paquete.id }} className="item__foto">
        <Image src={paquete.imagen} alt={paquete.destino} className="foto-llena" fittingType="fill" />
      </Link>

      <div>
        <h2 className="item__titulo">
          <Link to="/paquetes/$paqueteId" params={{ paqueteId: paquete.id }}>
            {paquete.titulo}
          </Link>
        </h2>
        <p className="item__detalle">
          Salida {formatearFecha(salida.fecha)}
          {salida.alta ? " · temporada alta" : ""}
        </p>
        <p className="item__detalle">
          {adultos} {adultos === 1 ? "adulto" : "adultos"}
          {ninos > 0 ? ` · ${ninos} ${ninos === 1 ? "niño" : "niños"}` : ""} · Habitación {habitacion}
        </p>
      </div>

      <div className="item__acciones">
        <span className="item__precio">{formatearPrecio(cotizacion.total, moneda)}</span>
        <button type="button" className="boton-texto boton-texto--peligro" onClick={() => onQuitar(item.id)}>
          Quitar
        </button>
      </div>
    </li>
  );
}