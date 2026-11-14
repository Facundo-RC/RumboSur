import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViaje } from "@/context/ViajeContext";

const ENLACES = [
  { to: "/", texto: "Inicio", numero: "01" },
  { to: "/paquetes", texto: "Paquetes", numero: "02" },
  { to: "/reservas", texto: "Mis reservas", numero: "03" },
];

export default function Cabecera() {
  const { items, moneda, setMoneda } = useViaje();
  const ruta = useRouterState({ select: (estado) => estado.location.pathname });
  const [fija, setFija] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const y = window.scrollY;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setFija(y > 24);
      setProgreso(alto > 0 ? Math.min(1, y / alto) : 0);
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  useEffect(() => {
    setAbierto(false);
  }, [ruta]);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const activo = (to) => (to === "/" ? ruta === "/" : ruta.startsWith(to));

  return (
    <header className={cn("cabecera", fija && "cabecera--fija")}>
      <div className="cabecera__progreso" style={{ transform: `scaleX(${progreso})` }} aria-hidden="true" />
      <div className="container cabecera__barra">
        <Link to="/" className="marca" aria-label="Rumbo Sur, inicio" suppressHydrationWarning>
          <span className="marca__sello" aria-hidden="true">
            <Compass size={18} strokeWidth={1.4} />
          </span>
          <span className="marca__texto">
            Rumbo<em>Sur</em>
          </span>
        </Link>

        <nav className="nav-principal" aria-label="Navegación principal">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.to}
              to={enlace.to}
              className={cn("nav-principal__enlace", activo(enlace.to) && "is-activo")}
              suppressHydrationWarning
            >
              {enlace.texto}
            </Link>
          ))}
        </nav>

        <div className="cabecera__acciones">
          <div className="moneda" role="group" aria-label="Moneda de los precios">
            {["USD", "UYU"].map((codigo) => (
              <button
                key={codigo}
                type="button"
                aria-pressed={moneda === codigo}
                onClick={() => setMoneda(codigo)}
              >
                {codigo === "USD" ? "US$" : "$U"}
              </button>
            ))}
          </div>

          <Link
            to="/carrito"
            className="carrito-icono"
            aria-label={`Carrito de cotización: ${items.length} ${items.length === 1 ? "viaje" : "viajes"}`}
            suppressHydrationWarning
          >
            <ShoppingBag size={17} strokeWidth={1.5} aria-hidden="true" />
            {items.length > 0 && <span className="carrito-icono__contador">{items.length}</span>}
          </Link>

          <button
            type="button"
            className={cn("menu-boton", abierto && "menu-boton--abierto")}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {abierto && (
        <div className="panel-movil" id="menu-movil">
          <nav className="panel-movil__enlaces" aria-label="Navegación principal">
            {ENLACES.map((enlace) => (
              <Link
                key={enlace.to}
                to={enlace.to}
                className={cn("panel-movil__enlace", activo(enlace.to) && "is-activo")}
                suppressHydrationWarning
              >
                {enlace.texto}
                <small>{enlace.numero}</small>
              </Link>
            ))}
          </nav>
          <div className="panel-movil__pie">
            <span>Montevideo · Uruguay</span>
            <span className="cifra">34°54′S 56°09′W</span>
          </div>
        </div>
      )}
    </header>
  );
}