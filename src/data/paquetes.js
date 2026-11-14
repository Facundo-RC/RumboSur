// Catálogo de Rumbo Sur. Las fotografías son imágenes generadas para el sitio y
// se adjuntan por id para que el resto de la app sólo tenga que leer `paquete.imagen`.
import crudo from "./paquetes.json";

export const IMAGENES = {
  florianopolis: "/imagenes/florianopolis.jpg",
  bariloche: "/imagenes/bariloche.jpg",
  "machu-picchu": "/imagenes/machu-picchu.jpg",
  cartagena: "/imagenes/cartagena.jpg",
  "madrid-barcelona": "/imagenes/madrid-barcelona.jpg",
  "punta-cana": "/imagenes/punta-cana.jpg",
  "salta-jujuy": "/imagenes/salta-jujuy.jpg",
  "nueva-york": "/imagenes/nueva-york.jpg",
  "torres-del-paine": "/imagenes/torres-del-paine.jpg",
  "roma-florencia": "/imagenes/roma-florencia.jpg",
  "valle-nevado": "/imagenes/valle-nevado.jpg",
  "colonia-carmelo": "/imagenes/colonia-carmelo.jpg",
};

const paquetes = crudo.map((paquete) => ({
  ...paquete,
  imagen: IMAGENES[paquete.id],
}));

export default paquetes;