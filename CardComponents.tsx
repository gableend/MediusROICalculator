"use client";

export const RED  = "#da2028";
export const DARK = "#2f4344";

export interface CardProps {
  active: boolean;
  exit: boolean;
  variant?: "compact" | "full"; // compact = 240px (hero detail panel), full = 360px (carousel / export)
}

// ─── Shared card header ────────────────────────────────────────────────────────
export function CardHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      <div style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: RED, flexShrink: 0,
        boxShadow: "0 0 0 3px rgba(218,32,40,0.15)",
      }} />
      <span style={{ fontSize: "12px", fontWeight: 600, color: DARK, flex: 1 }}>{title}</span>
      {badge && (
        <span style={{
          fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px",
          background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
        }}>{badge}</span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AP AUTOMATION CARDS
// ══════════════════════════════════════════════════════════════════════════════

// ─── AP-0: Invoice capture ────────────────────────────────────────────────────
// Compact (560px): vertical stack -- no grid, wider rows, clean icons
// Full (360px):    2-col grid + summary footer
export function APCard0({ active, exit, variant = "compact" }: CardProps) {
  const formats = [
    { type: "PDF",     abbr: "PDF", source: "Email attachment",  delay: 0 },
    { type: "EDI 810", abbr: "EDI", source: "Supplier portal",   delay: 0.15 },
    { type: "Paper",   abbr: "IMG", source: "Scanned & OCR'd",   delay: 0.3 },
    { type: "XML/UBL", abbr: "XML", source: "e-Invoice network", delay: 0.45 },
  ];
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Treat every invoice equally" badge="Any format" />

      {variant === "compact" ? (
        /* ── Compact: vertical stack -- 3 items only ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {formats.slice(0, 3).map(({ type, abbr, source, delay }) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "6px 12px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "7px", flexShrink: 0,
                background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0px" }}>{abbr}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>{type}</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>{source}</div>
              </div>
              <div style={{
                fontSize: "11px", fontWeight: 700, color: "#16a34a", flexShrink: 0,
                opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
              }}>✓</div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Full: 2-col grid ── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", marginBottom: "12px" }}>
          {formats.map(({ type, abbr, source, delay }) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 9px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0,
                background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: "white" }}>{abbr}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{type}</div>
                <div style={{ fontSize: "9px", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{source}</div>
              </div>
              <div style={{
                fontSize: "9px", fontWeight: 700, color: "#16a34a", flexShrink: 0,
                opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
              }}>✓</div>
            </div>
          ))}
        </div>
      )}

      {variant === "full" && (
        <>
          {/* AI-extracted fields */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              AI-extracted fields
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {["Supplier", "Inv. no.", "Date", "Amount", "VAT", "Line items"].map((field, i) => (
                <span key={field} style={{
                  fontSize: "10px", fontWeight: 600, color: "#2563eb",
                  background: "#e3eef8", border: "none",
                  borderRadius: "100px", padding: "2px 8px",
                  opacity: active ? 1 : 0,
                  transition: `opacity 0.25s ease ${0.45 + i * 0.08}s`,
                }}>
                  ✓ {field}
                </span>
              ))}
            </div>
          </div>

          {/* Summary footer */}
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px",
            padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
            opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.95s",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>1,247 invoices captured today</span>
            <span style={{ fontSize: "10px", color: "#aaa" }}>zero manual keying</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── AP-1: ERP integrations ───────────────────────────────────────────────────
// Compact: 4 ERPs + compact stats footer
// Full:    4 ERPs + full stats footer
export function APCard1({ active, exit, variant = "compact" }: CardProps) {
  const erps = [
    { name: "SAP S/4HANA" },
    { name: "Microsoft Dynamics" },
    { name: "Oracle Cloud ERP" },
    { name: "NetSuite" },
  ];
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Integration is already done" badge="Pre-packaged" />
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: variant === "full" ? "14px" : "10px" }}>
        {erps.map(({ name }, i) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
              background: active ? "#16a34a" : "#e0e0e0",
              boxShadow: active ? "0 0 0 3px rgba(22,163,74,0.15)" : "none",
              transition: `background 0.3s ease ${i * 0.12}s, box-shadow 0.3s ease ${i * 0.12}s`,
            }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#111", flex: 1 }}>{name}</span>
            <span style={{
              fontSize: "10px", fontWeight: 600, color: "#16a34a",
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.12 + 0.2}s`,
            }}>✓ Live</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: variant === "full" ? "12px" : "10px", display: "flex" }}>
        {[
          { value: "50+",  label: "ERP connectors" },
          { value: "Days", label: "to deploy" },
          { value: "Zero", label: "IT burden" },
        ].map(({ value, label }) => (
          <div key={label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: variant === "full" ? "16px" : "14px", fontWeight: 700, color: DARK }}>{value}</div>
            <div style={{ fontSize: "9px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.4px", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AP-2: Fraud & risk detection ─────────────────────────────────────────────
// Compact: Banking risk alert → 3 mitigating actions (Confirmed/Initiated/Applied) → green footer
// Full:    Same + 3 additional anomaly detection checks
export function APCard2({ active, exit, variant = "compact" }: CardProps) {
  const actions = [
    { label: "Bank account verified with supplier", status: "Confirmed", delay: 0 },
    { label: "Four Eyes Principle",                 status: "Initiated", delay: 0.12 },
    { label: "Stopped in Post Control",             status: "Applied",   delay: 0.24 },
  ];
  const extraChecks = [
    { label: "Invoice amount anomaly",    result: "3.4× above average",       ok: false },
  ];
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Fraud & Risk Detection" />
      {/* Alert box */}
      <div style={{
        background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px",
        padding: variant === "compact" ? "6px 12px" : "8px 12px",
        marginBottom: variant === "compact" ? "8px" : "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "2px" }}>
          <span style={{ color: RED, fontSize: "13px" }}>⚠</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: RED }}>Banking Information Risk</span>
        </div>
        <div style={{ fontSize: "11px", color: "#888" }}>Invoice/Master Data bank mismatch</div>
      </div>
      {/* Mitigation action rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "7px" : "9px", marginBottom: variant === "compact" ? "8px" : "10px" }}>
        {actions.map(({ label, status, delay }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#555" }}>{label}</span>
            <span style={{
              fontSize: "10px", fontWeight: 600, color: "#16a34a",
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>✓ {status}</span>
          </div>
        ))}
        {/* Full variant: additional anomaly checks */}
        {variant === "full" && extraChecks.map(({ label, result, ok }, i) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#555" }}>{label}</span>
            <span style={{
              fontSize: "10px", fontWeight: 600, color: ok ? "#16a34a" : RED,
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${(i + 3) * 0.12}s`,
            }}>
              {ok ? "✓" : "⚠"} {result}
            </span>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "7px",
        padding: variant === "compact" ? "6px 12px" : "8px 12px",
        fontSize: "11px", fontWeight: 600, color: "#16a34a",
        opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.4s",
      }}>
        ✓ Risk flagged, mitigated and logged
      </div>
    </div>
  );
}

