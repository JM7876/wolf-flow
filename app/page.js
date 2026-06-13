/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Communications Portal (Front Page / Maintenance)
   Created and Authored by Johnathon Moulds © 2026
═══════════════════════════════════════════════════════════════════ */

export const metadata = {
  title: "Wolf Flow LLC — Back Soon",
  description: "The Communications Portal is being upgraded.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* faint W watermark, bottom-right */}
      <div className="pointer-events-none absolute -bottom-10 right-0 select-none text-[42vw] font-black leading-none tracking-tighter text-white/[0.03]">
        W
      </div>

      {/* header */}
      <header className="flex items-center justify-between px-6 py-7 md:px-16">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-white/30 text-sm font-black">
            W
          </span>
          <span className="text-xs font-medium tracking-[0.25em] text-white/80 md:text-sm">
            WOLF FLOW LLC
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/50 md:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          PORTAL CLOSED — UPGRADING
        </div>
      </header>

      {/* hero */}
      <section className="px-6 pt-10 md:px-16 md:pt-16">
        <p className="mb-5 text-xs tracking-[0.3em] text-white/40 md:text-sm">
          TEMPORARILY UNAVAILABLE
        </p>

        <h1 className="font-black leading-[0.82] tracking-tighter">
          <span className="block text-[22vw] md:text-[11rem]">Back</span>
          <span className="mt-1 inline-block bg-white px-3 text-[22vw] text-[#0A0A0A] md:text-[11rem]">
            Soon.
          </span>
        </h1>

        <div className="mt-10 h-px w-24 bg-white/30" />
      </section>

      {/* footer */}
      <footer className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-7 text-[10px] tracking-[0.2em] text-white/30 md:px-16 md:text-xs">
        <span>© 2026 Wolf Flow LLC · Athens, Michigan</span>
        <span className="hidden md:inline">UPGRADES IN PROGRESS</span>
      </footer>
    </main>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
