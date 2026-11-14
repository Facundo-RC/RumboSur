import { useEffect } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import Cabecera from "@/components/Cabecera";
import Pie from "@/components/Pie";
import Aviso from "@/components/Aviso";
import { ViajeProvider } from "@/context/ViajeContext";

export const Route = createFileRoute("/_site")({
  component: LayoutSitio,
});

function LayoutSitio() {
  const ruta = useRouterState({ select: (estado) => estado.location.pathname });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ruta]);

  return (
    <ViajeProvider>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Cabecera />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Pie />
      <Aviso />
    </ViajeProvider>
  );
}