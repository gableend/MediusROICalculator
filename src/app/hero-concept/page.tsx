"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";

// ─── Card metadata ─────────────────────────────────────────────────
const LABELS = ["Invoice received", "AI data extraction", "Approval routing", "Payment processed"];
const HOLD   = [2800, 3600, 3600, 3200]; // ms each card stays visible

// ─── Shared card chrome (header row) ───────────────────────────────
function CardHeader({
  icon, iconBg, title, step,
}: { icon: string; iconBg: string; title: string; step: string }) {
  return (
    <div className="flex items-center gap-[10px] mb-[18px]">
      <div
        className="w-[30px] h-[30px] rounded-[7px] flex-shrink-0 flex items-center justify-center text-[15px]"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <span className="text-[12px] font-semibold flex-1 tracking-[0.1px]" style={{ color: "#2f4344" }}>
        {title}
      </span>
      <span className="text-[10px] font-medium" style={{ color: "#c0c0c0" }}>
        {step}
      </span>
    </div>
  );
}

// ─── Card 1: Invoice Received ───────────────────────────────────────
function Card1({ active, exit }: { active: boolean; exit: boolean }) {
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader icon="📄" iconBg="rgba(218,32,40,0.10)" title="New Invoice" step="1 of 4" />
      <div className="flex justify-between items-baseline mb-[5px]">
        <span className="text-[15px] font-bold" style={{ color: "#111" }}>Acme Corp</span>
        <span className="text-[18px] font-bold" style={{ color: "#111" }}>$12,450</span>
      </div>
      <div className="text-[11px] mb-[16px]" style={{ color: "#aaa" }}>
        Invoice #INV-2891 &nbsp;·&nbsp; Received just now
      </div>
      <span className="inline-flex items-center gap-[5px] px-[11px] py-[4px] rounded-full text-[11px] font-semibold"
        style={{ background: "#eff6ff", color: "#1d4ed8" }}>
        <span className="w-[5px] h-[5px] rounded-full" style={{ background: "currentColor" }} />
        AI processing
      </span>
    </div>
  );
}

// ─── Card 2: Medius Capture ─────────────────────────────────────────
function Card2({ active, exit, barGo }: { active: boolean; exit: boolean; barGo: boolean }) {
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader icon="⚡" iconBg="rgba(218,32,40,0.10)" title="Medius Capture" step="2 of 4" />
      <div className="flex flex-col gap-[9px]">
        {[
          { label: "Vendor Name",     value: "Acme Corp" },
          { label: "Invoice Amount",  value: "$12,450.00" },
          { label: "GL Code",         value: "6200-AP" },
          { label: "PO Match",        value: "PO-8821" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[12px]" style={{ color: "#888" }}>{label}</span>
            <span className="text-[12px] font-semibold flex items-center gap-[5px]" style={{ color: "#111" }}>
              {value}
              <span style={{ color: "#16a34a", fontSize: "12px" }}>✓</span>
            </span>
          </div>
        ))}
      </div>
      <div className="h-[3px] rounded-[2px] mt-[15px] overflow-hidden" style={{ background: "#ededed" }}>
        <div className={`ap-pbar-fill ${barGo ? "go" : ""}`} />
      </div>
      <div className="text-[10px] text-right mt-[5px]" style={{ color: "#c0c0c0" }}>
        100% touchless extraction
      </div>
    </div>
  );
}

