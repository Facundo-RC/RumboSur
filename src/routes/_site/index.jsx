import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Portada from "@/components/Portada";
import Marquesina from "@/components/Marquesina";
import FranjaDestinos from "@/components/FranjaDestinos";
import EstilosViaje from "@/components/EstilosViaje";
import GenteViajera from "@/components/GenteViajera";
import Beneficios from "@/components/Beneficios";
import TarjetaPaquete from "@/components/TarjetaPaquete";
import Reveal from "@/components/Reveal";
import BotonSolar from "@/components/BotonSolar";
import { useViaje } from "@/context/ViajeContext";
import { ordenarPaquetes } from "@/lib/catalogo";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Rumbo Sur — Viajes de autor desde Montevideo" },
      {
        name: "description",
        content:
          "Paquetes de viaje con aéreos, hoteles y excursiones incluidas. Cotizá al instante y reservá en tres pasos. Salidas desde Montevideo.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { paquetes } = useViaje();

  const manifiesto = useMemo(
    () => ordenarPaquetes(paquetes.filter((p) => p.destacado), "precio-desc"),
    [paquetes],
  );

  const otros = useMemo(() => {
    const mostrados = new Set(manifiesto.map((p) => p.id));
    return ordenarPaquetes(paquetes.filter((p) => !mostrados.has(p.id)), "precio-asc").slice(0, 3);
  }, [manifiesto, paquetes]);

  return (
    <>
      <Portada />
      <Marquesina />

      <section className="seccion" id="destinos">
        <div className="container">
          <Reveal className="cabecera-seccion">
            <div>
              <p className="antetitulo">El manifiesto</p>
              <h2 className="cabecera-seccion__titulo">Los viajes que más se piden</h2>
            </div>
            <div className="cabecera-seccion__texto">
              <p>
                Cada salida incluye aéreos, alojamiento y traslados. Elegí una y armá tu cotización en el momento.
              </p>
              <Link to="/paquetes" className="enlace-flecha">
                Ver el catálogo completo
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <FranjaDestinos paquetes={manifiesto} />
        </div>
      </section>

      <section className="seccion" id="estilos" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cabecera-seccion">
            <div>
              <p className="antetitulo">Estilos</p>
              <h2 className="cabecera-seccion__titulo">Elegí cómo querés viajar</h2>
            </div>
            <p className="cabecera-seccion__texto">
              Cinco maneras de entender un viaje. El catálogo se filtra solo con tocar uno.
            </p>
          </Reveal>

          <EstilosViaje />
        </div>
      </section>

      <GenteViajera />

      <section className="seccion" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cabecera-seccion">
            <div>
              <p className="antetitulo">Otras travesías</p>
              <h2 className="cabecera-seccion__titulo">Para seguir soñando</h2>
            </div>
            <BotonSolar to="/paquetes" chico>
              Ver todos
            </BotonSolar>
          </Reveal>

          <div className="grilla-paquetes">
            {otros.map((paquete, i) => (
              <Reveal key={paquete.id} retraso={i * 80}>
                <TarjetaPaquete paquete={paquete} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="beneficios seccion seccion--ajustada">
        <div className="container">
          <Reveal>
            <p className="antetitulo">Por qué Rumbo Sur</p>
          </Reveal>
          <Beneficios />
        </div>
      </section>
    </>
  );
}