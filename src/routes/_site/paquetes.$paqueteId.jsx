import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";
import Cotizador from "@/components/Cotizador";
import TarjetaPaquete from "@/components/TarjetaPaquete";
import { buscarPaquete, ordenarPaquetes, ETIQUETAS_TIPO } from "@/lib/catalogo";
import { formatearFecha } from "@/lib/formato";
import { useViaje } from "@/context/ViajeContext";

export const Route = createFileRoute("/_site/paquetes/$paqueteId")({
  head: ({ params }) => {
    const paquete = buscarPaquete(params.paqueteId);
    return {
      meta: [
        { title: paquete ? `${paquete.titulo} — Rumbo Sur` : "Paquete — Rumbo Sur" },
        { name: "description", content: paquete?.resumen ?? "Paquetes de viaje de Rumbo Sur." },
      ],
    };
  },
  component: Detalle,
});

function Detalle() {
  const { paqueteId } = Route.useParams();
  const { paquetes } = useViaje();
  const paquete = paquetes.find((p) => p.id === paqueteId);

  if (!paquete) {
    return (
      <section className="seccion container" style={{ paddingTop: "calc(78px + 4rem)" }}>
        <div className="vacio">
          <p className="vacio__titulo">No encontramos ese paquete</p>
          <p className="suave">Puede que el enlace haya cambiado.</p>
          <Link to="/paquetes" className="enlace-flecha" style={{ marginTop: "1.25rem" }}>
            Ver todos los paquetes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  const relacionados = ordenarPaquetes(
    paquetes.filter((p) => p.id !== paquete.id && p.tipo === paquete.tipo),
    "precio-asc",
  ).slice(0, 3);

  return (
    <>
      <section className="detalle-portada">
        <div className="detalle-portada__foto">
          <Image
            src={paquete.imagen}
            alt={`${paquete.destino}, ${paquete.pais}`}
            className="foto-llena"
            fittingType="fill"
          />
        </div>
        <span className="detalle-portada__velo" aria-hidden="true" />

        <div className="container detalle-portada__texto">
          <Link to="/paquetes" className="volver">
            <span aria-hidden="true">←</span> Volver al catálogo
          </Link>
          <p className="antetitulo" style={{ marginTop: "1.25rem" }}>
            {paquete.pais} · {paquete.region}
          </p>
          <h1 className="detalle-portada__titulo">{paquete.titulo}</h1>
          <p className="detalle-portada__pies">
            <span>{paquete.destino}</span>
            <span>{paquete.noches} noches</span>
            <span>{ETIQUETAS_TIPO[paquete.tipo]}</span>
          </p>
        </div>
      </section>

      <div className="container detalle">
        <div className="detalle__grilla">
          <div className="detalle__info">
            <Reveal>
              <p className="detalle__resumen">{paquete.resumen}</p>
            </Reveal>

            <Reveal className="detalle__datos">
              <div className="dato">
                <span>Duración</span>
                <strong>{paquete.noches} noches</strong>
              </div>
              <div className="dato">
                <span>Salidas</span>
                <strong>{paquete.salidas.length} fechas</strong>
              </div>
              <div className="dato">
                <span>Estilo</span>
                <strong>{ETIQUETAS_TIPO[paquete.tipo]}</strong>
              </div>
              <div className="dato">
                <span>País</span>
                <strong>{paquete.pais}</strong>
              </div>
            </Reveal>

            <h2>Qué incluye</h2>
            <ul className="lista-check">
              {paquete.incluye.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Itinerario</h2>
            <ol className="itinerario">
              {paquete.itinerario.map((etapa, i) => (
                <li key={etapa}>
                  <span className="itinerario__dia">
                    {etiquetaDia(etapa, i, paquete)}
                  </span>
                  <p>{etapa}</p>
                </li>
              ))}
            </ol>

            <h2>Próximas salidas</h2>
            <ul className="lista-check">
              {paquete.salidas.map((salida) => (
                <li key={salida.fecha}>
                  {formatearFecha(salida.fecha)} {salida.alta && "· temporada alta"}
                </li>
              ))}
            </ul>
          </div>

          <Cotizador paquete={paquete} />
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="relacionados">
          <div className="container">
            <Reveal className="cabecera-seccion">
              <h2 className="cabecera-seccion__titulo">Otros viajes de {ETIQUETAS_TIPO[paquete.tipo].toLowerCase()}</h2>
              <Link to="/paquetes" search={{ tipo: paquete.tipo }} className="enlace-flecha">
                Ver todos <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
            <div className="grilla-paquetes">
              {relacionados.map((otro, i) => (
                <Reveal key={otro.id} retraso={i * 80}>
                  <TarjetaPaquete paquete={otro} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function etiquetaDia(etapa, indice, paquete) {
  const esUltima = indice === paquete.itinerario.length - 1;
  return esUltima ? "Regreso" : `Etapa ${String(indice + 1).padStart(2, "0")}`;
}