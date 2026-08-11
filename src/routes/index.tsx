import { createFileRoute } from "@tanstack/react-router";
const hero = { url: "/images/hero-beach.jpg" };
import { Generator } from "@/components/Generator";

export const Route = createFileRoute("/")({
  component: Index,
});

const PERKS = [
  { icon: "</>", label: "Build" },
  { icon: "◉", label: "Hack" },
  { icon: "✈", label: "Ship" },
  { icon: "★", label: "Impact" },
];

function Index() {
  return (
    <main className="min-h-screen">
      <header className="border-b-2 border-jungle-deep/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <img
            src="/images/hacker_house_exact.svg"
            alt="Hacker House Goa 2026"
            style={{ width: "100%", maxWidth: "300px", height: "auto", maxHeight: "80px", objectFit: "contain", objectPosition: "left center" }}
          />
          <a
            href="#generator"
            className="rounded-lg border-2 border-jungle-deep bg-mustard px-3 py-2 font-pixel text-[9px] uppercase text-jungle-deep shadow-pop"
          >
            Make mine
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="inline-block rounded-full border-2 border-jungle-deep bg-mustard px-3 py-1 font-pixel text-[9px] uppercase text-jungle-deep">
            Built to hack, flowing to win
          </span>
          <h1 className="mt-5 font-pixel text-2xl leading-[1.5] text-jungle-deep sm:text-3xl lg:text-4xl">
            Frame & Builder ID Generator
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Claim your spot on the timeline. Drop in a photo, pick a Goa-flavoured design, and walk
            away with a profile frame or a full Builder ID card — rendered right in your browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {PERKS.map((p) => (
              <span
                key={p.label}
                className="rounded-lg border-2 border-jungle-deep/30 bg-card px-3 py-2 text-xs font-bold uppercase tracking-wide"
              >
                <span className="mr-2 text-coral">{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>
          <a
            href="#generator"
            className="mt-7 inline-block rounded-lg border-2 border-jungle-deep bg-jungle px-6 py-3 font-pixel text-[11px] uppercase text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Start building →
          </a>
        </div>
        <div className="card-pop overflow-hidden p-0 shadow-pop-lg">
          <img
            src={hero.url}
            alt="Pixel-art illustration of a Goa beach with a Hack House campervan, surfboards and a hillside chapel at sunset"
            className="w-full"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Generator />
      </section>

      <footer className="border-t-2 border-jungle-deep/20 py-8 text-center text-xs text-muted-foreground">
        Made for Hack House Goa 2026 · Images never leave your device.
      </footer>
    </main>
  );
}
