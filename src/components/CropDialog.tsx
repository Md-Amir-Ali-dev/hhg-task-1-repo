import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "@/lib/render";

type Props = {
  image: HTMLImageElement;
  aspect: number;
  cropShape: "round" | "rect";
  initialCrop?: Area | null;
  onCancel: () => void;
  onConfirm: (area: Area) => void;
};

export function CropDialog({ image, aspect, cropShape, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: unknown, pixels: Area) => setArea(pixels), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jungle-deep/70 p-4">
      <div className="card-pop w-full max-w-lg overflow-hidden shadow-pop-lg">
        <div className="flex items-center justify-between border-b-2 border-jungle-deep/80 px-4 py-3">
          <h2 className="font-pixel text-[11px] uppercase">Frame your photo</h2>
          <button
            onClick={onCancel}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="relative h-[320px] bg-jungle-deep">
          <Cropper
            image={image.src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            restrictPosition
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-4 px-4 py-4">
          <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Zoom
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-sand-deep accent-jungle"
            />
          </label>
          <button
            onClick={() => area && onConfirm(area)}
            disabled={!area}
            className="w-full rounded-lg border-2 border-jungle-deep bg-mustard px-4 py-3 font-pixel text-[11px] uppercase text-jungle-deep shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            Use this crop
          </button>
        </div>
      </div>
    </div>
  );
}
