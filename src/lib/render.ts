import type { FieldKey, Hole, Template } from "./templates";

export type Area = { x: number; y: number; width: number; height: number };

export type RenderInput = {
  template: Template;
  photo: HTMLImageElement | null;
  crop: Area | null;
  values: Partial<Record<FieldKey, string>>;
  scale?: number;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

export async function ensureFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load('12px "Press Start 2P"'),
      document.fonts.load('700 14px "Space Grotesk"'),
    ]);
  } catch {
    /* fonts are best-effort */
  }
}

function pathHole(ctx: CanvasRenderingContext2D, hole: Hole) {
  ctx.beginPath();
  if (hole.shape === "circle") {
    ctx.arc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2);
  } else {
    const r = hole.radius;
    const { x, y, w, h } = hole;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function holeBox(hole: Hole) {
  return hole.shape === "circle"
    ? { x: hole.cx - hole.r, y: hole.cy - hole.r, w: hole.r * 2, h: hole.r * 2 }
    : { x: hole.x, y: hole.y, w: hole.w, h: hole.h };
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: Template["font"],
  size: number,
  maxWidth: number,
) {
  let s = size;
  while (s > 5) {
    ctx.font = fontString(family, s);
    if (ctx.measureText(text).width <= maxWidth) break;
    s -= 0.5;
  }
  return s;
}

function fontString(family: Template["font"], size: number) {
  return family === "pixel"
    ? `${size}px "Press Start 2P", monospace`
    : `700 ${size}px "Space Grotesk", system-ui, sans-serif`;
}

export function renderTemplate(canvas: HTMLCanvasElement, input: RenderInput, overlay?: HTMLImageElement) {
  const { template, photo, crop, values } = input;
  const scale = input.scale ?? 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = Math.round(template.width * scale);
  canvas.height = Math.round(template.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, template.width, template.height);
  ctx.imageSmoothingQuality = "high";

  const box = holeBox(template.hole);

  if (photo && crop) {
    // Cover-fit the user's square crop into the hole's aspect ratio.
    const targetRatio = box.w / box.h;
    let sw = crop.width;
    let sh = crop.height;
    if (sw / sh > targetRatio) sw = sh * targetRatio;
    else sh = sw / targetRatio;
    const sx = crop.x + (crop.width - sw) / 2;
    const sy = crop.y + (crop.height - sh) / 2;
    ctx.save();
    pathHole(ctx, template.hole);
    ctx.clip();
    ctx.drawImage(photo, sx, sy, sw, sh, box.x, box.y, box.w, box.h);
    ctx.restore();
  } else {

    ctx.save();
    pathHole(ctx, template.hole);
    ctx.fillStyle = "rgba(12, 43, 34, 0.10)";
    ctx.fill();
    ctx.restore();
  }

  if (overlay) ctx.drawImage(overlay, 0, 0, template.width, template.height);

  ctx.fillStyle = template.ink;
  ctx.textBaseline = "alphabetic";
  for (const slot of template.slots) {
    const raw = (values[slot.key] ?? "").trim();
    if (!raw) continue;
    const size = fitText(ctx, raw, template.font, slot.size, slot.maxWidth);
    ctx.font = fontString(template.font, size);
    ctx.fillText(raw, slot.x, slot.y, slot.maxWidth);
  }
}

export async function exportTemplate(input: RenderInput, scale = 2): Promise<Blob> {
  const overlay = await loadImage(input.template.src);
  await ensureFonts();
  const canvas = document.createElement("canvas");
  renderTemplate(canvas, { ...input, scale }, overlay);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), "image/png"),
  );
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  let blob: Blob = file;
  const isHeic = /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    blob = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })) as Blob;
  }
  const url = URL.createObjectURL(blob);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read that image"));
    el.src = url;
  });
  return img;
}
