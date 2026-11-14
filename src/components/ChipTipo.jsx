import { ETIQUETAS_TIPO } from "@/lib/catalogo";

export default function ChipTipo({ tipo, className }) {
  return <span className={["chip-tipo", className].filter(Boolean).join(" ")}>{ETIQUETAS_TIPO[tipo] ?? tipo}</span>;
}