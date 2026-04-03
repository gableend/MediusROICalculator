"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  RED, DARK, CardProps,
  APCard0, APAutoFlowCard, APApprovalCard, APCard2, APCard3,
  APSupplierCard, APReconCard, APCard1, APAnalyticsCard,
  APSupplierOnboardingCard,
  SMIntelligentIntakeCard,
  SMSourcingCard,
  SMContractCard,
  SMContractIntakeCard,
  SMProcurementCard,
  PMCard0, PMCard1, PMCard2, PMFraudPreventionCard, PMDisputeCard,
  SMCard0, SMCard1, SMCard2,
  EXCard0, EXCard1, EXCard2,
  AgentCaptureCard, AgentCodingCard, AgentPOConnectCard, AgentFraudRiskCard,
  AgentCopilotCard, AgentSupplierCard, AgentStatementReconCard, AgentPaymentsCard,
  AgentExpenseProcessingCard, AgentExpenseFraudCard, AgentSuspiciousExpenseCard,
  AgentMileageCard, AgentPaymentCardsCard, PolicyComplianceCard,
  RoadmapProcurementCard, RoadmapSupplierOnboardingCard,
  RoadmapContractCard, RoadmapExpenseFraudCard, RoadmapExpenseCardFraudCard,
} from "@/components/CardComponents";

// ─── Dimensions ───────────────────────────────────────────────────────────────
const CARD_W          = 360;   // Full / carousel width (matches globals.css ap-card base)
const CARD_W_COMPACT  = 560;   // Hero detail-panel width (right column @ 1120px max-width)
const CARD_H_COMPACT  = 240;   // Hero detail-panel height
const CARD_H_FULL     = 320;   // Standalone / carousel height

// ─── Card catalogue ───────────────────────────────────────────────────────────
type CardEntry = {
  id: string;
  label: string;
  Component: React.ComponentType<CardProps>;
  fixedW?: number; // override card dimensions (e.g. square roadmap cards)
  fixedH?: number;
};

