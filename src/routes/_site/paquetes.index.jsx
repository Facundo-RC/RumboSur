import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import FiltrosCatalogo from "@/components/FiltrosCatalogo";
import TarjetaPaquete from "@/components/TarjetaPaquete";
import Reveal from "@/components/Reveal";
import BotonSolar from "@/components/BotonSolar";
import { useViaje } from "@/context/ViajeContext";
import { ETIQUETAS_TIPO, MESES_DISPONIBLES, REGIONES, buscarPaquetes } from "@/lib/catalogo";
import { COTIZACION_UYU } from "@/lib/formato";
import paquetesBase from "@/data/paquetes";

export const Route = createFileRoute("/_site/paquetes/")({
  validateSearch: (search) => ({
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    tipo: typeof search.tipo === "string" && ETIQUETAS_TIPO[search.tipo] ? search.tipo : undefined,
    region: typeof search.region === "string" && REGIONES.includes(search.region) ? search.region : undefined,
    max: typeof search.max === "string" && search.max ? search.max : undefined,
    mes:
      typeof search.mes === "string" && /^\d{4}-\d{2}$/.test(search.mes) ? search.mes : undefined,
    orden: typeof search.orden === "string" && search.orden ? search.orden : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Paquetes — Rumbo Sur" },
      {
        name: "description",
        content:
          "Los doce destinos de Rumbo Sur: playa, nieve, ciudad, aventura y escapadas. Filtrá por estilo, región y precio.",
      },
    ],
  }),
  component: Paquetes,
});

function Paquetes() {
  const { paquetes } = useViaje();
  const search = Route.useSearch();
  const navegar = Route.useNavigate();

  const valores = {
    busqueda: search.q ?? "",
    tipo: search.tipo ?? "todos",
    region: search.region ?? "todas",
    precioMax: search.max ? Number(search.max) : null,
    mes: search.mes ?? "",
    orden: search.orden ?? "destacados",
  };

  const resultado = useMemo(
    () => buscarPaquetes(paquetes, valores),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paquetes, search.q, search.tipo, search.region, search.max, search.mes, search.orden],
  );

  function alCambiar(campo, valor) {
    navegar({
      search: (previo) => {
        const siguiente = { ...previo };
        const vacio = valor === "" || valor === "todos" || valor === "todas";
        if (campo === "q") siguiente.q = vacio ? undefined : valor;
        else siguiente[campo] = vacio ? undefined : valor;
        return siguiente;
      },
      replace: true,
    });
  }

  function alLimpiar() {
    navegar({ search: {}, replace: true });
  }

  return (
    <>
      <section className="cabecera-catalogo">
        <div className="cabecera-catalogo__fondo" aria-hidden="true">
          <Image src={paquetesBase[8].imagen} alt="" className="foto-llena" fittingType="fill" />
        </div>
        <span className="cabecera-catalogo__velo" aria-hidden="true" />
        <div className="container">
          <p className="antetitulo">Catálogo</p>
          <h1 className="titulo-pagina">Todos los viajes</h1>
          <p className="entradilla">
            Doce destinos con aéreos, alojamiento y traslados incluidos. Elegí uno, ajustá viajeros y fechas, y
            llevate la cotización al instante.
          </p>
          <p className="cabecera-catalogo__meta">
            <span>12 destinos</span>
            <span>36 salidas</span>
            <span>Cotización en pesos a $ {COTIZACION_UYU}</span>
          </p>
        </div>
      </section>

      <FiltrosCatalogo valores={valores} alCambiar={alCambiar} alLimpiar={alLimpiar} />

      <section className="container" style={{ paddingBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
        <div className="barra-resultados">
          <p>
            {resultado.length} {resultado.length === 1 ? "paquete" : "paquetes"}
            {search.q ? ` para “${search.q}”` : ""}
          </p>
          {valores.tipo !== "todos" && <p>{ETIQUETAS_TIPO[valores.tipo]}</p>}
          {search.mes && (
            <button type="button" className="ficha-filtro" onClick={() => alCambiar("mes", "")}>
              Salida: {MESES_DISPONIBLES.find((opcion) => opcion.valor === search.mes)?.texto}
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>

        {resultado.length === 0 ? (
          <Reveal className="vacio">
            <p className="vacio__titulo">No hay paquetes con esos filtros</p>
            <p className="suave" style={{ marginBottom: "1.5rem" }}>
              Probá con otro estilo, ampliá el precio máximo o limpiá la búsqueda.
            </p>
            <BotonSolar onClick={alLimpiar}>Limpiar filtros</BotonSolar>
          </Reveal>
        ) : (
          <div className="grilla-paquetes">
            {resultado.map((paquete, i) => (
              <Reveal key={paquete.id} retraso={(i % 3) * 80}>
                <TarjetaPaquete paquete={paquete} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="suave" style={{ marginTop: "2.5rem", fontSize: "0.85rem" }}>
          Precios en dólares por persona en habitación doble. Los pesos se calculan con una cotización de referencia de
          $ {COTIZACION_UYU}.{" "}
          <Link to="/reservas" className="enlace-linea">
            Ver mis reservas
          </Link>
        </p>
      </section>
    </>
  );
}