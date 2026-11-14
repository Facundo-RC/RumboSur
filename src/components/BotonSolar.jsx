import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import Flecha from "@/components/Flecha";

/**
 * Acción principal del sitio: bloque solar con divisor y flecha.
 * Renderiza un enlace interno cuando recibe `to`, si no un botón.
 */
export default function BotonSolar({
  children,
  to,
  search,
  onClick,
  type = "button",
  ancho = false,
  chico = false,
  className,
  ...resto
}) {
  const clases = cn("boton-solar", ancho && "boton-solar--ancho", chico && "boton-solar--chico", className);
  const contenido = (
    <>
      <span className="boton-solar__texto">{children}</span>
      <span className="boton-solar__divisor" aria-hidden="true" />
      <span className="boton-solar__flecha">
        <Flecha />
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} search={search} className={clases} suppressHydrationWarning {...resto}>
        {contenido}
      </Link>
    );
  }

  return (
    <button type={type} className={clases} onClick={onClick} {...resto}>
      {contenido}
    </button>
  );
}