import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

const CLAVE = "rumbo-sur-gente";

const VIAJEROS = [
  {
    id: "barco",
    nombre: "Lucía y Nacho",
    viaje: "Punta Cana",
    cita: "Nos subimos al bote muertos de risa y no bajamos en todo el día. Aéreos, hotel y excursión, todo resuelto.",
    foto: "/imagenes/gente-barco.jpg",
    base: 148,
  },
  {
    id: "paine",
    nombre: "Carolina Vidal",
    viaje: "Torres del Paine",
    cita: "Salí sola y volví con siete amigos nuevos. La caminata al mirador fue el mejor regalo del año.",
    foto: "/imagenes/gente-paine.jpg",
    base: 96,
  },
  {
    id: "familia",
    nombre: "Los Ferreira",
    viaje: "Roma y Florencia",
    cita: "Los chicos todavía hablan del gelato de Trastevere. Ocho días, cero trámites, todos contentos.",
    foto: "/imagenes/gente-familia.jpg",
    base: 212,
  },
  {
    id: "amigos",
    nombre: "Sofi, Juan, Lu y Mati",
    viaje: "Salta y Jujuy",
    cita: "Cuatro amigos, una camioneta y el mejor atardecer del norte. Ya estamos pensando en la próxima.",
    foto: "/imagenes/gente-amigos.jpg",
    base: 174,
  },
];

export default function GenteViajera() {
  const [meGustas, setMeGustas] = useState({});
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    try {
      const guardado = JSON.parse(window.localStorage.getItem(CLAVE) || "{}");
      if (guardado && typeof guardado === "object") setMeGustas(guardado);
    } catch {
      /* sin corazones guardados */
    }
  }, []);

  function alternar(id) {
    setMeGustas((previos) => {
      const siguiente = { ...previos, [id]: !previos[id] };
      try {
        window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
      } catch {
        /* el navegador no permite guardar */
      }
      return siguiente;
    });
  }

  return (
    <section className="gente" id="gente" aria-labelledby="gente-titulo">
      <div className="container">
        <Reveal className="gente__cabecera">
          <div>
            <p className="gente__antetitulo">Gente Rumbo</p>
            <h2 className="gente__titulo" id="gente-titulo">
              Viajeros felices, historias de verdad
            </h2>
          </div>
          <p className="gente__bajada">
            Tocá una foto para leer su historia y dejales un corazón. Son viajeros reales que salieron con
            nosotros.
          </p>
        </Reveal>

        <div className="gente__grilla">
          {VIAJEROS.map((viajero, i) => {
            const gusta = Boolean(meGustas[viajero.id]);
            const activo = abierto === viajero.id;
            return (
              <Reveal key={viajero.id} className="gente__item" retraso={i * 70}>
                <article className={cn("gente__tarjeta", activo && "is-abierto")}>
                  <div className="gente__foto">
                    <Image
                      src={viajero.foto}
                      alt={`${viajero.nombre} disfrutando su viaje a ${viajero.viaje}`}
                      className="foto-llena"
                      fittingType="fill"
                    />

                    <button
                      type="button"
                      className={cn("gente__like", gusta && "is-activo")}
                      aria-pressed={gusta}
                      aria-label={`Me gusta la historia de ${viajero.nombre}`}
                      onClick={() => alternar(viajero.id)}
                    >
                      <Heart size={15} strokeWidth={1.8} aria-hidden="true" />
                      <span className="cifra">{viajero.base + (gusta ? 1 : 0)}</span>
                    </button>

                    <button
                      type="button"
                      className="gente__abrir"
                      aria-expanded={activo}
                      onClick={() => setAbierto(activo ? null : viajero.id)}
                    >
                      <span>{activo ? "Cerrar historia" : "Leer su historia"}</span>
                    </button>
                  </div>

                  <div className="gente__cuerpo">
                    <p className="gente__viaje">{viajero.viaje}</p>
                    <h3 className="gente__nombre">{viajero.nombre}</h3>
                    {activo && <p className="gente__cita">“{viajero.cita}”</p>}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="gente__pie">
          ¿Viajaste con nosotros? Sumá tu historia en la próxima salida.{" "}
          <Link to="/paquetes">Mirá los viajes que salen</Link>
        </p>
      </div>
    </section>
  );
}