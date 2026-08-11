import { useEffect, useMemo, useRef, useState } from "react";
import {
  CARD_TEMPLATES,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  PFP_TEMPLATES,
  type FieldKey,
  type Template,
} from "@/lib/templates";
import { exportTemplate, fileToImage, type Area } from "@/lib/render";
import { getShareCaption } from "@/lib/share-captions";
import { CropDialog } from "@/components/CropDialog";
import { TemplateCanvas } from "@/components/TemplateCanvas";

type Format = "pfp" | "card";
const FIELD_ORDER: FieldKey[] = ["name", "role", "title", "team"];

function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-jungle-deep bg-mustard font-pixel text-[10px] text-jungle-deep">
        {n}
      </span>
      <h2 className="font-pixel text-[11px] uppercase tracking-tight sm:text-xs">{label}</h2>
    </div>
  );
}

export function Generator() {
  const [format, setFormat] = useState<Format>("pfp");
  const [templateId, setTemplateId] = useState(PFP_TEMPLATES[0]!.id);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);
  const [values, setValues] = useState<Partial<Record<FieldKey, string>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pool = format === "pfp" ? PFP_TEMPLATES : CARD_TEMPLATES;
  const template: Template = useMemo(
    () => pool.find((t) => t.id === templateId) ?? pool[0]!,
    [pool, templateId],
  );

  useEffect(() => {
    if (!pool.some((t) => t.id === templateId)) setTemplateId(pool[0]!.id);
  }, [pool, templateId]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.size > 15 * 1024 * 1024) {
      setError("That image is larger than 15 MB — try a smaller one.");
      return;
    }
    try {
      setBusy(true);
      const img = await fileToImage(file);
      setPhoto(img);
      setCrop(null);
      setCropping(true);
    } catch {
      setError("We couldn't read that file. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  const fileName = `hh-goa-2026-${format === "pfp" ? "frame" : "builder-id"}-${template.id}.png`;

  async function buildBlob() {
    return exportTemplate({ template, photo, crop, values }, 2);
  }

  async function download() {
    try {
      setBusy(true);
      const blob = await buildBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setNote("Downloaded! Share it with #FrameInGoa 🌴");
    } catch {
      setError("Export failed — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    try {
      setBusy(true);
      const blob = await buildBlob();
      const file = new File([blob], fileName, { type: "image/png" });
      const caption = getShareCaption(values.name, values.title);
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "Hack House Goa 2026",
          text: caption,
        });
      } else {
        setNote("Sharing isn't supported here — use Download instead.");
      }
    } catch {
      /* user dismissed the share sheet */
    } finally {
      setBusy(false);
    }
  }

  function postToX() {
    const caption = getShareCaption(values.name, values.title);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div id="generator" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="space-y-6">
        {/* Step 1 — format */}
        <section className="card-pop p-5">
          <StepBadge n={1} label="Pick your format" />
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "pfp", title: "Profile frame", sub: "1:1 avatar frame" },
                { id: "card", title: "Builder ID", sub: "Shareable ID card" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormat(opt.id)}
                className={`rounded-lg border-2 border-jungle-deep px-4 py-3 text-left transition-transform hover:-translate-y-0.5 ${
                  format === opt.id
                    ? "bg-jungle text-primary-foreground shadow-pop"
                    : "bg-sand-deep/50 text-foreground"
                }`}
              >
                <span className="block font-pixel text-[10px] uppercase">{opt.title}</span>
                <span className="mt-1 block text-xs opacity-80">{opt.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — photo */}
        <section className="card-pop p-5">
          <StepBadge n={2} label="Add your photo" />
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border-2 border-jungle-deep bg-mustard px-4 py-2.5 font-pixel text-[10px] uppercase text-jungle-deep shadow-pop transition-transform hover:-translate-y-0.5"
            >
              {photo ? "Replace photo" : "Upload photo"}
            </button>
            {photo && (
              <button
                onClick={() => setCropping(true)}
                className="rounded-lg border-2 border-jungle-deep bg-sand px-4 py-2.5 text-sm font-semibold hover:bg-sand-deep"
              >
                Reposition
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            JPG, PNG, WebP or HEIC up to 15 MB. Everything is processed on your device — nothing is
            uploaded.
          </p>
          {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
        </section>

        {/* Step 3 — details */}
        {format === "card" && (
          <section className="card-pop p-5">
            <StepBadge n={3} label="Your builder details" />
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELD_ORDER.map((key) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    {FIELD_LABELS[key]}
                  </span>
                  <input
                    value={values[key] ?? ""}
                    maxLength={28}
                    placeholder={FIELD_PLACEHOLDERS[key]}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    className="w-full rounded-lg border-2 border-jungle-deep/40 bg-sand px-3 py-2 text-sm outline-none focus:border-jungle-deep focus:ring-2 focus:ring-jungle/30"
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Step 4 — design */}
        <section className="card-pop p-5">
          <StepBadge n={format === "card" ? 4 : 3} label="Choose a design" />
          <div className={`grid gap-3 ${format === "pfp" ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2"}`}>
            {pool.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`overflow-hidden rounded-lg border-2 p-1.5 transition-transform hover:-translate-y-0.5 ${
                  t.id === template.id
                    ? "border-jungle-deep bg-mustard shadow-pop"
                    : "border-jungle-deep/25 bg-sand-deep/40"
                }`}
                aria-pressed={t.id === template.id}
              >
                <img src={t.src} alt={t.name} className="w-full rounded" loading="lazy" />
                <span className="mt-1 block truncate text-[10px] font-semibold">{t.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Live preview */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="card-pop scan-grid p-5 shadow-pop-lg">
          <h2 className="mb-4 font-pixel text-[11px] uppercase">Live preview</h2>
          <div className="rounded-lg bg-sand-deep/40 p-3">
            <TemplateCanvas
              input={{ template, photo, crop, values }}
              className="w-full max-w-full"
            />
          </div>
          {!photo && (
            <p className="mt-3 text-xs text-muted-foreground">
              Upload a photo to fill the cutout — the preview updates instantly.
            </p>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              onClick={() => void download()}
              disabled={busy}
              className="rounded-lg border-2 border-jungle-deep bg-jungle px-4 py-3 font-pixel text-[10px] uppercase text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Working…" : "Download PNG"}
            </button>
            <button
              onClick={() => void share()}
              disabled={busy}
              className="rounded-lg border-2 border-jungle-deep bg-sand px-4 py-3 font-pixel text-[10px] uppercase text-jungle-deep transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              Share
            </button>
            <button
              onClick={() => void postToX()}
              disabled={busy}
              className="rounded-lg border-2 border-jungle-deep bg-[#1d9bf0] px-4 py-3 font-pixel text-[10px] uppercase text-white shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              Post to X
            </button>
          </div>
          {note && <p className="mt-3 text-xs font-semibold text-jungle">{note}</p>}
        </div>
      </aside>

      {cropping && photo && (
        <CropDialog
          image={photo}
          aspect={template.hole.shape === "circle" ? 1 : template.hole.w / template.hole.h}
          cropShape={template.hole.shape === "circle" ? "round" : "rect"}
          onCancel={() => setCropping(false)}
          onConfirm={(area) => {
            setCrop(area);
            setCropping(false);
          }}
        />
      )}
    </div>
  );
}