const CARD_GROUPS: { group: string; cards: CardEntry[] }[] = [
  {
    group: "AP Automation: Capability Cards",
    cards: [
      { id: "invoice-capture",          label: "Invoice capture",          Component: APCard0 },
      { id: "invoice-automation",       label: "Invoice automation",       Component: APAutoFlowCard },
      { id: "ai-approvals",             label: "AI-assisted approvals",    Component: APApprovalCard },
      { id: "fraud-risk",               label: "Fraud & risk detection",   Component: APCard2 },
      { id: "payment-automation",       label: "Payment automation",       Component: PMCard0 },
      { id: "invoicing-compliance",      label: "e-Invoicing & compliance", Component: APCard3 },
      { id: "supplier-conversations",   label: "Supplier conversations",   Component: APSupplierCard },
      { id: "statement-reconciliation", label: "Statement reconciliation", Component: APReconCard },
      { id: "erp-integrations",         label: "ERP integrations",         Component: APCard1 },
      { id: "analytics",                label: "Analytics",                Component: APAnalyticsCard },
    ],
  },
  {
    group: "Payments",
    cards: [
      { id: "pm-payment-run",        label: "Payment run",             Component: PMCard0 },
      { id: "pm-methods",            label: "Payment methods",         Component: PMCard1 },
      { id: "pm-cash-flow",          label: "Cash flow visibility",    Component: PMCard2 },
      { id: "pm-fraud-prevention",   label: "Card fraud prevention",   Component: PMFraudPreventionCard },
      { id: "pm-dispute-resolution", label: "Dispute resolution",      Component: PMDisputeCard },
    ],
  },
  {
    group: "Spend Management",
    cards: [
      { id: "sm-sourcing",           label: "Sourcing",              Component: SMSourcingCard },
      { id: "sm-contracts",          label: "Contract Management",   Component: SMContractCard },
      { id: "sm-contract-intake",    label: "Contract Intake",        Component: SMContractIntakeCard },
      { id: "supplier-onboarding",   label: "Supplier onboarding",   Component: APSupplierOnboardingCard },
      { id: "sm-procurement",        label: "Procurement",           Component: SMProcurementCard },
      { id: "intelligent-intake",    label: "Intelligent Intake",    Component: SMIntelligentIntakeCard },
      { id: "sm-budget",             label: "Budget vs Actual",      Component: SMCard0 },
    ],
  },
  {
    group: "Expenses",
    cards: [
      { id: "ex-capture",   label: "Receipt capture",   Component: EXCard0 },
      { id: "ex-policy",    label: "Policy check",      Component: EXCard1 },
      { id: "ex-reimburse", label: "Reimbursements",    Component: EXCard2 },
      { id: "ex-mileage",         label: "Mileage calculation",     Component: AgentMileageCard },
      { id: "ex-payment-cards",  label: "Payment Cards & Budgets", Component: AgentPaymentCardsCard },
      { id: "ex-policy-compliance", label: "Policy & Compliance", Component: PolicyComplianceCard },
      { id: "sm-policy",    label: "Policy control",   Component: SMCard1 },
      { id: "sm-spend",     label: "Spend by category", Component: SMCard2 },
    ],
  },
  {
    group: "Medius Agents",
    cards: [
      { id: "agent-capture",    label: "Invoice Capture Agent",      Component: AgentCaptureCard    },
      { id: "agent-coding",     label: "Invoice Coding Agent",       Component: AgentCodingCard     },
      { id: "agent-po-connect", label: "PO Connect Agent",           Component: AgentPOConnectCard  },
      { id: "agent-fraud",      label: "Fraud & Risk Agent",         Component: AgentFraudRiskCard  },
      { id: "agent-copilot",    label: "Approvals Agent",            Component: AgentCopilotCard    },
      { id: "agent-supplier",   label: "Supplier Inquiries Agent",          Component: AgentSupplierCard       },
      { id: "agent-stmt-recon", label: "Statement Reconciliation Agent",    Component: AgentStatementReconCard },
      { id: "agent-payments",         label: "Payment Optimization Agent",    Component: AgentPaymentsCard          },
      { id: "agent-expense-processing", label: "Expense Processing Agent",    Component: AgentExpenseProcessingCard },
      { id: "agent-suspicious-expense",  label: "Suspicious Expense Agent",      Component: AgentSuspiciousExpenseCard },
    ],
  },
  {
    group: "Roadmap Agents",
    cards: [
      { id: "roadmap-procurement",         label: "Procurement Agent",          Component: RoadmapProcurementCard,        fixedW: 240, fixedH: 240 },
      { id: "roadmap-supplier-onboarding", label: "Supplier Onboarding Agent",  Component: RoadmapSupplierOnboardingCard, fixedW: 240, fixedH: 240 },
      { id: "roadmap-contract",            label: "Contract Intake Agent",       Component: RoadmapContractCard,           fixedW: 240, fixedH: 240 },
      { id: "roadmap-expense-fraud",       label: "Expense Fraud Agent",          Component: RoadmapExpenseFraudCard,       fixedW: 240, fixedH: 240 },
      { id: "roadmap-card-fraud",         label: "Expense Card Fraud Agent",     Component: RoadmapExpenseCardFraudCard,   fixedW: 240, fixedH: 240 },
    ],
  },
];

