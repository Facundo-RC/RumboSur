import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";
import { formatearPrecio } from "@/lib/formato";
import { ETIQUETAS_TIPO } from "@/lib/catalogo";
import { useViaje } from "@/context/ViajeContext";

/** Destinos como franjas cinematográficas: al pasar el mouse se revela la foto y el precio. */
export default function FranjaDestinos({ paquetes }) {
  const { moneda } = useViaje();

  return (
    <div className="manifiesto">
      {paquetes.map((paquete, i) => (
        <Reveal key={paquete.id} retraso={i * 70}>
          <Link
            to="/paquetes/$paqueteId"
            params={{ paqueteId: paquete.id }}
            className="franja"
            aria-label={`${paquete.destino}, ${paquete.noches} noches desde ${formatearPrecio(paquete.precio, moneda)}`}
          >
            <span className="franja__fondo" aria-hidden="true">
              <Image src={paquete.imagen} alt="" className="foto-llena" fittingType="fill" />
            </span>
            <span className="franja__velo" aria-hidden="true" />
            <div className="franja__interior">
              <span className="franja__indice">{String(i + 1).padStart(2, "0")}</span>
              <div className="franja__cuerpo">
                <h3 className="franja__nombre">{paquete.destino}</h3>
                <p className="franja__meta">
                  <span>{paquete.pais}</span>
                  <span>{paquete.noches} noches</span>
                  <span>{ETIQUETAS_TIPO[paquete.tipo]}</span>
                </p>
              </div>
              <span className="franja__precio">
                desde
                <strong>{formatearPrecio(paquete.precio, moneda)}</strong>
              </span>
              <span className="franja__flecha" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}