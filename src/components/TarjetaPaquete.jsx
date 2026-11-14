import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import ChipTipo from "@/components/ChipTipo";
import { formatearPrecio } from "@/lib/formato";
import { useViaje } from "@/context/ViajeContext";

export default function TarjetaPaquete({ paquete }) {
  const { moneda } = useViaje();

  return (
    <Link
      to="/paquetes/$paqueteId"
      params={{ paqueteId: paquete.id }}
      className="tarjeta-paquete"
      aria-label={`${paquete.titulo}, desde ${formatearPrecio(paquete.precio, moneda)}`}
    >
      <div className="tarjeta-paquete__foto">
        <Image src={paquete.imagen} alt={`${paquete.destino}, ${paquete.pais}`} className="foto-llena" fittingType="fill" />
        <span className="tarjeta-paquete__chip">
          <ChipTipo tipo={paquete.tipo} />
        </span>
        {paquete.destacado && <span className="tarjeta-paquete__destacado">Destacado</span>}
      </div>

      <div className="tarjeta-paquete__cuerpo">
        <p className="tarjeta-paquete__lugar">
          {paquete.pais} · {paquete.noches} noches
        </p>
        <h3 className="tarjeta-paquete__titulo">{paquete.destino}</h3>
        <p className="tarjeta-paquete__resumen">{paquete.resumen}</p>
        <div className="tarjeta-paquete__pie">
          <span className="tarjeta-paquete__precio">
            <small>Desde · por persona</small>
            <strong>{formatearPrecio(paquete.precio, moneda)}</strong>
            <em className="tarjeta-paquete__cuotas">
              o 6 pagos de {formatearPrecio(Math.round(paquete.precio / 6), moneda)}
            </em>
          </span>
          <span className="tarjeta-paquete__flecha" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}