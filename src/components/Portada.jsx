import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import BotonSolar from "@/components/BotonSolar";
import TituloOnda from "@/components/TituloOnda";
import { ETIQUETAS_TIPO, MESES_DISPONIBLES } from "@/lib/catalogo";
import paquetes from "@/data/paquetes";

const FOTOS = ["torres-del-paine", "punta-cana", "roma-florencia"]
  .map((id) => paquetes.find((p) => p.id === id))
  .filter(Boolean);

export default function Portada() {
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [mes, setMes] = useState("");
  const marcos = useRef([]);

  // Parallax suave de la franja de fotos: cada ventana se mueve a distinta velocidad.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let cuadro = 0;
    const mover = () => {
      cuadro = 0;
      const y = window.scrollY;
      marcos.current.forEach((nodo, i) => {
        if (nodo) nodo.style.transform = `translate3d(0, ${y * (0.05 + i * 0.035)}px, 0)`;
      });
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(mover);
    };
    mover();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  function buscar(evento) {
    evento.preventDefault();
    const search = {};
    if (busqueda.trim()) search.q = busqueda.trim();
    if (tipo !== "todos") search.tipo = tipo;
    if (mes) search.mes = mes;
    navegar({ to: "/paquetes", search });
  }

  return (
    <section className="portada" aria-label="Portada">
      <div className="portada__aurora" aria-hidden="true" />

      <div className="container portada__interior">
        <p className="portada__antetitulo">
          Montevideo <span aria-hidden="true" /> Agencia de viajes <span aria-hidden="true" /> desde 2011
        </p>

        <h1 className="portada__titulo">
          <TituloOnda texto="Tu próximo viaje" />
          <em>empieza acá</em>
        </h1>

        <p className="portada__bajada">
          Paquetes armados con aéreos, hoteles y excursiones. Cotizá en el momento y reservá en tres pasos.
        </p>

        <form className="buscador-portada" onSubmit={buscar} role="search" aria-label="Buscar viajes">
          <label>
            <span>¿A dónde querés ir?</span>
            <input
              type="search"
              placeholder="Destino, país o región"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>
          <label>
            <span>Tipo de viaje</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todos los estilos</option>
              {Object.entries(ETIQUETAS_TIPO).map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Mes de salida</span>
            <select value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="">Cualquier fecha</option>
              {MESES_DISPONIBLES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.texto}
                </option>
              ))}
            </select>
          </label>
          <BotonSolar type="submit">Buscar viajes</BotonSolar>
        </form>

        <p className="portada__meta">
          <span>12 destinos</span>
          <span>Salidas 2027</span>
          <span>Cotización al instante</span>
        </p>
      </div>

      <div className="portada__galeria" aria-hidden="true">
        {FOTOS.map((paquete, i) => (
          <div className="portada__foto" key={paquete.id}>
            <span className="portada__marco" ref={(nodo) => (marcos.current[i] = nodo)}>
              <Image src={paquete.imagen} alt="" className="foto-llena" fittingType="fill" />
            </span>
          </div>
        ))}
      </div>

      <span className="portada__coords">34°54′S 56°09′W — Río de la Plata</span>
    </section>
  );
}