const FRASES = [
  "Aéreos incluidos",
  "Hoteles con desayuno",
  "Traslados puerta a puerta",
  "Asistencia al viajero",
  "Guías locales",
  "Salidas desde Montevideo",
  "Cotización al instante",
  "Pago en pesos o dólares",
];

export default function Marquesina() {
  return (
    <div className="marquesina" aria-hidden="true">
      <div className="marquesina__pista">
        {[0, 1].map((copia) => (
          <div className="marquesina__grupo" key={copia}>
            {FRASES.map((frase) => (
              <span className="marquesina__item" key={`${copia}-${frase}`}>
                {frase}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}