// ─── Single card cell ─────────────────────────────────────────────────────────
function CardCell({
  id, label, Component, variant, fixedW, fixedH,
}: CardEntry & { variant: "compact" | "full" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const cardW = fixedW ?? (variant === "compact" ? CARD_W_COMPACT : CARD_W);
  const cardH = fixedH ?? (variant === "compact" ? CARD_H_COMPACT : CARD_H_FULL);

  const download = useCallback(async () => {
    if (!wrapRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(wrapRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: cardW,
        height: cardH,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `medius-${variant}-${id}.png`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setDownloading(false);
    }
  }, [id, variant, cardW, cardH, downloading]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: `${cardW}px` }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{label}</span>
        <button
          onClick={download}
          disabled={downloading}
          title={`Download ${variant} PNG`}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "3px 9px", borderRadius: "5px", border: "none",
            background: downloading ? "#e5e7eb" : RED,
            color: "white", fontSize: "10px", fontWeight: 600,
            cursor: downloading ? "wait" : "pointer",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
        >
          {downloading ? "…" : (
            <>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              PNG
            </>
          )}
        </button>
      </div>

      {/* Card render at fixed dimensions */}
      <div
        ref={wrapRef}
        data-card-wrap
        data-card-id={id}
        data-card-variant={variant}
        style={{
          width: `${cardW}px`,
          height: `${cardH}px`,
          overflow: "hidden",
          borderRadius: "14px",
          background: "white",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className={variant === "compact" ? "all-cards-compact" : "all-cards-full"}>
          <Component active={true} exit={false} variant={variant} />
        </div>
      </div>

      {/* Size label beneath */}
      <div style={{ fontSize: "10px", color: "#9ca3af", textAlign: "center" }}>
        {cardW}×{cardH}px
      </div>
    </div>
  );
}

// ─── Bulk download for a given variant ───────────────────────────────────────
function useDownloadSection(variant: "compact" | "full") {
  const [progress, setProgress] = useState<number | null>(null);

  const downloadAll = useCallback(async () => {
    const cells = document.querySelectorAll<HTMLElement>(`[data-card-wrap][data-card-variant="${variant}"]`);
    const cardW = variant === "compact" ? CARD_W_COMPACT : CARD_W;
    const cardH = variant === "compact" ? CARD_H_COMPACT : CARD_H_FULL;
    setProgress(0);
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const id = cell.getAttribute("data-card-id") || `card-${i}`;
      try {
        const dataUrl = await toPng(cell, { pixelRatio: 2, backgroundColor: "#ffffff", width: cardW, height: cardH });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `medius-${variant}-${id}.png`;
        a.click();
        await new Promise((r) => setTimeout(r, 200));
      } catch (e) {
        console.error("Export failed for", id, e);
      }
      setProgress(Math.round(((i + 1) / cells.length) * 100));
    }
    setTimeout(() => setProgress(null), 1200);
  }, [variant]);

  return { progress, downloadAll };
}

// ─── Section header for compact / full ───────────────────────────────────────
function VariantHeader({
  variant, onDownloadAll, progress,
}: {
  variant: "compact" | "full";
  onDownloadAll: () => void;
  progress: number | null;
}) {
  const isSquare = variant === "full";
  const name = isSquare ? "Square" : "Wide";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 16px", borderRadius: "10px",
      background: isSquare ? "#f8faff" : "#fff8f8",
      border: `1px solid ${isSquare ? "#dbeafe" : "#fecaca"}`,
      marginBottom: "20px",
    }}>
      <div style={{
        padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
        background: isSquare ? DARK : RED, color: "white",
        flexShrink: 0,
      }}>
        {name}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: DARK }}>
          {isSquare ? `${CARD_W} × ${CARD_H_FULL} px` : `${CARD_W_COMPACT} × ${CARD_H_COMPACT} px`}
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          {isSquare
            ? "For carousels & standalone presentation slides"
            : "For homepage hero detail panel"}
        </div>
      </div>
      <button
        onClick={onDownloadAll}
        disabled={progress !== null}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "7px 14px", borderRadius: "7px", border: "none",
          background: progress !== null ? "#e5e7eb" : (isSquare ? DARK : RED),
          color: "white", fontSize: "11px", fontWeight: 700,
          cursor: progress !== null ? "wait" : "pointer",
          transition: "background 0.2s", flexShrink: 0,
        }}
      >
        {progress !== null ? (
          `Downloading… ${progress}%`
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download all {name} PNGs
          </>
        )}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AllCardsPage() {
  const compact = useDownloadSection("compact");
  const full    = useDownloadSection("full");
  const totalCards = CARD_GROUPS.reduce((n, g) => n + g.cards.length, 0);

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Sticky header ── */}
      <div style={{
        background: DARK, padding: "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Medius logo -- links back to homepage */}
          <Link href="/" style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ext.same-assets.com/1543560847/102504094.svg"
              alt="Medius"
              style={{ height: "28px", filter: "brightness(0) invert(1)", display: "block" }}
            />
          </Link>
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.2)" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: RED }} />
              <span style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Card Library</span>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: "3px 0 0 20px" }}>
              {totalCards} cards · 2 sizes each · @2× PNG export for PowerPoint
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={full.downloadAll}
            disabled={full.progress !== null}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)",
              background: full.progress !== null ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.15)",
              color: "white", fontSize: "12px", fontWeight: 700,
              cursor: full.progress !== null ? "wait" : "pointer",
            }}
          >
            {full.progress !== null ? `Square… ${full.progress}%` : "↓ All Square"}
          </button>
          <button
            onClick={compact.downloadAll}
            disabled={compact.progress !== null}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)",
              background: compact.progress !== null ? "rgba(255,255,255,0.1)" : RED,
              color: "white", fontSize: "12px", fontWeight: 700,
              cursor: compact.progress !== null ? "wait" : "pointer",
            }}
          >
            {compact.progress !== null ? `Wide… ${compact.progress}%` : "↓ All Wide"}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* ── Square section (full variant) -- listed first ── */}
        <div style={{ marginBottom: "60px" }}>
          <VariantHeader variant="full" onDownloadAll={full.downloadAll} progress={full.progress} />

          {CARD_GROUPS.map(({ group, cards }) => (
            <div key={`full-${group}`} style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: DARK, flexShrink: 0 }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: DARK, margin: 0 }}>{group}</h2>
                <div style={{ flex: 1, height: "1px", background: "#dde0e3" }} />
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>{cards.length} cards</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {cards.map((card) => (
                  <CardCell key={card.id} {...card} variant="full" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px" }}>
          <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", padding: "4px 12px", background: "#f0f2f5", borderRadius: "100px" }}>
            Wide versions below
          </span>
          <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
        </div>

        {/* ── Wide section (compact variant) ── */}
        <div>
          <VariantHeader variant="compact" onDownloadAll={compact.downloadAll} progress={compact.progress} />

          {CARD_GROUPS.map(({ group, cards }) => (
            <div key={`compact-${group}`} style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: RED, flexShrink: 0 }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: DARK, margin: 0 }}>{group}</h2>
                <div style={{ flex: 1, height: "1px", background: "#dde0e3" }} />
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>{cards.length} cards</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {cards.map((card) => (
                  <CardCell key={card.id} {...card} variant="compact" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CSS overrides for both render modes ── */}
      <style>{`
        /* Compact: 560×240px -- matches hero detail-panel dimensions */
        .all-cards-compact .ap-card {
          position: static !important;
          width: ${CARD_W_COMPACT}px !important;
          height: ${CARD_H_COMPACT}px !important;
          left: auto !important;
          transform: none !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          transition: none !important;
          box-shadow: none !important;
          overflow: hidden !important;
          border-radius: 14px !important;
        }
        .all-cards-compact .ap-card.ap-card--on,
        .all-cards-compact .ap-card.ap-card--exit {
          transform: none !important;
          opacity: 1 !important;
        }

        /* Full: 360×320px, static positioned */
        .all-cards-full .ap-card {
          position: static !important;
          width: ${CARD_W}px !important;
          height: ${CARD_H_FULL}px !important;
          left: auto !important;
          transform: none !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          transition: none !important;
          box-shadow: none !important;
          overflow: hidden !important;
          border-radius: 14px !important;
        }
        .all-cards-full .ap-card.ap-card--on,
        .all-cards-full .ap-card.ap-card--exit {
          transform: none !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
