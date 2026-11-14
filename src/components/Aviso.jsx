import { useViaje } from "@/context/ViajeContext";

export default function Aviso() {
  const { aviso } = useViaje();
  if (!aviso) return null;

  return (
    <div className="aviso" role="status" aria-live="polite">
      <p className="aviso__mensaje">{aviso}</p>
    </div>
  );
}