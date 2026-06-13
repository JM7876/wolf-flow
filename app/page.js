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
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily:
          "'Montserrat Alternates', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* faint W watermark, bottom-right */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          bottom: "-10vw",
          right: 0,
          userSelect: "none",
          fontSize: "42vw",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: "rgba(255,255,255,0.03)",
        }}
      >
        W
      </div>

      {/* header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(1.5rem, 4vw, 1.75rem) clamp(1.5rem, 6vw, 4rem)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              height: "2.25rem",
              width: "2.25rem",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: "0.875rem",
              fontWeight: 900,
            }}
          >
            W
          </span>
          <span
            style={{
              fontSize: "clamp(0.75rem, 1.4vw, 0.875rem)",
              fontWeight: 500,
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            WOLF FLOW LLC
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "clamp(0.625rem, 1.2vw, 0.75rem)",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span
            style={{
              height: "0.375rem",
              width: "0.375rem",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.6)",
            }}
          />
          PORTAL CLOSED — UPGRADING
        </div>
      </header>

      {/* hero */}
      <section
        style={{
          padding:
            "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 6vw, 4rem) 0",
        }}
      >
        <p
          style={{
            marginBottom: "1.25rem",
            fontSize: "clamp(0.75rem, 1.4vw, 0.875rem)",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          TEMPORARILY UNAVAILABLE
        </p>

        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            lineHeight: 0.82,
            letterSpacing: "-0.05em",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "clamp(5rem, 22vw, 11rem)",
            }}
          >
            Back
          </span>
          <span
            style={{
              marginTop: "0.25rem",
              display: "inline-block",
              background: "#FFFFFF",
              padding: "0 0.75rem",
              color: "#0A0A0A",
              fontSize: "clamp(5rem, 22vw, 11rem)",
            }}
          >
            Soon.
          </span>
        </h1>

        <div
          style={{
            marginTop: "2.5rem",
            height: "1px",
            width: "6rem",
            background: "rgba(255,255,255,0.3)",
          }}
        />
      </section>

      {/* footer */}
      <footer
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(1.5rem, 4vw, 1.75rem) clamp(1.5rem, 6vw, 4rem)",
          fontSize: "clamp(0.625rem, 1.2vw, 0.75rem)",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <span>© 2026 Wolf Flow LLC · Athens, Michigan</span>
        <span>UPGRADES IN PROGRESS</span>
      </footer>
    </main>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
