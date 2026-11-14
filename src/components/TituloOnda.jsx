import { Fragment } from "react";

/**
 * Título con onda de luz: cada letra se tiñe de sol un instante, de izquierda a
 * derecha. Sólo cambia color, nunca tamaño ni posición. El texto real queda
 * disponible para lectores de pantalla.
 */
export default function TituloOnda({ texto }) {
  let indice = 0;

  return (
    <span>
      <span className="visualmente-oculto">{texto}</span>
      {[...texto].map((caracter) => {
        if (caracter === " ") return <Fragment key={`espacio-${indice++}`}> </Fragment>;
        const i = indice++;
        return (
          <span key={`${caracter}-${i}`} aria-hidden="true" className="portada__letra" style={{ "--i": i }}>
            {caracter}
          </span>
        );
      })}
    </span>
  );
}