// ─── AP-3: e-Invoicing ────────────────────────────────────────────────────────
// Compact: 2×2 region grid + network badges
// Full:    2×2 region grid + network badges + compliance stats row
export function APCard3({ active, exit, variant = "compact" }: CardProps) {
  const regions = [
    { region: "United States", checks: ["Pagero network", "Multi-state tax"],  delay: 0 },
    { region: "Germany",       checks: ["XRechnung / ZUGFeRD", "GoBD archiving"], delay: 0.1 },
    { region: "France",        checks: ["Chorus Pro", "2026 mandate ready"],   delay: 0.2 },
    { region: "Norway",        checks: ["PEPPOL / EHF", "VAT validated"],      delay: 0.3 },
  ];
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Invoicing & compliance" badge="Global" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
        {regions.map(({ region, checks, delay }) => (
          <div key={region} style={{ background: "#f8f9fa", borderRadius: "8px", padding: "8px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                background: active ? "#16a34a" : "#e0e0e0",
                transition: `background 0.3s ease ${delay}s`,
              }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{region}</span>
            </div>
            {checks.map((c) => (
              <div key={c} style={{
                fontSize: "9px", color: "#888",
                opacity: active ? 1 : 0,
                transition: `opacity 0.3s ease ${delay + 0.15}s`,
              }}>{c}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: variant === "full" ? "10px" : 0 }}>
        {["PEPPOL", "Pagero", "ViDA ready", "VAT & GST"].map((n) => (
          <span key={n} style={{
            fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "4px",
            background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
            opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.35s",
          }}>{n}</span>
        ))}
      </div>
      {variant === "full" && (
        <div style={{ display: "flex", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
          {[
            { value: "15+",  label: "Countries" },
            { value: "VAT",  label: "& GST compliant" },
            { value: "Auto", label: "Archiving" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Invoice automation ───────────────────────────────────────────────────────
// Compact: pipeline stepper + 3 invoice rows
// Full:    pipeline stepper + 3 invoice rows + throughput stat
export function APAutoFlowCard({ active, exit, variant = "compact" }: CardProps) {
  const stages = [
    { label: "Received",  done: true,  delay: 0 },
    { label: "Matched",   done: true,  delay: 0.12 },
    { label: "Coded",     done: true,  delay: 0.24 },
    { label: "Approved",  done: false, delay: 0.36 },
  ];
  const allQueue = [
    { inv: "INV-5512", amount: "$4,200", supplier: "Dell Inc.",  state: "Approved", ok: true  as true | false | null },
    { inv: "INV-5513", amount: "$1,840", supplier: "Adobe Inc.", state: "Matching", ok: null  as true | false | null },
    { inv: "INV-5515", amount: "$3,100", supplier: "Staples",    state: "Coded",    ok: null  as true | false | null },
  ];
  const queue = variant === "compact" ? allQueue.slice(0, 3) : allQueue;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Invoice lifecycle" badge="Automated" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        {stages.map(({ label, done, delay }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "0 0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                background: done && active ? "#16a34a" : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: `background 0.3s ease ${delay}s`,
              }}>
                {done && <span style={{ fontSize: "10px", color: "white", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: "9px", color: "#888", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < 3 && (
              <div style={{
                flex: 1, height: "2px",
                background: done && active ? "#16a34a" : "#e5e7eb",
                margin: "0 4px 14px",
                transition: `background 0.3s ease ${delay + 0.06}s`,
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: variant === "full" ? "10px" : 0 }}>
        {queue.map(({ inv, amount, supplier, state, ok }, i) => (
          <div key={inv} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px",
            background: "#f8f9fa", borderRadius: "8px",
            opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.1}s`,
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#111", flex: "0 0 62px" }}>{inv}</span>
            <span style={{ fontSize: "11px", color: "#555", flex: 1 }}>{supplier}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111", flex: "0 0 46px", textAlign: "right" }}>{amount}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, flex: "0 0 60px", textAlign: "right", color: ok === true ? "#16a34a" : ok === false ? RED : "#f59e0b" }}>{state}</span>
          </div>
        ))}
      </div>
      {variant === "full" && (
        <div style={{ display: "flex", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
          {[
            { value: "96.3%", label: "Touchless rate" },
            { value: "1.4d",  label: "Avg cycle time" },
            { value: "0",     label: "Manual steps" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AI-assisted approvals (Medius Copilot) ──────────────────────────────────
// Compact: invoice context + 1 Q&A exchange
// Full:    invoice context + 2 Q&A exchanges + approve/review buttons
export function APApprovalCard({ active, exit, variant = "compact" }: CardProps) {
  const allExchanges = [
    {
      q: "Tell me about this supplier",
      a: "Dell Inc.: 47 invoices, avg. $3,850. No disputes ✓",
      delay: 0.1,
    },
    {
      q: "Is the amount correct?",
      a: "$4,200 matches PO-2241. Within budget ✓",
      delay: 0.5,
    },
  ];
  const exchanges = variant === "compact" ? allExchanges.slice(0, 1) : allExchanges;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Medius Copilot" badge="AI Assistant" />

      {/* Invoice context bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", borderRadius: "8px", padding: "6px 12px", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>INV-5512 · Dell Inc.</div>
          <div style={{ fontSize: "9px", color: "#aaa" }}>$4,200 · Net 30</div>
        </div>
        <div style={{ fontSize: "9px", fontWeight: 600, color: "#16a34a" }}>PO-2241 matched ✓</div>
      </div>

      {/* Copilot Q&A chat */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: variant === "full" ? "8px" : 0 }}>
        {exchanges.map(({ q, a, delay }) => (
          <div key={q} style={{ display: "flex", flexDirection: "column", gap: "4px", opacity: active ? 1 : 0, transition: `opacity 0.35s ease ${delay}s` }}>
            {/* Approver prompt chip */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: DARK, background: "#e3eef8", borderRadius: "100px", padding: "3px 10px", maxWidth: "85%" }}>
                {q}
              </span>
            </div>
            {/* Copilot answer bubble */}
            <div style={{ background: DARK, borderRadius: "4px 10px 10px 10px", padding: "6px 10px", maxWidth: "92%" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#ab9c6d", display: "block", marginBottom: "2px" }}>MEDIUS COPILOT</span>
              <span style={{ fontSize: "10px", color: "white", lineHeight: 1.35 }}>{a}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Human action buttons -- mirrors real Medius UI */}
      {variant === "full" && (
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, padding: "7px 4px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>
            ✓ Approve
          </div>
          <div style={{ flex: 1, padding: "7px 4px", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: RED }}>
            ✕ Reject
          </div>
          <div style={{ flex: 1, padding: "7px 4px", background: "white", border: "1px solid #bcd4ec", borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#2563eb" }}>
            ↺ Reroute
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Supplier conversations ───────────────────────────────────────────────────
// Compact: 2 email threads
// Full:    2 email threads + resolved footer
export function APSupplierCard({ active, exit, variant = "compact" }: CardProps) {
  const allEmails = [
    {
      from: "supplier",
      sender: "ap@acmecorp.com",
      subject: "Payment status: INV-4821",
      preview: "Hi, could you confirm when INV-4821 will be paid?",
      delay: 0,
    },
    {
      from: "ai",
      sender: "Medius AI",
      subject: "Re: Payment status: INV-4821",
      preview: "Payment scheduled Apr 5 via ACH. Status: Approved ✓",
      delay: 0.3,
    },
  ];
  const emails = allEmails;

  // Email icon SVG
  const EmailIcon = ({ color }: { color: string }) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="3" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M1 5l7 5 7-5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Supplier conversations" badge="Auto-handled" />

      {/* Email thread with connector line */}
      <div style={{ display: "flex", marginBottom: variant === "compact" ? "0" : "12px" }}>
        {/* Left: connector line + icons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "12px", paddingTop: "2px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            background: "#f0f0f0", border: "1.5px solid #e0e0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <EmailIcon color="#888" />
          </div>
          {/* Connector line */}
          <div style={{
            width: "2px", flex: 1, margin: "6px 0",
            background: "linear-gradient(to bottom, #e0e0e0, #2f4344)",
            opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
          }} />
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            background: DARK, border: `1.5px solid ${DARK}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.35s",
          }}>
            <EmailIcon color="#ab9c6d" />
          </div>
        </div>

        {/* Right: email cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          {emails.map(({ from, sender, subject, preview, delay }) => (
            <div key={subject + from} style={{
              background: from === "ai" ? DARK : "#f8f9fa",
              borderRadius: "10px", padding: variant === "compact" ? "8px 11px" : "11px 13px",
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: from === "ai" ? "#ab9c6d" : "#555" }}>
                  {sender}
                </span>
                <span style={{ fontSize: "8px", color: from === "ai" ? "rgba(255,255,255,0.3)" : "#ccc" }}>
                  {from === "ai" ? "Just now" : "2m ago"}
                </span>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: from === "ai" ? "white" : "#111", marginBottom: "3px" }}>
                {subject}
              </div>
              <div style={{ fontSize: "10px", color: from === "ai" ? "rgba(255,255,255,0.65)" : "#888", lineHeight: 1.4 }}>
                {preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {variant !== "compact" && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "7px",
          padding: "8px 12px", fontSize: "11px", fontWeight: 600, color: "#16a34a",
          opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.8s",
        }}>
          ✓ Resolved automatically · no AP team involvement
        </div>
      )}
    </div>
  );
}

// ─── Statement reconciliation ─────────────────────────────────────────────────
// Compact: 3 invoice lines + summary stats
// Full:    4 invoice lines + summary stats + action buttons
export function APReconCard({ active, exit, variant = "compact" }: CardProps) {
  const allLines = [
    { inv: "INV-5512", amount: "$4,200", status: "Matched",       ok: true,  delay: 0 },
    { inv: "INV-5514", amount: "$8,200", status: "Matched",       ok: true,  delay: 0.12 },
    { inv: "INV-5500", amount: "$3,100", status: "Not in ledger", ok: false, delay: 0.24 },
    { inv: "INV-5498", amount: "$1,840", status: "Matched",       ok: true,  delay: 0.36 },
  ];
  const lines = variant === "compact" ? allLines.slice(0, 3) : allLines;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Dell Inc. · Mar statement" badge="Live" />
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "10px" }}>
        {lines.map(({ inv, amount, status, ok, delay }) => (
          <div key={inv} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px",
            background: ok ? "#f8f9fa" : "#fff5f5", borderRadius: "8px",
            border: ok ? "none" : "1px solid #fecaca",
            opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#111", flex: "0 0 68px" }}>{inv}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111", flex: 1 }}>{amount}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: ok ? "#16a34a" : RED }}>{ok ? "✓" : "⚠"} {status}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: variant === "full" ? "10px" : 0 }}>
        <div style={{ flex: 1, textAlign: "center", padding: "8px", background: "#f0fdf4", borderRadius: "7px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#16a34a" }}>
            {variant === "compact" ? "2/3" : "3/4"}
          </div>
          <div style={{ fontSize: "9px", color: "#aaa" }}>Matched</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "8px", background: "#fff5f5", borderRadius: "7px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: RED }}>1</div>
          <div style={{ fontSize: "9px", color: "#aaa" }}>Discrepancy</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "8px", background: "#f8f9fa", borderRadius: "7px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>$3,100</div>
          <div style={{ fontSize: "9px", color: "#aaa" }}>Under review</div>
        </div>
      </div>
      {variant === "full" && (
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, padding: "8px", background: "#f0f0f0", borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#555" }}>
            Request credit note
          </div>
          <div style={{ flex: 1.5, padding: "8px", background: DARK, borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "white" }}>
            Escalate to supplier
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENTS CARDS
// ══════════════════════════════════════════════════════════════════════════════

// ─── PM-0: Payment run ────────────────────────────────────────────────────────
// Compact: stats summary + 4 supplier rows (no execute button)
// Full:    stats summary + 4 supplier rows + execute button
export function PMCard0({ active, exit, variant = "compact" }: CardProps) {
  const suppliers = [
    { name: "Dell Inc.",     amount: "$8,200", method: "ACH",          status: "Ready",   color: "#16a34a" },
    { name: "Staples",       amount: "$1,340", method: "Virtual Card", status: "Ready",   color: "#16a34a" },
    { name: "Iron Mountain", amount: "$4,750", method: "Wire",         status: "Pending", color: "#f59e0b" },
    { name: "Adobe Inc.",    amount: "$1,840", method: "ACH",          status: "Ready",   color: "#16a34a" },
  ];
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Payment Run" badge="Apr 3, 2025" />
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {[
          { label: "Ready to pay", value: "$16,130" },
          { label: "Suppliers",    value: "12" },
          { label: "On-time",      value: "100%" },
        ].map(({ label, value }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>{value}</div>
            <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: variant === "full" ? "12px" : 0 }}>
        {suppliers.map(({ name, amount, method, status, color }, i) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", gap: "8px",
            opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.1}s`,
          }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#111", flex: 1 }}>{name}</span>
            <span style={{ fontSize: "10px", color: "#888", flex: "0 0 80px" }}>{method}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111", flex: "0 0 48px", textAlign: "right" }}>{amount}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color, flex: "0 0 44px", textAlign: "right" }}>{status}</span>
          </div>
        ))}
      </div>
      {variant === "full" && (
        <div style={{
          background: DARK, borderRadius: "8px", padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.5s",
        }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>Execute payment run</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#ab9c6d" }}>$16,130</span>
        </div>
      )}
    </div>
  );
}

// ─── PM-1: Payment methods ────────────────────────────────────────────────────
// Compact: 4 payment methods + condensed stats
// Full:    5 payment methods + full stats
export function PMCard1({ active, exit, variant = "compact" }: CardProps) {
  const allMethods = [
    { name: "ACH / BACS",      desc: "Domestic bank transfer",  delay: 0 },
    { name: "SWIFT Wire",      desc: "International payments",  delay: 0.1 },
    { name: "Virtual Card",    desc: "Earn rebates on spend",   delay: 0.2 },
    { name: "SEPA Credit",     desc: "Eurozone transfers",      delay: 0.3 },
    { name: "Faster Payments", desc: "Same-day UK payments",    delay: 0.4 },
  ];
  const methods = variant === "compact" ? allMethods.slice(0, 4) : allMethods;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Payment Methods" badge="50+ supported" />
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "6px" : "9px", marginBottom: variant === "compact" ? "10px" : "14px" }}>
        {methods.map(({ name, desc, delay }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
              background: active ? "#16a34a" : "#e0e0e0",
              boxShadow: active ? "0 0 0 3px rgba(22,163,74,0.15)" : "none",
              transition: `background 0.3s ease ${delay}s, box-shadow 0.3s ease ${delay}s`,
            }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>{name}</span>
              <span style={{ fontSize: "10px", color: "#aaa", marginLeft: "8px" }}>{desc}</span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#16a34a", opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay + 0.2}s` }}>✓ Live</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: variant === "compact" ? "8px" : "10px", display: "flex" }}>
        {[
          { value: "50+",  label: "Payment rails" },
          { value: "180+", label: "Countries" },
          { value: "40+",  label: "Currencies" },
        ].map(({ value, label }) => (
          <div key={label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: DARK }}>{value}</div>
            <div style={{ fontSize: "9px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.4px", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PM-2: Cash flow visibility ───────────────────────────────────────────────
// Compact: bar chart + 2 upcoming rows
// Full:    bar chart + 3 upcoming rows
export function PMCard2({ active, exit, variant = "compact" }: CardProps) {
  const bars = [
    { label: "Jan", h: 62 }, { label: "Feb", h: 58 }, { label: "Mar", h: 71 },
    { label: "Apr", h: 66 }, { label: "May", h: 75 }, { label: "Jun", h: 79 },
  ];
  const allUpcoming = [
    { period: "Next 7 days",  amount: "$24,300",  invoices: 8 },
    { period: "Next 30 days", amount: "$91,750",  invoices: 34 },
    { period: "Next 90 days", amount: "$287,000", invoices: 112 },
  ];
  const upcoming = variant === "compact" ? allUpcoming.slice(0, 2) : allUpcoming;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Cash Flow Visibility" badge="Live" />
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "6px" }}>DPO trend: last 6 months</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "48px" }}>
          {bars.map(({ label, h }, i) => (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <div style={{
                width: "100%", borderRadius: "3px 3px 0 0",
                background: i === bars.length - 1 ? RED : DARK,
                height: active ? `${h * 0.48}px` : "0px",
                transition: `height 0.5s ease ${i * 0.08}s`,
              }} />
              <span style={{ fontSize: "8px", color: "#aaa" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {upcoming.map(({ period, amount, invoices }) => (
          <div key={period} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 10px", background: "#f8f9fa", borderRadius: "7px",
          }}>
            <span style={{ fontSize: "11px", color: "#555" }}>{period}</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{amount}</span>
              <span style={{ fontSize: "10px", color: "#aaa", marginLeft: "6px" }}>{invoices} invoices</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PM-3: Card fraud prevention ─────────────────────────────────────────────
// Compact: push notification (pending approval)
// Full:    push notification + resolved second notification
export function PMFraudPreventionCard({ active, exit, variant = "compact" }: CardProps) {
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Card Fraud Prevention" badge="Real-time" />

      {/* Push notification -- pending */}
      <div style={{
        background: "white", borderRadius: "14px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        overflow: "hidden", marginBottom: variant === "compact" ? "10px" : "14px",
        opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s",
      }}>
        {/* Notification header */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 12px 8px", borderBottom: "1px solid #f3f3f3",
        }}>
          <img src="/images/expensya-card.png" alt="" style={{ height: "32px", width: "auto" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#555", flex: 1 }}>Expense Card</span>
          <span style={{ fontSize: "9px", color: "#aaa" }}>now</span>
        </div>
        {/* Notification body */}
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>
            Unusual transaction detected
          </div>
          <div style={{ fontSize: "11px", color: "#555", marginBottom: "10px", lineHeight: 1.4 }}>
            <strong>Le Duplex Club, Paris</strong> is attempting to charge <strong>€247</strong> on card •••• 4429. Did you authorise this?
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: "#f5f5f5", borderRadius: "8px",
              fontSize: "11px", fontWeight: 700, color: "#555",
            }}>
              Yes, approve
            </div>
            <div style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: RED, borderRadius: "8px",
              fontSize: "11px", fontWeight: 700, color: "white",
            }}>
              No, block it
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── PM-4: Dispute resolution ─────────────────────────────────────────────────
// Compact: 2 disputed transactions + status
// Full:    3 disputes + resolution stats
export function PMDisputeCard({ active, exit, variant = "compact" }: CardProps) {
  const allDisputes = [
    { desc: "Software subscription renewal", employee: "Sarah K.", amount: "$149", status: "Investigating", statusColor: "#e07b00", step: 2 },
    { desc: "Hotel room upgrade charge",      employee: "James R.", amount: "$320", status: "Awaiting docs",  statusColor: "#e07b00", step: 1 },
    { desc: "Team lunch: duplicate charge",  employee: "Mike T.",  amount: "$89",  status: "Resolved",      statusColor: "#5a8a5a", step: 3 },
  ];
  const disputes = variant === "compact" ? allDisputes.slice(0, 2) : allDisputes;
  const steps = ["Flagged", "Docs requested", "Resolved"];

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Dispute Resolution" badge="3 open" />

      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "6px" : "8px", marginBottom: variant === "full" ? "14px" : 0 }}>
        {disputes.map(({ desc, employee, amount, status, statusColor, step }, i) => (
          <div key={desc} style={{
            background: "#f8f9fa", borderRadius: "8px",
            padding: variant === "compact" ? "7px 10px" : "9px 12px",
            opacity: active ? 1 : 0,
            transition: `opacity 0.3s ease ${i * 0.12}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#111", lineHeight: 1.3 }}>{desc}</div>
                <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{employee}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{amount}</div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: statusColor }}>{status}</div>
              </div>
            </div>
            {/* Mini step tracker */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {steps.map((s, si) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: si < steps.length - 1 ? 1 : "none" }}>
                  <div style={{
                    width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: si < step ? RED : si === step - 1 ? RED : "#e0e0e0",
                    transition: `background 0.3s ease ${i * 0.1 + si * 0.05}s`,
                  }}>
                    {si < step && <span style={{ fontSize: "8px", color: "white", fontWeight: 700 }}>✓</span>}
                  </div>
                  {si < steps.length - 1 && (
                    <div style={{ flex: 1, height: "2px", background: si < step - 1 ? RED : "#e0e0e0", margin: "0 2px" }} />
                  )}
                </div>
              ))}
              <span style={{ fontSize: "8px", color: "#aaa", marginLeft: "4px", whiteSpace: "nowrap" }}>{steps[step - 1]}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SPEND MANAGEMENT CARDS
// ══════════════════════════════════════════════════════════════════════════════

// ─── SM-0: Budget vs Actual ───────────────────────────────────────────────────
// Compact: 3 departments + alert
// Full:    4 departments + alert
export function SMCard0({ active, exit, variant = "compact" }: CardProps) {
  const allDepts = [
    { name: "Marketing",   budget: 120, actual: 103, pct: 86, over: false },
    { name: "Engineering", budget: 200, actual: 198, pct: 99, over: false },
    { name: "Operations",  budget: 80,  actual: 91,  pct: 114, over: true },
    { name: "Finance",     budget: 50,  actual: 38,  pct: 76, over: false },
  ];
  const depts = variant === "compact" ? allDepts.slice(0, 3) : allDepts;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Budget vs Actual: Q1 2025" />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
        {depts.map(({ name, budget, actual, pct, over }) => (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "11px", color: "#555" }}>{name}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: over ? RED : "#16a34a" }}>
                ${actual}k / ${budget}k
              </span>
            </div>
            <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: over ? RED : DARK,
                width: active ? `${Math.min(pct, 100)}%` : "0%",
                transition: "width 0.8s ease 0.1s",
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 12px", background: "#fff5f5", borderRadius: "8px", fontSize: "11px", color: RED, fontWeight: 600 }}>
        ⚠ Operations is 14% over budget -- approval required
      </div>
    </div>
  );
}

// ─── SM-1: Expense policy control ────────────────────────────────────────────
// Compact: alert + 3 detail rows + 2 action buttons
// Full:    alert + 4 detail rows + 2 action buttons
export function SMCard1({ active, exit, variant = "compact" }: CardProps) {
  const allRows = [
    { label: "Submitted by", value: "J. Thompson" },
    { label: "Category",     value: "Entertainment" },
    { label: "Limit",        value: "$150 / person" },
    { label: "Actual",       value: "$310 / person" },
  ];
  const rows = variant === "compact" ? allRows.slice(0, 3) : allRows;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Expense Policy Control" />
      <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px", padding: variant === "compact" ? "7px 12px" : "10px 12px", marginBottom: variant === "compact" ? "8px" : "11px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
          <span style={{ color: RED }}>⚠</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: RED }}>Policy Violation Detected</span>
        </div>
        <div style={{ fontSize: "11px", color: "#888" }}>Business dinner · $1,240 · exceeds $150 per-person limit</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "6px" : "8px", marginBottom: variant === "compact" ? "8px" : "11px" }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: "#888" }}>{label}</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flex: 1, padding: variant === "compact" ? "5px" : "7px", background: "#f0f0f0", borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#555" }}>
          Return to submitter
        </div>
        <div style={{ flex: 1.5, padding: variant === "compact" ? "5px" : "7px", background: DARK, borderRadius: "7px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "white" }}>
          Require justification
        </div>
      </div>
    </div>
  );
}

// ─── SM-2: Spend by category ──────────────────────────────────────────────────
// Compact: 4 category bars + totals footer
// Full:    5 category bars + totals footer
export function SMCard2({ active, exit, variant = "compact" }: CardProps) {
  const allCategories = [
    { name: "Software & SaaS",   amount: "$284k", pct: 92, color: DARK },
    { name: "Travel & Expenses", amount: "$143k", pct: 46, color: "#4a6567" },
    { name: "Professional Svcs", amount: "$98k",  pct: 32, color: "#6b8c8c" },
    { name: "Office & Supplies", amount: "$41k",  pct: 13, color: "#9ab0b0" },
    { name: "Other",             amount: "$34k",  pct: 11, color: "#c8d5d5" },
  ];
  const categories = variant === "compact" ? allCategories.slice(0, 4) : allCategories;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Spend by Category: YTD" badge="Live" />
      <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "12px" }}>
        {categories.map(({ name, amount, pct, color }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#555", flex: "0 0 130px" }}>{name}</span>
            <div style={{ flex: 1, height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%", background: color, borderRadius: "3px",
                width: active ? `${pct}%` : "0%", transition: "width 0.75s ease 0.1s",
              }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111", minWidth: "44px", textAlign: "right" }}>{amount}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: DARK }}>$600k</div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>Total YTD spend</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a" }}>-12%</div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>vs last year</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPENSES CARDS
// ══════════════════════════════════════════════════════════════════════════════

// ─── EX-0: Receipt capture ────────────────────────────────────────────────────
// Compact: 3 receipts + summary footer
// Full:    4 receipts + summary footer
export function EXCard0({ active, exit, variant = "compact" }: CardProps) {
  const allReceipts = [
    { merchant: "Marriott London", amount: "$320.00", category: "Hotel",     delay: 0 },
    { merchant: "British Airways", amount: "$540.00", category: "Travel",    delay: 0.15 },
    { merchant: "Uber Business",   amount: "$18.40",  category: "Transport", delay: 0.3 },
    { merchant: "The Ivy Chelsea", amount: "$124.00", category: "Meals",     delay: 0.45 },
  ];
  const receipts = variant === "compact" ? allReceipts.slice(0, 3) : allReceipts;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Receipt Capture" badge="AI-powered" />
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "5px" : "8px", marginBottom: variant === "compact" ? "6px" : "10px" }}>
        {receipts.map(({ merchant, amount, category, delay }) => (
          <div key={merchant} style={{ display: "flex", alignItems: "center", gap: "10px", padding: variant === "compact" ? "3px 10px" : "7px 10px", background: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{
              width: variant === "compact" ? "28px" : "32px",
              height: variant === "compact" ? "28px" : "32px",
              borderRadius: "6px", flexShrink: 0,
              background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "8px", fontWeight: 800, color: "white" }}>{category.slice(0, 3).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>{merchant}</div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>{category}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>{amount}</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#16a34a", opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s` }}>✓ Captured</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "7px", padding: variant === "compact" ? "4px 12px" : "8px 12px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>
          {variant === "compact" ? "3 receipts" : "4 receipts"} auto-categorised
        </span>
        <span style={{ fontSize: "10px", color: "#aaa" }}>
          {variant === "compact" ? "$878.40" : "$1,002.40"} total
        </span>
      </div>
    </div>
  );
}

// ─── EX-1: Policy check ───────────────────────────────────────────────────────
// Compact: alert + 4 checks (no action button)
// Full:    alert + 5 checks + escalation button
export function EXCard1({ active, exit, variant = "compact" }: CardProps) {
  const allChecks = [
    { label: "Receipt attached",         ok: true,  delay: 0 },
    { label: "Within daily hotel limit", ok: true,  delay: 0.12 },
    { label: "Meal within $75 limit",    ok: true,  delay: 0.24 },
    { label: "Airfare: economy class",  ok: true,  delay: 0.36 },
    { label: "Manager pre-approval",     ok: false, delay: 0.48 },
  ];
  const checks = variant === "compact" ? allChecks.slice(0, 4) : allChecks;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Policy Check" />
      <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
          <span style={{ color: RED }}>⚠</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: RED }}>1 item needs attention</span>
        </div>
        <div style={{ fontSize: "11px", color: "#888" }}>Business travel · J. Thompson · $1,002.40</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: variant === "full" ? "12px" : 0 }}>
        {checks.map(({ label, ok, delay }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#555" }}>{label}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: ok ? "#16a34a" : RED, opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s` }}>
              {ok ? "✓ Pass" : "⚠ Required"}
            </span>
          </div>
        ))}
      </div>
      {variant === "full" && (
        <div style={{ background: DARK, borderRadius: "7px", padding: "8px 12px", textAlign: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "white" }}>Approval request sent to manager</span>
        </div>
      )}
    </div>
  );
}

// ─── EX-2: Reimbursements ────────────────────────────────────────────────────
// Compact: stats summary + 3 employee rows
// Full:    stats summary + 4 employee rows
export function EXCard2({ active, exit, variant = "compact" }: CardProps) {
  const allReports = [
    { name: "J. Thompson", amount: "$1,002.40", status: "Paid",      color: "#16a34a", days: "Today" },
    { name: "S. Martinez", amount: "$432.00",   status: "Approved",  color: "#6b8c8c", days: "Tomorrow" },
    { name: "R. Patel",    amount: "$218.75",   status: "In review", color: "#f59e0b", days: "2 days" },
    { name: "L. Chen",     amount: "$89.50",    status: "Submitted", color: "#aaa",    days: "3 days" },
  ];
  const reports = variant === "compact" ? allReports.slice(0, 3) : allReports;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Reimbursements" badge="Live" />
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {[
          { label: "Avg. payout", value: "2 days" },
          { label: "This month",  value: "$8,340" },
          { label: "On-time",     value: "100%" },
        ].map(({ label, value }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: DARK }}>{value}</div>
            <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {reports.map(({ name, amount, status, color, days }, i) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px", opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.1}s` }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "white" }}>{name[0]}</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#111", flex: 1 }}>{name}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>{amount}</span>
            <div style={{ textAlign: "right", minWidth: "60px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color }}>{status}</div>
              <div style={{ fontSize: "9px", color: "#aaa" }}>{days}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SM Intelligent Intake ────────────────────────────────────────────────────
// Compact (560px): 2-email thread (supplier request → AI confirmation) + resolved footer
// Full (360px):    same + AI extraction pills between emails
export function SMIntelligentIntakeCard({ active, exit, variant = "compact" }: CardProps) {
  const extractedFields = [
    { label: "Account",    value: "••••4321" },
    { label: "Sort code",  value: "12-34-56" },
    { label: "Bank",       value: "Barclays" },
  ];

  const EmailIcon = ({ color }: { color: string }) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="3" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M1 5l7 5 7-5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Intelligent Intake" badge="Auto-updated" />

      <div style={{ display: "flex" }}>
        {/* Left: icon column + connector */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "10px", paddingTop: "2px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
            background: "#f0f0f0", border: "1.5px solid #e0e0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <EmailIcon color="#888" />
          </div>
          <div style={{
            width: "2px", flex: 1, margin: "5px 0",
            background: "linear-gradient(to bottom, #e0e0e0, #2f4344)",
            opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
          }} />
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
            background: DARK, border: `1.5px solid ${DARK}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.55s",
          }}>
            <EmailIcon color="#ab9c6d" />
          </div>
        </div>

        {/* Right: emails + optional extraction */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Supplier email */}
          <div style={{
            background: "#f8f9fa", borderRadius: "9px", padding: "8px 10px",
            opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#555" }}>billing@acmesupplies.com</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "2px",
                fontSize: "9px", fontWeight: 600, color: "#16a34a",
                background: "#f0fdf4", borderRadius: "100px", padding: "1px 5px",
                opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.4s",
              }}>
                <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 1.9.7-4L2.2 5.2l4-.6L8 1z" fill="#16a34a"/>
                </svg>
                Verified sender
              </span>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", marginBottom: "2px" }}>
              Bank detail update request
            </div>
            <div style={{ fontSize: "10px", color: "#888" }}>
              Please update our bank account: 12-34-56 / 87654321, Barclays.
            </div>
          </div>

          {/* Extraction row -- full only */}
          {variant === "full" && (
            <div style={{
              background: "#f0f4ff", borderRadius: "7px", padding: "6px 9px",
              opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.3s",
            }}>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                AI-extracted fields
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {extractedFields.map(({ label, value }, i) => (
                  <div key={label} style={{
                    fontSize: "10px", background: "white", borderRadius: "5px",
                    padding: "2px 7px", color: DARK,
                    opacity: active ? 1 : 0, transition: `opacity 0.2s ease ${0.35 + i * 0.08}s`,
                  }}>
                    <span style={{ color: "#aaa" }}>{label} </span>
                    <span style={{ fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI confirmation email */}
          <div style={{
            background: DARK, borderRadius: "9px", padding: "8px 10px",
            opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#ab9c6d" }}>Medius AI</span>
              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>Just now</span>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "white", marginBottom: "2px" }}>
              Re: Bank detail update request
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>
              Done: sort code 12-34-56, Acc. ••••4321 updated from today ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AP Supplier Onboarding ───────────────────────────────────────────────────
// Compact (560px): supplier tile + 3-step progress + 4 validation checks
// Full (360px):    same + bottom stat tiles
export function APSupplierOnboardingCard({ active, exit, variant = "compact" }: CardProps) {
  const steps = [
    { label: "Capture",  done: true },
    { label: "Validate", done: true },
    { label: "Approve",  done: true },
  ];

  const allChecks = [
    { label: "Supplier profile",      detail: "Forms, docs & emails",    ok: true,  delay: 0.05 },
    { label: "Bank details",          detail: "Account validated",        ok: true,  delay: 0.2  },
    { label: "Registry check",        detail: "Company number matched",   ok: true,  delay: 0.35 },
    { label: "Compliance sign-off",   detail: "Rules & controls passed",  ok: true,  delay: 0.5  },
  ];
  const checks = variant === "compact" ? allChecks.slice(0, 3) : allChecks;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Supplier Onboarding" badge="Automated" />

      {/* Supplier tile */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "#f8f9fa", borderRadius: "8px",
        padding: variant === "compact" ? "5px 12px" : "10px 12px",
        marginBottom: variant === "compact" ? "6px" : "12px",
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
          background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "white" }}>AC</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>Acme Supplies Ltd.</div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>New supplier · United Kingdom</div>
        </div>
        <div style={{
          fontSize: "10px", fontWeight: 700, color: "#16a34a",
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "100px", padding: "2px 8px", flexShrink: 0,
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.55s",
        }}>
          Onboarded
        </div>
      </div>

      {/* 3-step progress bar -- full variant only */}
      {variant !== "compact" && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
          {steps.map(({ label, done }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: done && active ? DARK : "#e5e7eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: `background 0.3s ease ${i * 0.15 + 0.1}s`,
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "10px", color: "white", fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ fontSize: "9px", color: done && active ? DARK : "#aaa", fontWeight: 600, whiteSpace: "nowrap", transition: `color 0.3s ease ${i * 0.15 + 0.1}s` }}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: "2px", borderRadius: "1px",
                  background: active ? DARK : "#e5e7eb",
                  margin: "0 6px", marginBottom: "14px",
                  transition: `background 0.4s ease ${i * 0.15 + 0.2}s`,
                }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Validation checks */}
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "4px" : "7px", marginBottom: variant === "full" ? "12px" : 0 }}>
        {checks.map(({ label, detail, ok, delay }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: variant === "compact" ? "5px 10px" : "6px 10px",
            background: "#f8f9fa", borderRadius: "7px",
          }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{label}</div>
              {variant !== "compact" && <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{detail}</div>}
            </div>
            <span style={{
              fontSize: "10px", fontWeight: 700, color: ok ? "#16a34a" : RED,
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>
              {ok ? "✓ Pass" : "✗ Fail"}
            </span>
          </div>
        ))}
      </div>

      {/* Stat tiles -- full only */}
      {variant === "full" && (
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { value: "2.4 hrs", label: "Avg. onboarding" },
            { value: "100%",    label: "Compliant records" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AP Analytics ─────────────────────────────────────────────────────────────
// Compact: 3 KPIs + processing breakdown bars
// Full:    3 KPIs + processing breakdown bars + Fire Station callout
export function APAnalyticsCard({ active, exit, variant = "compact" }: CardProps) {
  const kpis = [
    { value: "94.3%", label: "Touchless rate" },
    { value: "1.6d",  label: "Avg cycle time" },
    { value: "$2.4M", label: "Spend MTD" },
  ];
  const bars = [
    { label: "Straight-through", pct: 71, color: "#16a34a" },
    { label: "Deviations",        pct: 18, color: "#f59e0b" },
    { label: "Manual review",     pct: 11, color: RED },
  ];

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Medius Analytics" badge="Live" />

      {/* KPI row */}
      <div style={{ display: "flex", gap: "7px", marginBottom: variant === "compact" ? "10px" : "14px" }}>
        {kpis.map(({ value, label }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: variant === "compact" ? "7px 4px" : "9px 4px" }}>
            <div style={{ fontSize: variant === "compact" ? "14px" : "15px", fontWeight: 700, color: DARK }}>{value}</div>
            <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Processing breakdown */}
      <div style={{ marginBottom: variant === "full" ? "12px" : 0 }}>
        {variant === "full" && (
          <div style={{ fontSize: "9px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Invoice processing: last 30 days
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "6px" : "8px" }}>
          {bars.map(({ label, pct, color }, i) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "10px", color: "#555" }}>{label}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color }}>{pct}%</span>
              </div>
              <div style={{ height: "5px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: color, borderRadius: "3px",
                  width: active ? `${pct}%` : "0%",
                  transition: `width 0.7s ease ${0.1 + i * 0.15}s`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fire Station callout -- full only */}
      {variant === "full" && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px",
          padding: "8px 12px",
          opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.6s",
        }}>
          <span style={{ fontSize: "16px", lineHeight: 1 }}>🚒</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: RED }}>Fire Station report</div>
            <div style={{ fontSize: "9px", color: "#888", marginTop: "1px" }}>3 risk factors flagged across 2 transactions this week</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SM Sourcing ──────────────────────────────────────────────────────────────
// Compact: RFX event header + 3 scored supplier rows
// Full:    same + savings callout
export function SMSourcingCard({ active, exit, variant = "compact" }: CardProps) {
  const suppliers = [
    { name: "Dell Technologies", score: 94, rank: 1, delay: 0.1  },
    { name: "Insight Direct",    score: 81, rank: 2, delay: 0.25 },
    { name: "CDW Corporation",   score: 67, rank: 3, delay: 0.4  },
  ];

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Medius Sourcing" badge="RFX Active" />

      {/* Event row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#f8f9fa", borderRadius: "8px", padding: "8px 12px", marginBottom: "10px",
      }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>Q3 IT Equipment: Round 2 of 2</div>
          <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>3 suppliers · Responses scored</div>
        </div>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#2563eb", background: "#e3eef8", borderRadius: "100px", padding: "2px 8px" }}>
          Scoring
        </span>
      </div>

      {/* Supplier score rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: variant === "full" ? "10px" : 0 }}>
        {suppliers.map(({ name, score, rank, delay }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
              background: rank === 1 ? DARK : "#e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "9px", fontWeight: 700, color: rank === 1 ? "white" : "#888",
              transition: `background 0.3s ease ${delay}s`,
            }}>
              {rank}
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#111", flex: 1 }}>{name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "60px", height: "5px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "3px",
                  background: rank === 1 ? DARK : rank === 2 ? "#6b8c8c" : "#aaa",
                  width: active ? `${score}%` : "0%",
                  transition: `width 0.7s ease ${delay}s`,
                }} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, color: rank === 1 ? DARK : "#888", width: "28px" }}>{score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Savings callout -- full only */}
      {variant === "full" && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px",
          opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.6s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>Est. savings vs. current contract</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a" }}>$84k</span>
        </div>
      )}
    </div>
  );
}

// ─── SM Contract Management ───────────────────────────────────────────────────
// Compact: 3 contract rows + expiry alert
// Full:    4 contract rows + expiry alert + stat tiles
export function SMContractCard({ active, exit, variant = "compact" }: CardProps) {
  const allContracts = [
    { name: "Microsoft EA",     value: "$240k/yr", status: "Renews in 14d", color: "#f59e0b", ok: false, delay: 0.05 },
    { name: "Dell Hardware",    value: "$84k/yr",  status: "Active",        color: "#16a34a", ok: true,  delay: 0.15 },
    { name: "AWS Services",     value: "$136k/yr", status: "Active",        color: "#16a34a", ok: true,  delay: 0.25 },
    { name: "IBM Support",      value: "$52k/yr",  status: "Expired",       color: RED,       ok: false, delay: 0.35 },
  ];
  const contracts = variant === "compact" ? allContracts.slice(0, 3) : allContracts;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Contract Management" badge="47 Active" />

      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "5px" : "6px", marginBottom: variant === "compact" ? "8px" : "10px" }}>
        {contracts.map(({ name, value, status, color, delay }) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: variant === "compact" ? "5px 10px" : "7px 10px", background: "#f8f9fa", borderRadius: "7px",
          }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{name}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{value}</div>
            </div>
            <span style={{
              fontSize: "10px", fontWeight: 600, color,
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Renewal alert */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "7px",
        padding: variant === "compact" ? "4px 10px" : "7px 10px", fontSize: "11px", fontWeight: 600, color: "#92400e",
        opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.45s",
        marginBottom: variant === "full" ? "10px" : 0,
      }}>
        ⏰ Microsoft EA renewal in 14 days -- action required
      </div>

      {/* Stat tiles -- full only */}
      {variant === "full" && (
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { value: "52%", label: "Less search time" },
            { value: "39%", label: "Fewer lapsed" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SM Procurement ───────────────────────────────────────────────────────────
// Compact: requisition tile + 3 approval steps
// Full:    requisition tile + 4 steps + spend tiles
export function SMProcurementCard({ active, exit, variant = "compact" }: CardProps) {
  const allSteps = [
    { label: "Budget check",       detail: "IT Equipment · $12,450",  ok: true,  delay: 0.1  },
    { label: "Policy check",       detail: "Approved supplier · ✓",   ok: true,  delay: 0.25 },
    { label: "Manager approval",   detail: "J. Chen · Approved",      ok: true,  delay: 0.4  },
    { label: "PO raised",          detail: "PO-8821 sent to Dell",    ok: true,  delay: 0.55 },
  ];
  const steps = variant === "compact" ? allSteps.slice(0, 3) : allSteps;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Procurement" badge="PO Raised" />

      {/* Requisition tile */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "#f8f9fa", borderRadius: "8px",
        padding: variant === "compact" ? "5px 12px" : "8px 12px",
        marginBottom: variant === "compact" ? "6px" : "10px",
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "7px", flexShrink: 0,
          background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="12" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
            <path d="M5 5h6M5 8h6M5 11h4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>IT Equipment: 4 items</div>
          <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>Req-4421 · $12,450 · Dell Technologies</div>
        </div>
      </div>

      {/* Approval steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "4px" : "6px", marginBottom: variant === "full" ? "10px" : 0 }}>
        {steps.map(({ label, detail, ok, delay }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: variant === "compact" ? "5px 10px" : "6px 10px", background: "#f8f9fa", borderRadius: "7px",
          }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{label}</div>
              {variant !== "compact" && <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>{detail}</div>}
            </div>
            <span style={{
              fontSize: "10px", fontWeight: 700, color: ok ? "#16a34a" : RED,
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>
              {ok ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      {/* Spend tiles -- full only */}
      {variant === "full" && (
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { value: "100%", label: "Policy compliant" },
            { value: "0",    label: "Maverick POs" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SM Contract Intake ───────────────────────────────────────────────────────
// Compact: document tile + 3 AI-extracted fields + classified badge
// Full:    document tile + 4 fields + classified badge + stat tiles
export function SMContractIntakeCard({ active, exit, variant = "compact" }: CardProps) {
  const allFields = [
    { label: "Parties",       value: "Medius · Microsoft Corp",   delay: 0.1  },
    { label: "Value",         value: "$240,000 / yr",              delay: 0.2  },
    { label: "Term",          value: "3 yrs · ends Dec 2026",      delay: 0.3  },
    { label: "Renewal notice", value: "90 days required",          delay: 0.4  },
  ];
  const fields = variant === "compact" ? allFields.slice(0, 3) : allFields;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Contract Intake" badge="AI-extracted" />

      {/* Document tile */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "#f8f9fa", borderRadius: "8px",
        padding: variant === "compact" ? "5px 12px" : "9px 12px",
        marginBottom: variant === "compact" ? "8px" : "12px",
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
          background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="12" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
            <path d="M5 5h6M5 8h6M5 11h3" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>Microsoft_EA_2024.pdf</div>
          <div style={{ fontSize: "9px", color: "#aaa", marginTop: "1px" }}>Received via email · 2.4 MB</div>
        </div>
        <div style={{
          fontSize: "9px", fontWeight: 700, color: "#16a34a",
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "100px", padding: "2px 7px", flexShrink: 0,
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.05s",
        }}>
          ✓ Parsed
        </div>
      </div>

      {/* AI-extracted fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "5px" : "7px", marginBottom: variant === "compact" ? "8px" : "12px" }}>
        {fields.map(({ label, value, delay }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: variant === "compact" ? "4px 10px" : "6px 10px",
            background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
          }}>
            <span style={{ fontSize: "10px", color: "#888" }}>{label}</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#111" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Classified + stored badge */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "7px",
        padding: variant === "compact" ? "5px 12px" : "7px 12px",
        fontSize: "11px", fontWeight: 600, color: "#16a34a",
        opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.5s",
        marginBottom: variant === "full" ? "10px" : 0,
      }}>
        ✓ Classified · stored in repository · renewal alert set
      </div>

      {/* Stat tiles -- full only */}
      {variant === "full" && (
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { value: "94%", label: "Extraction accuracy" },
            { value: "0",   label: "Manual data entry" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8f9fa", borderRadius: "8px", padding: "8px 4px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: DARK }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AP Capabilities metadata ──────────────────────────────────────────────────
export const AP_CAPABILITIES = [
  { id: "invoice-capture",          label: "Invoice capture",          title: "No invoice left behind.",                shortDescription: "Every format, every channel -- captured and digitised automatically, with zero manual keying.",                                              url: "https://www.medius.com/solutions/medius-accounts-payable-automation/invoice-capture/" },
  { id: "invoice-automation",       label: "Invoice automation",       title: "From inbox to approved, automatically.", shortDescription: "Matching, coding, and routing handled end-to-end so your team only touches genuine exceptions.",                                         url: "https://www.medius.com/solutions/medius-accounts-payable-automation/invoice-automation/" },
  { id: "ai-approvals",             label: "AI-assisted approvals",    title: "Smarter approvals, faster decisions.",   shortDescription: "AI recommends the right action on every invoice so approvers act in seconds, not days.",                                                url: "https://www.medius.com/solutions/medius-copilot/" },
  { id: "fraud-risk",               label: "Fraud & risk detection",   title: "Stop fraud before it costs you.",        shortDescription: "Real-time anomaly detection flags suspicious invoices before a single payment leaves your account.",                                    url: "https://www.medius.com/solutions/fraud-risk-detection/" },
  { id: "straight-through-payments",label: "Payment automation",       title: "Approved invoices pay themselves.",      shortDescription: "Once approved, invoices flow directly to payment -- no manual runs, no missed due dates.",                                              url: "https://www.medius.com/solutions/medius-payments/" },
  { id: "invoicing-compliance",      label: "e-Invoicing & compliance",  title: "Comply globally, automatically.",        shortDescription: "Stay ahead of e-invoicing mandates, VAT rules, and archiving requirements across 15+ countries -- handled by Medius, not your team.",    url: "https://www.medius.com/solutions/medius-accounts-payable-automation/compliance/" },
  { id: "supplier-conversations",   label: "Supplier conversations",   title: "Handle supplier queries at scale.",      shortDescription: "AI answers routine supplier questions automatically -- invoice status, payment dates, disputes -- 24/7.",                                url: "https://www.medius.com/solutions/supplier-conversations/" },
  { id: "statement-reconciliation", label: "Statement reconciliation", title: "Reconcile in minutes, not days.",        shortDescription: "AI matches every supplier statement against your ledger and surfaces every discrepancy instantly.",                                    url: "https://www.medius.com/solutions/medius-accounts-payable-automation/statement-reconciliation/" },
  { id: "erp-integrations",         label: "ERP integrations",         title: "Your ERP, connected in days.",           shortDescription: "50+ pre-built connectors to SAP, Oracle, Dynamics, NetSuite and more -- maintained by Medius, not you.",                              url: "https://www.medius.com/solutions/medius-connect/" },
  { id: "analytics",                label: "Analytics",                title: "From reactive to predictive.",           shortDescription: "Real-time dashboards surface touchless rates, bottlenecks, and cash flow insights so your team acts on facts, not gut feel.",            url: "https://www.medius.com/solutions/medius-analytics/" },
];

// ─── Card component per AP capability (index matches AP_CAPABILITIES) ──────────
export const AP_CAPABILITY_CARDS: React.ComponentType<CardProps>[] = [
  APCard0,          // 0 -- Invoice capture
  APAutoFlowCard,   // 1 -- Invoice automation
  APApprovalCard,   // 2 -- AI-assisted approvals
  APCard2,          // 3 -- Fraud & risk detection
  PMCard0,          // 4 -- Payment automation
  APCard3,          // 5 -- e-Invoicing
  APSupplierCard,   // 6 -- Supplier conversations
  APReconCard,      // 7 -- Statement reconciliation
  APCard1,          // 8 -- ERP integrations
  APAnalyticsCard,  // 9 -- Analytics
];

// ─── Spend Management capabilities metadata ───────────────────────────────────
export const SM_CAPABILITIES = [
  { id: "sourcing",             label: "Sourcing",             title: "Win better deals, faster.",             shortDescription: "Run RFX events, quick quotes, and eAuctions with automated supplier scoring -- cut sourcing cycles by 17% and deliver 1.9× greater savings.",   url: "https://www.medius.com/solutions/medius-sourcing/" },
  { id: "contract-management", label: "Contract Management",   title: "Every contract, always in control.",     shortDescription: "Centralise contracts, automate renewal alerts, and cut lapsed agreements by 39% -- so you never miss a deadline or a renegotiation window.",   url: "https://www.medius.com/solutions/medius-contract-management/" },
  { id: "supplier-onboarding", label: "Supplier Onboarding",   title: "Ready to trade from day one.",           shortDescription: "Suppliers self-serve their own data through guided forms. Registry checks, bank validation, and compliance rules run automatically.",            url: "https://www.medius.com/solutions/supplier-onboarding/" },
  { id: "procurement",         label: "Procurement",           title: "Spend that stays on policy.",           shortDescription: "A consumer-style buying experience with hard budget controls, catalogue punchouts, and automatic PO matching -- maverick spend eliminated.",    url: "https://www.medius.com/solutions/medius-procurement-solutions/" },
];

// ─── Card component per SM capability (index matches SM_CAPABILITIES) ──────────
export const SM_CAPABILITY_CARDS: React.ComponentType<CardProps>[] = [
  SMSourcingCard,          // 0 -- Sourcing
  SMContractCard,          // 1 -- Contract Management
  APSupplierOnboardingCard,// 2 -- Supplier Onboarding
  SMProcurementCard,       // 3 -- Procurement
];

// ─── Card sets for Spend / Expenses carousels ────────────────────────────────
export const TAB_CARDS: React.ComponentType<CardProps>[][] = [
  [SMCard0, SMCard1, SMCard2],
  [EXCard0, EXCard1, EXCard2],
];

// ─── Expense capabilities metadata ────────────────────────────────────────────
export const EX_CAPABILITIES = [
  {
    id: "expense-management",
    label: "Expense Management",
    title: "Automated expense processing, start to finish.",
    shortDescription: "From receipt capture to reimbursement, Medius enforces policy automatically and gets employees paid faster -- without manual review.",
    url: "https://www.medius.com/solutions/expense-management/",
  },
  {
    id: "expense-cards",
    label: "Expense Cards",
    title: "Smart cards with built-in spend controls.",
    shortDescription: "Issue virtual and physical cards with pre-approved limits and categories. Spend is captured and reconciled automatically -- no expense reports required.",
    url: "https://www.medius.com/solutions/",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MEDIUS AGENTS -- Six purpose-built AI agent cards
// ═══════════════════════════════════════════════════════════════════════════════

const MOSS  = "#84985c";
const SAND  = "#ab9c6d";
const AGENT_BADGE_BG   = "rgba(47,67,68,0.07)";
const AGENT_BADGE_TEXT = DARK;

// Shared agent card label pill
function AgentLabel({ name }: { name: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 9px", borderRadius: "9999px",
      background: AGENT_BADGE_BG, marginBottom: "14px",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: MOSS, flexShrink: 0 }} />
      <span style={{ fontSize: "10px", fontWeight: 700, color: AGENT_BADGE_TEXT, letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {name}
      </span>
    </div>
  );
}

// ─── Agent 1: Invoice Capture Agent ──────────────────────────────────────────
export function AgentCaptureCard({ active, exit, variant = "compact" }: CardProps) {
  const formats = [
    { abbr: "PDF", type: "PDF invoice",      source: "Email attachment",   delay: 0    },
    { abbr: "EDI", type: "EDI 810",           source: "Supplier portal",    delay: 0.12 },
    { abbr: "IMG", type: "Paper / scanned",   source: "OCR extracted",      delay: 0.24 },
    { abbr: "XML", type: "XML / UBL",         source: "e-Invoice network",  delay: 0.36 },
  ];

  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Invoice Capture Agent" />
        <CardHeader title="Any format, zero exceptions" badge="100% touchless" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
          {formats.map(({ abbr, type, source, delay }) => (
            <div key={abbr} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "6px 8px", background: "#f8f9fa", borderRadius: "7px",
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
            }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "6px", flexShrink: 0, background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "8px", fontWeight: 800, color: "white" }}>{abbr}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{type}</div>
                <div style={{ fontSize: "9.5px", color: "#aaa" }}>{source}</div>
              </div>
              <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>✓</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visible = formats;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Invoice Capture Agent" />
      <CardHeader title="Any format, zero exceptions" badge="100% touchless" />

      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {visible.map(({ abbr, type, source, delay }) => (
          <div key={abbr} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "7px 10px", background: "#f8f9fa", borderRadius: "8px",
            opacity: active ? 1 : 0,
            transition: `opacity 0.3s ease ${delay}s`,
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "7px", flexShrink: 0,
              background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "8px", fontWeight: 800, color: "white" }}>{abbr}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#111" }}>{type}</div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>{source}</div>
            </div>
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 700 }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent 2: Invoice Coding Agent ───────────────────────────────────────────
export function AgentCodingCard({ active, exit, variant = "compact" }: CardProps) {
  const lines = [
    { desc: "Office equipment: desks × 4",  gl: "7210 · Fixed Assets",    cc: "CC-101",  amt: "€2,800" },
    { desc: "Delivery & installation",        gl: "7350 · Services",         cc: "CC-101",  amt: "€620"  },
    { desc: "Extended warranty (2yr)",        gl: "7510 · Prepaid Expenses", cc: "CC-101",  amt: "€900"  },
  ];
  const visible = variant === "compact" ? lines.slice(0, 2) : lines;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Invoice Coding Agent" />
      <CardHeader title="Auto GL coding" badge="96%+ touchless" />

      <div style={{ marginBottom: variant === "compact" ? "7px" : "10px", padding: "7px 10px", background: "#f0f3f2", borderRadius: "7px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#777" }}>Apex Office Supplies · INV-2024-0891</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>€4,320</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "5px" : "6px" }}>
        {visible.map(({ desc, gl, cc, amt }, i) => (
          <div key={desc} style={{
            padding: variant === "compact" ? "6px 10px" : "8px 10px", background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0,
            transition: `opacity 0.28s ease ${i * 0.15}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{desc}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{amt}</span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>{gl}</span>
              <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(171,156,109,0.12)", color: SAND, fontWeight: 600 }}>{cc}</span>
            </div>
          </div>
        ))}
      </div>

      {variant === "full" && (
        <div style={{
          marginTop: "10px", padding: "7px 10px",
          background: "rgba(132,152,92,0.08)", borderRadius: "7px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.55s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: MOSS }}>✓ Coded and routed for approval</span>
          <span style={{ fontSize: "10px", color: "#aaa" }}>Learned after 2 invoices</span>
        </div>
      )}
    </div>
  );
}

// ─── Agent 3: PO Connect Agent ────────────────────────────────────────────────
export function AgentPOConnectCard({ active, exit, variant = "compact" }: CardProps) {
  const invoices = [
    { num: "FA246532111", lines: 34, total: 34, delay: 0    },
    { num: "FA246532112", lines: 5,  total: 5,  delay: 0.10 },
    { num: "FA246532113", lines: 26, total: 26, delay: 0.20 },
  ];

  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="PO Connect Agent" />
        <CardHeader title="Invoice-to-PO line matching" badge="95% connected" />
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 16px auto", gap: "6px", padding: "0 6px", marginBottom: "6px" }}>
          {["Invoice number", "", "Lines connected"].map((h, i) => (
            <div key={i} style={{ fontSize: "9px", fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.4px", textAlign: i === 2 ? "right" : "left" }}>{h}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {invoices.map(({ num, lines, total, delay }) => (
            <div key={num} style={{ display: "grid", gridTemplateColumns: "1fr 16px auto", gap: "6px", alignItems: "center", padding: "7px 8px", borderRadius: "7px", background: "#f8f9fa", opacity: active ? 1 : 0, transition: `opacity 0.25s ease ${delay}s` }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{num}</div>
              <div style={{ fontSize: "11px", color: RED }}>⚡</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: MOSS, textAlign: "right" }}>{lines} / {total} lines</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visible = invoices;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="PO Connect Agent" />
      <CardHeader title="Invoice-to-PO line matching" badge="95% connected" />

      {/* Impact metrics */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "6px", marginBottom: "12px",
        opacity: active ? 1 : 0, transition: "opacity 0.25s ease",
      }}>
        {[
          { value: "245",   label: "Invoices",    sub: "Last 7 days",   hi: false },
          { value: "95%",   label: "Connected",   sub: "+13% ↑",        hi: true  },
          { value: "1 hr",  label: "Saved / day", sub: "Est. time",     hi: false },
        ].map(({ value, label, sub, hi }) => (
          <div key={label} style={{
            padding: "7px 6px", textAlign: "center",
            background: hi ? "rgba(132,152,92,0.08)" : "#f8f9fa", borderRadius: "8px",
            border: hi ? "1px solid rgba(132,152,92,0.2)" : "1px solid transparent",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: hi ? MOSS : DARK }}>{value}</div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#888", marginTop: "1px" }}>{label}</div>
            <div style={{ fontSize: "9px", color: hi ? MOSS : "#bbb" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 16px auto",
        gap: "6px", padding: "0 6px", marginBottom: "5px",
      }}>
        {["Invoice number", "", "Lines connected"].map((h, i) => (
          <div key={i} style={{
            fontSize: "9px", fontWeight: 600, color: "#bbb",
            textTransform: "uppercase", letterSpacing: "0.4px",
            textAlign: i === 2 ? "right" : "left",
          }}>{h}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {visible.map(({ num, lines, total, delay }) => (
          <div key={num} style={{
            display: "grid", gridTemplateColumns: "1fr 16px auto",
            gap: "6px", alignItems: "center",
            padding: "6px 8px", borderRadius: "7px", background: "#f8f9fa",
            opacity: active ? 1 : 0,
            transition: `opacity 0.25s ease ${delay}s`,
          }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{num}</div>
            <div style={{ fontSize: "11px", color: RED }}>⚡</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: MOSS, textAlign: "right" }}>
              {lines} / {total} lines
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent 4 (renumbered): Fraud & Risk Agent ─────────────────────────────────
export function AgentFraudRiskCard({ active, exit, variant = "compact" }: CardProps) {
  const signals = [
    { label: "Bank account changed 3 days ago", severity: "high",   icon: "⚠" },
    { label: "Amount +340% vs. last 6 invoices", severity: "high",   icon: "⚠" },
    { label: "New IBAN not in master data",      severity: "medium", icon: "ⓘ" },
  ];

  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Fraud & Risk Agent" />
        <CardHeader title="Anomaly detection" badge="Pre-payment" />
        {/* Alert banner */}
        <div style={{ padding: "7px 10px", borderRadius: "8px", marginBottom: "8px", background: "#fff5f5", border: "1px solid #fecaca", opacity: active ? 1 : 0, transition: "opacity 0.2s ease" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: RED, marginBottom: "2px" }}>High-risk invoice detected</div>
          <div style={{ fontSize: "10.5px", color: "#b91c1c" }}>Meridian Consulting · INV-9023 · €38,500</div>
        </div>
        {/* All 3 signals, no buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {signals.map(({ label, severity, icon }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "5px 10px", borderRadius: "7px", background: severity === "high" ? "#fff8f8" : "#fffbf0", border: `1px solid ${severity === "high" ? "#fde8e8" : "#fef3c7"}`, opacity: active ? 1 : 0, transition: `opacity 0.25s ease ${0.1 + i * 0.1}s` }}>
              <span style={{ fontSize: "12px", color: severity === "high" ? RED : "#d97706", flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: "11px", color: "#444", lineHeight: 1.3 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visible = signals;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Fraud & Risk Agent" />
      <CardHeader title="Anomaly detection" badge="Pre-payment" />

      {/* Risk alert banner */}
      <div style={{
        padding: "7px 10px", borderRadius: "8px", marginBottom: "8px",
        background: "#fff5f5", border: "1px solid #fecaca",
        opacity: active ? 1 : 0, transition: "opacity 0.2s ease",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: RED, marginBottom: "2px" }}>
          High-risk invoice detected
        </div>
        <div style={{ fontSize: "10.5px", color: "#b91c1c" }}>
          Meridian Consulting · INV-9023 · €38,500
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
        {visible.map(({ label, severity, icon }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
            padding: "6px 10px", borderRadius: "7px",
            background: severity === "high" ? "#fff8f8" : "#fffbf0",
            border: `1px solid ${severity === "high" ? "#fde8e8" : "#fef3c7"}`,
            opacity: active ? 1 : 0,
            transition: `opacity 0.25s ease ${0.1 + i * 0.1}s`,
          }}>
            <span style={{ fontSize: "12px", color: severity === "high" ? RED : "#d97706", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: "11px", color: "#444", lineHeight: 1.35 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", gap: "6px",
        opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.4s",
      }}>
        <div style={{
          flex: 1, textAlign: "center", padding: "6px 0",
          background: RED, borderRadius: "7px",
          fontSize: "11px", fontWeight: 700, color: "white",
        }}>
          Block payment
        </div>
        <div style={{
          flex: 1, textAlign: "center", padding: "6px 0",
          background: "#f5f5f5", borderRadius: "7px",
          fontSize: "11px", fontWeight: 700, color: "#555",
        }}>
          Escalate for review
        </div>
      </div>
    </div>
  );
}

// ─── Agent 4: Approvals Agent ─────────────────────────────────────────────────
export function AgentCopilotCard({ active, exit, variant = "compact" }: CardProps) {
  const pending = [
    { vendor: "TechSource Ltd",    amount: "€12,450", age: "3 days",  risk: "low"    },
    { vendor: "Apex Office Supp.", amount: "€4,320",  age: "1 day",   risk: "low"    },
    { vendor: "Meridian Consult.", amount: "€38,500", age: "5 days",  risk: "high"   },
  ];
  const visible = variant === "compact" ? pending.slice(0, 2) : pending;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Approvals Agent" />
      <CardHeader title="Approval guidance" badge="3 pending" />

      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "8px" }}>
        {visible.map(({ vendor, amount, age, risk }, i) => (
          <div key={vendor} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "6px 10px", background: "#f8f9fa", borderRadius: "8px",
            borderLeft: `3px solid ${risk === "high" ? RED : MOSS}`,
            opacity: active ? 1 : 0,
            transition: `opacity 0.25s ease ${i * 0.12}s`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#111" }}>{vendor}</div>
              <div style={{ fontSize: "9.5px", color: "#aaa" }}>Awaiting approval · {age} old</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{amount}</div>
              {risk === "high" && (
                <div style={{ fontSize: "9px", fontWeight: 700, color: RED }}>⚠ Flag</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI suggestion */}
      <div style={{
        padding: "8px 10px", borderRadius: "8px",
        background: "rgba(47,67,68,0.05)", border: "1px solid rgba(47,67,68,0.12)",
        opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.4s",
      }}>
        <div style={{ fontSize: "9.5px", fontWeight: 700, color: SAND, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px" }}>Copilot suggests</div>
        <div style={{ fontSize: "11px", color: "#444", lineHeight: 1.4 }}>
          Approve TechSource & Apex. Hold Meridian -- bank data mismatch flagged.
        </div>
      </div>
    </div>
  );
}

// ─── Agent 5: Supplier Inquiries Agent ───────────────────────────────────
export function AgentSupplierCard({ active, exit, variant = "compact" }: CardProps) {
  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Supplier Inquiries Agent" />
        <CardHeader title="Supplier conversations" badge="24/7" />
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {/* Supplier message */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "7px", opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.05s" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, background: SAND, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white" }}>AC</div>
            <div style={{ fontSize: "11px", lineHeight: 1.5, padding: "8px 11px", borderRadius: "10px 10px 10px 3px", background: "#f4f4f2", color: "#444", maxWidth: "82%" }}>
              INV-5512: can you confirm payment status? It's 14 days overdue.
            </div>
          </div>
          {/* AI response */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "7px", flexDirection: "row-reverse", opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.25s" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white" }}>AI</div>
            <div style={{ fontSize: "11px", lineHeight: 1.5, padding: "8px 11px", borderRadius: "10px 10px 3px 10px", background: DARK, color: "white", maxWidth: "82%" }}>
              Hi! INV-5512 is approved and scheduled for payment on 28 Mar. You'll receive remittance by email.
            </div>
          </div>
          {/* Resolved chip */}
          <div style={{ display: "flex", justifyContent: "center", opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "4px 12px", borderRadius: "9999px", background: "rgba(132,152,92,0.1)", color: MOSS, border: `1px solid rgba(132,152,92,0.25)` }}>✓ Resolved automatically · 1.8s</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Supplier Inquiries Agent" />
      <CardHeader title="Supplier conversations" badge="24/7" />

      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {/* Supplier message */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: "7px",
          opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.05s",
        }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
            background: SAND, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white",
          }}>AC</div>
          <div style={{
            fontSize: "11px", lineHeight: 1.5, padding: "8px 11px",
            borderRadius: "10px 10px 10px 3px", background: "#f4f4f2", color: "#444",
            maxWidth: "82%",
          }}>
            INV-5512: can you confirm payment status? It's 14 days overdue.
          </div>
        </div>

        {/* AI response */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: "7px", flexDirection: "row-reverse",
          opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.25s",
        }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
            background: DARK, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white",
          }}>AI</div>
          <div style={{
            fontSize: "11px", lineHeight: 1.5, padding: "8px 11px",
            borderRadius: "10px 10px 3px 10px", background: DARK, color: "white",
            maxWidth: "82%",
          }}>
            Hi! INV-5512 is approved and scheduled for payment on 28 Mar. You'll receive remittance by email.
          </div>
        </div>

        {/* Resolved chip */}
        <div style={{
          display: "flex", justifyContent: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s",
        }}>
          <span style={{
            fontSize: "10px", fontWeight: 600, padding: "4px 12px",
            borderRadius: "9999px", background: "rgba(132,152,92,0.1)",
            color: MOSS, border: `1px solid rgba(132,152,92,0.25)`,
          }}>
            ✓ Resolved automatically · 1.8s
          </span>
        </div>

        {/* Second exchange */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: "7px",
          opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.65s",
        }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
            background: SAND, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white",
          }}>AC</div>
          <div style={{
            fontSize: "11px", lineHeight: 1.5, padding: "8px 11px",
            borderRadius: "10px 10px 10px 3px", background: "#f4f4f2", color: "#444",
            maxWidth: "82%",
          }}>
            Thanks. Can I get a copy of the remittance advice?
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "flex-end", gap: "7px", flexDirection: "row-reverse",
          opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.85s",
        }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
            background: DARK, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "white",
          }}>AI</div>
          <div style={{
            fontSize: "11px", lineHeight: 1.5, padding: "8px 11px",
            borderRadius: "10px 10px 3px 10px", background: DARK, color: "white",
            maxWidth: "82%",
          }}>
            Sent to your registered email now.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Agent 6: Statement Reconciliation Agent ─────────────────────────────────
export function AgentStatementReconCard({ active, exit, variant = "compact" }: CardProps) {
  const items = [
    { ref: "INV-2024-0891", supplierAmt: "€4,320", ledgerAmt: "€4,320", status: "matched" },
    { ref: "INV-2024-0744", supplierAmt: "€1,850", ledgerAmt: "€1,750", status: "variance" },
    { ref: "INV-2024-0612", supplierAmt: "€920",   ledgerAmt: "-",      status: "missing"  },
  ];
  const visible = variant === "compact" ? items.slice(0, 2) : items;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Statement Reconciliation Agent" />
      <CardHeader title="Supplier statement match" badge="Auto" />

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 64px 64px 60px",
        gap: "4px", padding: "0 4px", marginBottom: "6px",
      }}>
        {["Reference", "Supplier", "Ledger", ""].map((h, i) => (
          <div key={i} style={{ fontSize: "9px", fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.4px", textAlign: i === 0 ? "left" : "center" }}>{h}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
        {visible.map(({ ref, supplierAmt, ledgerAmt, status }, i) => {
          const bg = status === "matched" ? "#f8f9fa" : status === "variance" ? "#fffbf0" : "#fff8f8";
          const border = status === "matched" ? "transparent" : status === "variance" ? "#fef3c7" : "#fde8e8";
          const badge = status === "matched"
            ? { label: "✓", color: MOSS }
            : status === "variance"
            ? { label: "Δ", color: "#d97706" }
            : { label: "!", color: RED };
          return (
            <div key={ref} style={{
              display: "grid", gridTemplateColumns: "1fr 64px 64px 60px",
              gap: "4px", alignItems: "center",
              padding: "7px 8px", borderRadius: "7px",
              background: bg, border: `1px solid ${border}`,
              opacity: active ? 1 : 0,
              transition: `opacity 0.25s ease ${i * 0.12}s`,
            }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{ref}</div>
              <div style={{ fontSize: "10.5px", textAlign: "center", color: "#444" }}>{supplierAmt}</div>
              <div style={{ fontSize: "10.5px", textAlign: "center", color: status === "missing" ? "#ccc" : "#444" }}>{ledgerAmt}</div>
              <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: badge.color }}>{badge.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: "flex", gap: "8px",
        opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.4s",
      }}>
        {[
          { label: "1 matched",  color: MOSS,    bg: "rgba(132,152,92,0.08)" },
          { label: "1 variance", color: "#d97706", bg: "rgba(217,119,6,0.07)" },
          ...(variant === "full" ? [{ label: "1 missing", color: RED, bg: "rgba(218,32,40,0.06)" }] : []),
        ].map(({ label, color, bg }) => (
          <div key={label} style={{
            flex: 1, textAlign: "center", padding: "6px 0",
            background: bg, borderRadius: "7px",
            fontSize: "10.5px", fontWeight: 700, color,
          }}>{label}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent 7: Payment Optimization Agent ──────────────────────────────────────
export function AgentPaymentsCard({ active, exit, variant = "compact" }: CardProps) {
  const opportunities = [
    {
      type: "Early payment discounts",
      value: "5,500 EUR",
      detail: "2 invoices with active 2/10 net-30 windows",
      urgency: "Expires in 24 hours",
      valueColor: MOSS,
      bg: "rgba(132,152,92,0.06)",
      border: "rgba(132,152,92,0.18)",
      urgencyColor: "#d97706",
      delay: 0.15,
    },
    {
      type: "Avoid overdue risk",
      value: "3 invoices",
      detail: "4,220 EUR at risk -- Global Metals overdue 2 days",
      urgency: "Pay within 48 hours",
      valueColor: RED,
      bg: "#fff8f8",
      border: "#fde8e8",
      urgencyColor: RED,
      delay: 0.27,
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Payment Optimization Agent" />
        <CardHeader title="AI payment insights" badge="95% confidence" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {/* Left: net impact */}
          <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(132,152,92,0.07)", border: "1px solid rgba(132,152,92,0.18)", opacity: active ? 1 : 0, transition: "opacity 0.2s ease" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Net financial impact</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: MOSS, letterSpacing: "-0.5px", marginBottom: "4px" }}>+9,820 EUR</div>
            <div style={{ fontSize: "9.5px", color: "#888", lineHeight: 1.4 }}>5,500 EUR discounts · 7,520 EUR cash preserved</div>
          </div>
          {/* Right: opportunities stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {opportunities.map(({ type, value, urgency, valueColor, bg, border, urgencyColor, delay }, i) => (
              <div key={type} style={{ padding: "7px 9px", borderRadius: "7px", background: bg, border: `1px solid ${border}`, opacity: active ? 1 : 0, transition: `opacity 0.25s ease ${delay}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#333" }}>{type}</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: valueColor, flexShrink: 0, marginLeft: "6px" }}>{value}</span>
                </div>
                <span style={{ fontSize: "9px", fontWeight: 600, color: urgencyColor }}>{urgency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Payment Optimization Agent" />
      <CardHeader title="AI payment insights" badge="95% confidence" />

      {/* Net financial impact */}
      <div style={{
        padding: "8px 11px", borderRadius: "8px", marginBottom: "8px",
        background: "rgba(132,152,92,0.07)", border: "1px solid rgba(132,152,92,0.18)",
        opacity: active ? 1 : 0, transition: "opacity 0.2s ease",
      }}>
        <div style={{ fontSize: "9px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>
          Net financial impact vs. pay all today
        </div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: MOSS, letterSpacing: "-0.5px", marginBottom: "2px" }}>
          +9,820 EUR
        </div>
        <div style={{ fontSize: "9.5px", color: "#888" }}>
          5,500 EUR discounts · 7,520 EUR cash preserved · −3,200 EUR early
        </div>
      </div>

      {/* DPO bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 10px", background: "#f8f9fa", borderRadius: "7px", marginBottom: "8px",
        opacity: active ? 1 : 0, transition: "opacity 0.25s ease 0.1s",
      }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#777" }}>Days payable outstanding</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", color: "#aaa" }}>32d →</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: MOSS }}>36.2d</span>
          <span style={{ fontSize: "9px", fontWeight: 600, color: MOSS, background: "rgba(132,152,92,0.1)", padding: "1px 5px", borderRadius: "4px" }}>+4.2</span>
        </div>
      </div>

      {/* Opportunities */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {opportunities.map(({ type, value, detail, urgency, valueColor, bg, border, urgencyColor, delay }, i) => (
          <div key={type} style={{
            padding: "7px 10px", borderRadius: "8px",
            background: bg, border: `1px solid ${border}`,
            opacity: active ? 1 : 0, transition: `opacity 0.25s ease ${delay}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#333" }}>{type}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: valueColor, flexShrink: 0, marginLeft: "8px" }}>{value}</span>
            </div>
            <div style={{ fontSize: "9.5px", color: "#888", marginBottom: "3px" }}>{detail}</div>
            <span style={{ fontSize: "9px", fontWeight: 600, color: urgencyColor, background: i === 0 ? "rgba(217,119,6,0.08)" : "rgba(218,32,40,0.07)", padding: "1px 7px", borderRadius: "9999px" }}>{urgency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent 8: Expense Processing Agent ───────────────────────────────────────
export function AgentExpenseProcessingCard({ active, exit, variant = "compact" }: CardProps) {
  const items = [
    { desc: "Hotel: London, Nov 12",    cat: "Travel & Entertainment", amt: "£420", ok: true  },
    { desc: "Taxi: Heathrow, Nov 12",   cat: "Travel",                 amt: "£48",  ok: true  },
    { desc: "Team Lunch: Soho",         cat: "Meals & Entertainment",  amt: "£127", ok: false },
    { desc: "Software: Annual licence", cat: "IT & Software",          amt: "£699", ok: true  },
  ];
  const visible = variant === "compact" ? items.slice(0, 2) : items;

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Expense Processing Agent" />
      <CardHeader title="Auto-processed expenses" badge="96% compliant" />

      <div style={{ marginBottom: "6px", padding: "6px 10px", background: "#f0f3f2", borderRadius: "7px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#777" }}>Sarah Chen · Q1 Expenses</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>£1,294</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: variant === "compact" ? "5px" : "4px" }}>
        {visible.map(({ desc, cat, amt, ok }, i) => (
          <div key={desc} style={{
            padding: variant === "compact" ? "5px 9px" : "6px 9px", background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0,
            transition: `opacity 0.28s ease ${i * 0.12}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{desc}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{amt}</span>
                <span style={{ fontSize: "11px", color: ok ? "#16a34a" : "#d97706" }}>{ok ? "✓" : "⚠"}</span>
              </div>
            </div>
            <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>{cat}</span>
          </div>
        ))}
      </div>

      {variant === "full" && (
        <div style={{
          marginTop: "6px", padding: "6px 10px",
          background: "rgba(217,119,6,0.08)", borderRadius: "7px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#d97706" }}>⚠ 1 item flagged for approval</span>
          <span style={{ fontSize: "10px", color: "#aaa" }}>3 items auto-approved</span>
        </div>
      )}
    </div>
  );
}

// ─── Agent 9: Expense Card Fraud Agent ────────────────────────────────────────
export function AgentExpenseFraudCard({ active, exit, variant = "compact" }: CardProps) {
  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Expense Card Fraud Agent" />
        <CardHeader title="Card Fraud Prevention" badge="Real-time" />
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)", overflow: "hidden", opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderBottom: "1px solid #f3f3f3" }}>
            <img src="/images/expensya-card.png" alt="" style={{ height: "26px", width: "auto" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#555", flex: 1 }}>Expense Card</span>
            <span style={{ fontSize: "9px", color: "#aaa" }}>now</span>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>Unusual transaction detected</div>
            <div style={{ fontSize: "10.5px", color: "#555", marginBottom: "8px", lineHeight: 1.4 }}>
              <strong>Le Duplex Club, Paris</strong>: <strong>€247</strong> on card •••• 4429. Did you authorise this?
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: "#f5f5f5", borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: "#555" }}>Yes, approve</div>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: RED, borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: "white" }}>No, block it</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Expense Card Fraud Agent" />
      <CardHeader title="Card Fraud Prevention" badge="Real-time" />

      {/* Push notification -- pending */}
      <div style={{
        background: "white", borderRadius: "14px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        overflow: "hidden", marginBottom: "12px",
        opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 12px 8px", borderBottom: "1px solid #f3f3f3",
        }}>
          <img src="/images/expensya-card.png" alt="" style={{ height: "32px", width: "auto" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#555", flex: 1 }}>Expense Card</span>
          <span style={{ fontSize: "9px", color: "#aaa" }}>now</span>
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>
            Unusual transaction detected
          </div>
          <div style={{ fontSize: "11px", color: "#555", marginBottom: "10px", lineHeight: 1.4 }}>
            <strong>Le Duplex Club, Paris</strong> is attempting to charge <strong>€247</strong> on card •••• 4429. Did you authorise this?
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: "#f5f5f5", borderRadius: "8px",
              fontSize: "11px", fontWeight: 700, color: "#555",
            }}>Yes, approve</div>
            <div style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: RED, borderRadius: "8px",
              fontSize: "11px", fontWeight: 700, color: "white",
            }}>No, block it</div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Agent 10: Suspicious Expense Agent ────────────────────────────────────────
export function AgentSuspiciousExpenseCard({ active, exit, variant = "compact" }: CardProps) {
  const signals = [
    "Amount 3× above typical spend",
    "Unexpected country",
    "Unknown merchant",
  ];

  if (variant === "compact") {
    return (
      <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
        <AgentLabel name="Suspicious Expense Agent" />
        <CardHeader title="Suspicious activity detected" badge="Real-time" />
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Left: flagged transaction */}
          <div style={{ flex: 1, background: "#fef8f0", borderRadius: "10px", padding: "10px", border: "1px solid #f5e6d0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
              <span style={{ fontSize: "14px" }}>🔥</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>$4,280.00</span>
              <span style={{ fontSize: "9px", color: "#888" }}>Marrakech, MA</span>
            </div>
            <div style={{ fontSize: "10px", color: "#666", lineHeight: 1.35 }}>Hotel & Resort Services · ····4429</div>
          </div>
          {/* Right: signals + actions */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              {signals.map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "8px", color: "#e67e22" }}>▲</span>
                  <span style={{ fontSize: "10px", color: "#555" }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ flex: 1, textAlign: "center", padding: "5px 0", background: "#f0fdf4", borderRadius: "6px", fontSize: "10px", fontWeight: 600, color: "#16a34a", border: "1px solid #bbf7d0" }}>All good</div>
              <div style={{ flex: 1, textAlign: "center", padding: "5px 0", background: "#fef2f2", borderRadius: "6px", fontSize: "10px", fontWeight: 600, color: "#dc2626", border: "1px solid #fecaca" }}>Flag for review</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (360×320px)
  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <AgentLabel name="Suspicious Expense Agent" />
      <CardHeader title="Suspicious activity detected" badge="Real-time" />

      {/* Flagged transaction */}
      <div style={{
        background: "#fef8f0", borderRadius: "10px",
        padding: "12px 14px", marginBottom: "12px",
        border: "1px solid #f5e6d0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span style={{ fontSize: "16px" }}>🔥</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>$4,280.00</span>
          <span style={{ fontSize: "11px", color: "#888", marginLeft: "auto" }}>Marrakech, MA</span>
        </div>
        <div style={{ fontSize: "11.5px", color: "#555", lineHeight: 1.4, paddingLeft: "24px" }}>
          Hotel & Resort Services · Card ····4429
        </div>
      </div>

      {/* Signals */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "7px" }}>
          Why flagged
        </div>
        {signals.map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", color: "#e67e22" }}>▲</span>
            <span style={{ fontSize: "11.5px", color: DARK, fontWeight: 500 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{
          flex: 1, textAlign: "center", padding: "8px 0",
          background: "#f0fdf4", borderRadius: "8px",
          fontSize: "11px", fontWeight: 700, color: "#16a34a",
          border: "1px solid #bbf7d0",
        }}>✓ All good</div>
        <div style={{
          flex: 1, textAlign: "center", padding: "8px 0",
          background: "#fef2f2", borderRadius: "8px",
          fontSize: "11px", fontWeight: 700, color: "#dc2626",
          border: "1px solid #fecaca",
        }}>🔥 Flag for review</div>
      </div>
    </div>
  );
}

// ─── Agent 11: Mileage Calculation Agent ──────────────────────────────────────
export function AgentMileageCard({ active, exit, variant = "compact" }: CardProps) {
  const isCompact = variant === "compact";

  // SVG map route points (stylised road between two pins)
  const routePath = "M 30,72 C 55,72 50,40 80,38 C 110,36 115,55 140,50 C 165,45 170,28 200,28";

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Auto-calculated mileage" badge="Google Maps" />

      {/* Map visual */}
      <div style={{
        background: "#eef2e8", borderRadius: "10px", overflow: "hidden",
        marginBottom: "8px", position: "relative",
        height: isCompact ? "90px" : "110px",
        opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s",
      }}>
        {/* Stylised grid lines */}
        <svg width="100%" height="100%" viewBox="0 0 230 110" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Subtle grid */}
          {[20,40,60,80].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="230" y2={y} stroke="#d5ddc9" strokeWidth="0.5" />
          ))}
          {[40,80,120,160,200].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="110" stroke="#d5ddc9" strokeWidth="0.5" />
          ))}

          {/* Road/route */}
          <path d={routePath} fill="none" stroke="#8a9a9a" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" opacity="0.5" />
          <path d={routePath} fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />

          {/* Start pin */}
          <circle cx="30" cy="72" r="5" fill={RED} />
          <circle cx="30" cy="72" r="2.5" fill="white" />

          {/* End pin */}
          <circle cx="200" cy="28" r="5" fill={DARK} />
          <circle cx="200" cy="28" r="2.5" fill="white" />

          {/* Labels */}
          <text x="30" y="90" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 700, fill: DARK }}>Manchester</text>
          <text x="200" y="18" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 700, fill: DARK }}>Leeds</text>
        </svg>

        {/* Distance badge */}
        <div style={{
          position: "absolute", top: "8px", right: "8px",
          background: "white", borderRadius: "6px", padding: "3px 8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          fontSize: "10px", fontWeight: 700, color: DARK,
        }}>
          42.3 mi
        </div>
      </div>

      {/* Trip details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{
          padding: "6px 9px", background: "#f8f9fa", borderRadius: "7px",
          opacity: active ? 1 : 0, transition: "opacity 0.28s ease 0.2s",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>Manchester → Leeds</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>£18.92</span>
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>42.3 mi</span>
            <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>Car (petrol)</span>
            <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>HMRC 45p/mi</span>
          </div>
        </div>

        {!isCompact && (
          <div style={{
            padding: "6px 9px", background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0, transition: "opacity 0.28s ease 0.35s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>Leeds → Manchester</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>£18.92</span>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>42.3 mi</span>
              <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>Car (petrol)</span>
              <span style={{ fontSize: "9.5px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(47,67,68,0.08)", color: DARK, fontWeight: 600 }}>HMRC 45p/mi</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary footer */}
      {variant === "full" && (
        <div style={{
          marginTop: "6px", padding: "6px 10px",
          background: "rgba(22,163,74,0.08)", borderRadius: "7px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>✓ Policy verified · UK HMRC rates</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>£37.84</span>
        </div>
      )}
    </div>
  );
}

// ─── Agent 12: Payment Cards & Budgets Agent ─────────────────────────────────
export function AgentPaymentCardsCard({ active, exit, variant = "compact" }: CardProps) {
  const isCompact = variant === "compact";

  const limits = [
    { category: "Travel",          limit: "£2,000/mo", used: "£840",   pct: 42 },
    { category: "Software & SaaS", limit: "£500/mo",   used: "£310",   pct: 62 },
    { category: "Meals",           limit: "£300/mo",   used: "£295",   pct: 98 },
  ];

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Proactive spend control" badge="Pre-approved" />

      {/* Expensya card visual */}
      <div style={{
        background: "white", borderRadius: "14px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        overflow: "hidden", marginBottom: isCompact ? "6px" : "8px",
        opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: isCompact ? "8px 12px" : "10px 12px 8px",
          borderBottom: "1px solid #f3f3f3",
        }}>
          <img src="/images/expensya-card.png" alt="" style={{ height: isCompact ? "26px" : "32px", width: "auto" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: isCompact ? "10px" : "11px", fontWeight: 700, color: "#555" }}>Virtual Card Issued</div>
            <div style={{ fontSize: "9px", color: "#aaa" }}>•••• 7821 · Sarah Chen</div>
          </div>
          <span style={{
            fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "9999px",
            background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
          }}>Active</span>
        </div>
        <div style={{ padding: isCompact ? "8px 12px" : "10px 12px" }}>
          <div style={{ fontSize: isCompact ? "11px" : "12px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>
            Conference travel approved
          </div>
          <div style={{ fontSize: isCompact ? "10px" : "11px", color: "#555", lineHeight: 1.4 }}>
            Valid <strong>1-5 Dec</strong> · Hotels, flights, meals only · Max <strong>£2,000</strong>
          </div>
        </div>
      </div>

      {/* Budget limits */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {(isCompact ? limits.slice(0, 2) : limits).map(({ category, limit, used, pct }, i) => (
          <div key={category} style={{
            padding: "6px 9px", background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0, transition: `opacity 0.28s ease ${0.2 + i * 0.12}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{category}</span>
              <span style={{ fontSize: "10px", color: "#888" }}>{used} of {limit}</span>
            </div>
            <div style={{ height: "3px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                width: `${pct}%`,
                background: pct > 90 ? "#d97706" : pct > 70 ? "#eab308" : "#16a34a",
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {variant === "full" && (
        <div style={{
          marginTop: "6px", padding: "6px 10px",
          background: "rgba(217,119,6,0.08)", borderRadius: "7px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.5s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#d97706" }}>⚠ Meals near limit</span>
          <span style={{ fontSize: "10px", color: "#aaa" }}>Policy auto-enforced</span>
        </div>
      )}
    </div>
  );
}

// ─── Policy & Compliance card (Expenses) ─────────────────────────────────────
export function PolicyComplianceCard({ active, exit, variant = "compact" }: CardProps) {
  const isCompact = variant === "compact";

  const chatMessages = [
    { role: "user" as const,  text: "How much can I spend on a hotel in Paris for a work trip?" },
    { role: "bot" as const,   text: "Hotel nights in Paris must be booked on TravelPerk and have a ceiling of €150/night." },
    { role: "user" as const,  text: "What if I find one for €180?" },
    { role: "bot" as const,   text: "For bookings exceeding the ceiling you must obtain manager approval at the time of booking via TravelPerk." },
  ];

  const checks = [
    { label: "Receipt attached",       pass: true },
    { label: "Within policy limit",    pass: true },
    { label: "Compliant archiving",    pass: true },
  ];

  return (
    <div className={`ap-card ${active ? "ap-card--on" : ""} ${exit ? "ap-card--exit" : ""}`}>
      <CardHeader title="Built-in guardrails" badge="Real-time" />

      {/* Copilot chat widget */}
      <div style={{
        background: "white", borderRadius: "12px",
        boxShadow: "0 6px 22px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden", marginBottom: isCompact ? "6px" : "8px",
        opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.1s",
      }}>
        {/* Chat header bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "7px 11px", background: DARK, color: "white",
        }}>
          <div style={{
            width: "18px", height: "18px", borderRadius: "50%",
            background: RED, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "9px", fontWeight: 800, color: "white",
          }}>M</div>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.3px" }}>Medius Copilot</span>
          <span style={{
            marginLeft: "auto", fontSize: "8px", fontWeight: 600,
            padding: "1px 6px", borderRadius: "9999px",
            background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)",
          }}>Policy AI</span>
        </div>

        {/* Chat messages */}
        <div style={{ padding: isCompact ? "8px 10px" : "10px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {(isCompact ? chatMessages.slice(0, 3) : chatMessages).map((msg, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              opacity: active ? 1 : 0, transition: `opacity 0.3s ease ${0.15 + i * 0.15}s`,
            }}>
              <div style={{
                maxWidth: "85%",
                padding: "6px 10px",
                borderRadius: msg.role === "user" ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
                background: msg.role === "user" ? "#f0f0f0" : "rgba(218,32,40,0.07)",
                border: msg.role === "bot" ? `1px solid rgba(218,32,40,0.12)` : "none",
                fontSize: isCompact ? "10px" : "11px",
                lineHeight: 1.4,
                color: "#333",
                fontWeight: msg.role === "bot" ? 500 : 400,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy validation checks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {checks.map(({ label, pass }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "5px 9px", background: "#f8f9fa", borderRadius: "7px",
            opacity: active ? 1 : 0, transition: `opacity 0.28s ease ${0.3 + i * 0.1}s`,
          }}>
            <div style={{
              width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
              background: pass ? "#f0fdf4" : "#fef2f2",
              border: `1.5px solid ${pass ? "#86efac" : "#fca5a5"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "8px", fontWeight: 700, color: pass ? "#16a34a" : "#dc2626",
            }}>{pass ? "\u2713" : "\u2717"}</div>
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#444", flex: 1 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      {variant === "full" && (
        <div style={{
          marginTop: "6px", padding: "6px 10px",
          background: "rgba(22,163,106,0.07)", borderRadius: "7px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: active ? 1 : 0, transition: "opacity 0.3s ease 0.55s",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>All checks passed</span>
          <span style={{ fontSize: "10px", color: "#aaa" }}>NF Z 42-013 compliant</span>
        </div>
      )}
    </div>
  );
}

// ─── Card component per Expense capability (index matches EX_CAPABILITIES) ────
export const EX_CAPABILITY_CARDS: React.ComponentType<CardProps>[] = [
  AgentExpenseProcessingCard,  // 0 -- Expense Management
  EXCard2,                     // 1 -- Expense Cards (reimbursements)
];

// ─── Agent card sets for /ai hero cycling ────────────────────────────────────
export const AGENT_HERO_CARDS: React.ComponentType<CardProps>[] = [
  AgentCaptureCard,
  AgentFraudRiskCard,
  AgentSupplierCard,
];

export const AGENT_HERO_LABELS = [
  "Invoice Capture Agent",
  "Fraud & Risk Agent",
  "Supplier Inquiries Agent",
];

// ══════════════════════════════════════════════════════════════════════════════
// ROADMAP AGENT CARDS -- Coming Soon workflow cards
// ══════════════════════════════════════════════════════════════════════════════

interface RoadmapConfig {
  label: string;
  steps: string[];
}

// ── Self-contained 240×240px square card -- no .ap-card dependency ─────────────
function RoadmapAgentCardInner({ config, active }: { config: RoadmapConfig } & CardProps) {
  const { label, steps } = config;
  return (
    <div style={{
      width: "240px", height: "240px",
      background: "white", borderRadius: "14px",
      padding: "18px 20px",
      boxShadow: "0 28px 56px rgba(0,0,0,0.30), 0 6px 14px rgba(0,0,0,0.10)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      opacity: active ? 1 : 0,
      transition: "opacity 0.45s ease",
    }}>

      {/* Coming Soon badge */}
      <div style={{ marginBottom: "9px" }}>
        <span style={{
          display: "inline-block",
          fontSize: "8px", fontWeight: 700,
          padding: "2px 8px", borderRadius: "9999px",
          background: "rgba(171,156,109,0.12)", color: SAND,
          border: "1px solid rgba(171,156,109,0.28)",
          textTransform: "uppercase" as const, letterSpacing: "0.5px",
        }}>Coming Soon</span>
      </div>

      {/* Agent name */}
      <div style={{
        fontSize: "13.5px", fontWeight: 700, color: DARK,
        lineHeight: 1.25, marginBottom: "14px",
      }}>{label}</div>

      {/* Step flow illustration */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {steps.map((step, i) => (
          <div key={step}>
            <div style={{
              display: "flex", alignItems: "center", gap: "9px",
              background: "#f4f7f6", borderRadius: "8px",
              padding: "8px 10px", border: "1px solid rgba(47,67,68,0.07)",
            }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0,
                background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "8.5px", fontWeight: 700, color: SAND }}>0{i + 1}</span>
              </div>
              <span style={{ fontSize: "11.5px", fontWeight: 600, color: DARK, lineHeight: 1.3 }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ display: "flex", paddingLeft: "19px", margin: "3px 0" }}>
                <div style={{
                  width: "2px", height: "14px", marginLeft: "9px",
                  background: "linear-gradient(to bottom, rgba(171,156,109,0.55), rgba(171,156,109,0.08))",
                  borderRadius: "2px",
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function makeRoadmapCard(config: RoadmapConfig): React.ComponentType<CardProps> {
  return function RoadmapCard({ active, exit }: CardProps) {
    return <RoadmapAgentCardInner config={config} active={active} exit={exit} />;
  };
}

export const RoadmapProcurementCard = makeRoadmapCard({
  label: "Procurement Agent",
  steps: ["Receive purchase request", "Validate budget & policy", "Create & route PO"],
});

export const RoadmapSupplierOnboardingCard = makeRoadmapCard({
  label: "Supplier Onboarding Agent",
  steps: ["Ingest from email", "Extract & validate", "Update master data"],
});

export const RoadmapContractCard = makeRoadmapCard({
  label: "Contract Intake Agent",
  steps: ["Upload contract", "Extract key obligations", "Flag risks & renewals"],
});

export const RoadmapExpenseFraudCard = makeRoadmapCard({
  label: "Expense Fraud Agent",
  steps: ["Flag suspicious claim", "Investigate pattern", "Block & alert"],
});

export const RoadmapExpenseCardFraudCard = makeRoadmapCard({
  label: "Expense Card Fraud Agent",
  steps: ["Detect unusual charge", "Alert cardholder", "Block & investigate"],
});
