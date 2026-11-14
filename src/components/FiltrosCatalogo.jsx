import { ORDENES, REGIONES } from "@/lib/catalogo";

const TOPES = [
  { valor: "", texto: "Sin tope" },
  { valor: "1000", texto: "Hasta US$ 1.000" },
  { valor: "1500", texto: "Hasta US$ 1.500" },
  { valor: "2000", texto: "Hasta US$ 2.000" },
  { valor: "3000", texto: "Hasta US$ 3.000" },
];

export default function FiltrosCatalogo({ valores, alCambiar, alLimpiar }) {
  return (
    <div className="filtros">
      <div className="container">
        <form
          className="filtros__grilla"
          role="search"
          aria-label="Filtros del catálogo"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="campo filtros__busqueda">
            <span>Buscar</span>
            <input
              type="search"
              placeholder="Ej: brasil, nieve, europa…"
              value={valores.busqueda}
              onChange={(e) => alCambiar("q", e.target.value)}
            />
          </label>

          <label className="campo">
            <span>Estilo</span>
            <select value={valores.tipo} onChange={(e) => alCambiar("tipo", e.target.value)}>
              <option value="todos">Todos</option>
              <option value="playa">Playa</option>
              <option value="nieve">Nieve</option>
              <option value="ciudad">Ciudad</option>
              <option value="aventura">Aventura</option>
              <option value="escapada">Escapada</option>
            </select>
          </label>

          <label className="campo">
            <span>Región</span>
            <select value={valores.region} onChange={(e) => alCambiar("region", e.target.value)}>
              <option value="todas">Todas</option>
              {REGIONES.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            <span>Precio</span>
            <select value={valores.precioMax ?? ""} onChange={(e) => alCambiar("max", e.target.value)}>
              {TOPES.map((tope) => (
                <option key={tope.valor} value={tope.valor}>
                  {tope.texto}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            <span>Ordenar</span>
            <select value={valores.orden} onChange={(e) => alCambiar("orden", e.target.value)}>
              {ORDENES.map((orden) => (
                <option key={orden.valor} value={orden.valor}>
                  {orden.texto}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="boton-texto filtros__limpiar" onClick={alLimpiar}>
            Limpiar filtros
          </button>
        </form>
      </div>
    </div>
  );
}