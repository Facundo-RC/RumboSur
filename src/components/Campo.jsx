import { cn } from "@/lib/utils";

export default function Campo({ nombre, etiqueta, tipo = "text", valor, error, onChange, ...resto }) {
  const idError = `error-${nombre}`;

  return (
    <label className={cn("campo", error && "campo--error")}>
      <span>{etiqueta}</span>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        value={valor}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...resto}
      />
      {error && (
        <p className="campo__error" id={idError}>
          {error}
        </p>
      )}
    </label>
  );
}