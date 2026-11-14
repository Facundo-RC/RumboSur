import { Link } from "@tanstack/react-router";
import BotonSolar from "@/components/BotonSolar";
import { ETIQUETAS_TIPO } from "@/lib/catalogo";

export default function Pie() {
  return (
    <footer className="pie">
      <div className="container">
        <div className="pie__cierre">
          <p className="antetitulo antetitulo--centrado">Rumbo Sur · Montevideo</p>
          <h2 className="pie__titulo">
            ¿Arrancamos <em>el viaje</em>?
          </h2>
          <p className="pie__texto">
            Contanos a dónde querés ir y armamos la cotización con aéreos, hoteles y excursiones incluidas.
          </p>
          <div className="pie__acciones">
            <BotonSolar to="/paquetes">Ver los 12 destinos</BotonSolar>
            <a className="boton-linea" href="mailto:hola@rumbosur.uy">
              Escribir a la agencia
            </a>
          </div>
        </div>

        <div className="pie__columnas">
          <div>
            <p className="pie__rotulo">La agencia</p>
            <p className="pie__texto-chico">
              Viajes de autor desde Montevideo: aéreos, alojamiento, traslados y asistencia al viajero en un solo
              precio por persona en habitación doble.
            </p>
          </div>

          <div>
            <p className="pie__rotulo">Destinos</p>
            <ul className="pie__lista">
              {Object.entries(ETIQUETAS_TIPO).map(([valor, texto]) => (
                <li key={valor}>
                  <Link to="/paquetes" search={{ tipo: valor }} suppressHydrationWarning>
                    {texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="pie__rotulo">Contacto</p>
            <ul className="pie__lista">
              <li>
                <a href="mailto:hola@rumbosur.uy">hola@rumbosur.uy</a>
              </li>
              <li>
                <Link to="/paquetes" suppressHydrationWarning>
                  Cotizador en línea
                </Link>
              </li>
              <li>
                <Link to="/reservas" suppressHydrationWarning>
                  Mis reservas
                </Link>
              </li>
              <li>Montevideo, Uruguay</li>
            </ul>
          </div>
        </div>

        <div className="pie__legal">
          <p>© {new Date().getFullYear()} Rumbo Sur · Agencia de viajes ficticia creada como proyecto de portfolio.</p>
          <p>
            Desarrollado por{" "}
            <a href="https://github.com/Facundo-RC" target="_blank" rel="noreferrer">
              Facundo Robaño
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}