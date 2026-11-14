import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Imagen que llena su contenedor. `fittingType="fill"` recorta (cover);
 * `fittingType="fit"` la muestra entera (contain).
 */
const Image = React.forwardRef(({ src, fittingType = "fill", className, style, alt = "", ...props }, ref) => (
  <span className={cn("inline-block relative overflow-hidden", className)} style={style}>
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("absolute inset-0 w-full h-full", fittingType === "fit" ? "object-contain" : "object-cover")}
      {...props}
    />
  </span>
));
Image.displayName = "Image";

export { Image };