// ─── Card 3: SmartFlow Routing ──────────────────────────────────────
function Card3({ active, exit }: { active: boolean; exit: boolean }) {
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader icon="→" iconBg="rgba(47,67,68,0.10)" title="SmartFlow Routing" step="3 of 4" />
      <div className="flex items-center gap-[11px] mb-[13px]">
        <div
          className="w-[34px] h-[34px] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
          style={{ background: "linear-gradient(135deg, #2f4344 0%, #5a7b7d 100%)" }}
        >
          SM
        </div>
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "#111" }}>Sarah Mitchell</div>
          <div className="text-[11px]" style={{ color: "#aaa" }}>AP Manager · Auto-assigned</div>
        </div>
      </div>
      <div
        className="text-[12px] leading-[1.58] mb-[14px] py-[9px] px-[13px] rounded-[0_7px_7px_0]"
        style={{ color: "#555", background: "#f9f8f6", borderLeft: "3px solid #da2028" }}
      >
        Invoice #INV-2891 from Acme Corp requires your approval — $12,450
      </div>
      <div className="flex gap-[8px]">
        <button
          className="flex-1 py-[8px] text-[12px] rounded-[7px]"
          style={{ border: "1.5px solid #e8e8e8", background: "white", color: "#999", fontFamily: "inherit" }}
        >
          Reject
        </button>
        <button className={`ap-approve-btn ${active ? "pulse" : ""}`}>
          ✓ Approve
        </button>
      </div>
    </div>
  );
}

