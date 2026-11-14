import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { ETIQUETAS_TIPO, imagenDeTipo, paquetesPorTipo } from "@/lib/catalogo";

export default function EstilosViaje() {
  return (
    <div className="estilos">
      {Object.entries(ETIQUETAS_TIPO).map(([valor, texto], i) => {
        const cantidad = paquetesPorTipo(valor).length;
        return (
          <Link key={valor} to="/paquetes" search={{ tipo: valor }} className="estilo">
            <span className="estilo__fondo" aria-hidden="true">
              <Image src={imagenDeTipo(valor)} alt="" className="foto-llena" fittingType="fill" />
            </span>
            <span className="estilo__velo" aria-hidden="true" />
            <span className="estilo__n">0{i + 1}</span>
            <h3 className="estilo__nombre">{texto}</h3>
            <span className="estilo__cuenta">
              {cantidad} {cantidad === 1 ? "paquete" : "paquetes"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}