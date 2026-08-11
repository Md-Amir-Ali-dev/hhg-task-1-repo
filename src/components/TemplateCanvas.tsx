import { useEffect, useRef, useState } from "react";
import { loadImage, renderTemplate, ensureFonts, type RenderInput } from "@/lib/render";

export function TemplateCanvas({
  input,
  className,
}: {
  input: RenderInput;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [overlay, setOverlay] = useState<HTMLImageElement | null>(null);
  const src = input.template.src;

  useEffect(() => {
    let alive = true;
    setOverlay(null);
    Promise.all([loadImage(src), ensureFonts()]).then(([img]) => {
      if (alive) setOverlay(img);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !overlay) return;
    renderTemplate(canvas, { ...input, scale: 2 }, overlay);
  });

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ aspectRatio: `${input.template.width} / ${input.template.height}` }}
      aria-label={`${input.template.name} preview`}
    />
  );
}