// ─── Card 4: Payment Processed ──────────────────────────────────────
function Card4({ active, exit }: { active: boolean; exit: boolean }) {
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader icon="✓" iconBg="rgba(22,163,74,0.10)" title="Touchless Payment" step="4 of 4" />
      <div className="flex flex-col items-center text-center py-[4px]">
        <div
          className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-[22px] mb-[11px]"
          style={{ border: "2px solid #16a34a", background: "#f0fdf4", color: "#16a34a" }}
        >
          ✓
        </div>
        <div className="text-[13px] font-semibold mb-[3px]" style={{ color: "#555" }}>Acme Corp</div>
        <div className="text-[24px] font-bold mb-[14px]" style={{ color: "#111" }}>$12,450.00</div>
        <div className="flex gap-[22px]">
          {[
            { value: "0",    label: "Manual steps" },
            { value: "2.3s", label: "Process time" },
            { value: "100%", label: "Automated" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-[14px] font-bold" style={{ color: "#2f4344" }}>{value}</div>
              <div className="text-[10px] uppercase tracking-[0.5px] mt-[2px]" style={{ color: "#c0c0c0" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function HeroConceptPage() {
  const [activeCard, setActiveCard] = useState<number>(-1);
  const [exitCard,   setExitCard]   = useState<number>(-1);
  const [barGo,      setBarGo]      = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback((current: number) => {
    const next = (current + 1) % 4;
    setExitCard(current);
    setActiveCard(-1);

    timerRef.current = setTimeout(() => {
      setExitCard(-1);
      setActiveCard(next);
      timerRef.current = setTimeout(() => advance(next), HOLD[next]);
    }, 400);
  }, []);

  // Kick off sequence
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setActiveCard(0);
      timerRef.current = setTimeout(() => advance(0), HOLD[0]);
    }, 900);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [advance]);

  // Trigger progress bar on card 2
  useEffect(() => {
    if (activeCard === 1) {
      setBarGo(false);
      const t = setTimeout(() => setBarGo(true), 120);
      return () => clearTimeout(t);
    }
  }, [activeCard]);

  return (
    <main>
      <Header />

      {/* ─── Hero ─── */}
      <section
        className="relative w-full min-h-screen flex items-center overflow-hidden"
        style={{ background: "#2f4344" }}
      >
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "68% center" }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/AdobeStock_455008259_Video_4K_Preview.mp4" type="video/mp4" />
        </video>

        {/* Gradient veil — strong on left, fades to photo on right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, #2f4344 0%, #2f4344 36%, rgba(47,67,68,0.85) 50%, rgba(30,46,46,0.30) 70%, rgba(0,0,0,0.38) 100%)",
          }}
        />

        {/* Content — container matches header's container mx-auto px-4 for logo alignment */}
        <div
          className="w-full px-6 lg:px-8 relative z-10 flex items-center gap-[60px]"
          style={{ paddingTop: "106px" }}
        >
          {/* ── Left: headline + CTAs ── */}
          <div style={{ flex: "0 0 450px" }}>
            <div className="hero-eyebrow-pill">
              <span className="hero-eyebrow-dot" />
              Agentic AI &nbsp;·&nbsp; Autonomous AP
            </div>

            <h1
              style={{
                fontSize: "54px", fontWeight: 700, lineHeight: 1.08,
                color: "white", marginBottom: "18px", letterSpacing: "-1.2px",
              }}
            >
              Autonomous AP,<br />powered by<br />
              <span style={{ color: "#ab9c6d" }}>agentic AI</span>
            </h1>

            <p
              style={{
                fontSize: "16px", lineHeight: 1.68,
                color: "rgba(255,255,255,0.64)",
                maxWidth: "400px", marginBottom: "36px",
              }}
            >
              Medius eliminates manual invoice processing — AI that captures,
              codes, routes, and pays without human intervention. 100% touchless.
            </p>

            <div className="flex gap-[13px] items-center">
              <button
                style={{
                  background: "#da2028", color: "white", border: "none",
                  padding: "14px 28px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.7px", cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Book a Demo
              </button>
              <button
                className="flex items-center gap-[9px]"
                style={{
                  background: "transparent", color: "white",
                  border: "1.5px solid rgba(255,255,255,0.32)",
                  padding: "13px 22px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", fontSize: "8px",
                  }}
                >
                  ▶
                </span>
                Watch a demo
              </button>
            </div>
          </div>

          {/* ── Right: cycling AP workflow cards ── */}
          <div className="flex-1 flex justify-center items-center">
            <div style={{ position: "relative", width: "360px" }}>

              {/* Step label */}
              <div
                style={{
                  height: "28px", marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "10px",
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "10.5px", fontWeight: 500,
                  letterSpacing: "1.2px", textTransform: "uppercase",
                  opacity: activeCard >= 0 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <div style={{ width: "22px", height: "1px", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                <span>{activeCard >= 0 ? LABELS[activeCard] : ""}</span>
              </div>

              {/* Card stack */}
              <div style={{ position: "relative", height: "240px" }}>

                {/* Ghost depth cards (decorative) */}
                <div style={{
                  position: "absolute", left: "50%",
                  width: "316px", height: "200px", borderRadius: "14px",
                  background: "white", pointerEvents: "none",
                  transform: "translateX(-50%) translateY(18px) scale(0.92)",
                  opacity: 0.18,
                }} />
                <div style={{
                  position: "absolute", left: "50%",
                  width: "340px", height: "220px", borderRadius: "14px",
                  background: "white", pointerEvents: "none",
                  transform: "translateX(-50%) translateY(9px) scale(0.96)",
                  opacity: 0.38,
                }} />

                {/* AP Workflow Cards */}
                <Card1 active={activeCard === 0} exit={exitCard === 0} />
                <Card2 active={activeCard === 1} exit={exitCard === 1} barGo={barGo} />
                <Card3 active={activeCard === 2} exit={exitCard === 2} />
                <Card4 active={activeCard === 3} exit={exitCard === 3} />
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-[7px] mt-[20px]">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "6px", borderRadius: "3px",
                      width: activeCard === i ? "20px" : "6px",
                      background: activeCard === i
                        ? "rgba(255,255,255,0.88)"
                        : "rgba(255,255,255,0.28)",
                      transition: "all 0.35s ease",
                    }}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Wave transition to next section */}
        <div className="absolute bottom-[-1px] left-0 right-0 z-20 leading-none">
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: "100%", height: "72px", display: "block" }}>
            <path d="M0,36 C320,72 820,4 1440,44 L1440,72 L0,72 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Placeholder below hero */}
      <div className="bg-white py-20 text-center">
        <p className="text-sm uppercase tracking-widest font-medium" style={{ color: "#aaa" }}>
          ↓ &nbsp; Rest of page continues here &nbsp; ↓
        </p>
      </div>
    </main>
  );
}
