import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Envoltorio de aparición al hacer scroll. El estado final ya está en el HTML:
 * si el navegador no ejecuta JS o el usuario prefiere menos movimiento, el
 * contenido se ve igual.
 */
export default function Reveal({
  children,
  as: Etiqueta = "div",
  variante = "subir",
  retraso = 0,
  className,
  style,
  ...resto
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={cn(
        "reveal",
        variante === "mascara" && "reveal--mascara",
        variante === "izquierda" && "reveal--izquierda",
        variante === "derecha" && "reveal--derecha",
        variante === "escala" && "reveal--escala",
        visible && "is-visible",
        className,
      )}
      style={{ "--retraso": `${retraso}ms`, ...style }}
      {...resto}
    >
      {children}
    </Etiqueta>
  );
}