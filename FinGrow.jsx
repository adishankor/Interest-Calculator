import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#050C18",
  card: "#0A1628",
  hi: "#0D1E35",
  border: "rgba(255,255,255,0.07)",
  teal: "#00E5B0",
  purple: "#9B7FFF",
  gold: "#FFB020",
  red: "#FF6B6B",
  pink: "#FF8FA3",
  txt: "#E8F3FF",
  muted: "#526A87",
  mutedLt: "#7A97B5",
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const N = (v, d = 0) => {
  const n = parseFloat(v);
  if (!isFinite(n)) return "0";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(Math.abs(n));
};
const C = (v) => `৳ ${N(v)}`;

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────
function dpsCalc(P, rate, n, comp) {
  [P, rate, n] = [+P, +rate, +n];
  if (!P || !rate || !n || P <= 0 || rate <= 0 || n <= 0) return null;
  const r = rate / 100 / 12;
  const tot = P * n;
  const mat = comp
    ? (r > 0 ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : tot)
    : tot + P * r * (n * (n + 1) / 2);
  const pts = Math.min(n, 24);
  const step = Math.max(1, Math.ceil(n / pts));
  const chart = [];
  for (let i = step; i <= n; i += step) {
    const v = comp
      ? (r > 0 ? P * ((Math.pow(1 + r, i) - 1) / r) * (1 + r) : P * i)
      : P * i + P * r * (i * (i + 1) / 2);
    chart.push({ m: i, val: Math.round(v), dep: Math.round(P * i) });
    if (i === n) break;
  }
  if (!chart.length || chart[chart.length - 1].m !== n) {
    const v = comp ? (r > 0 ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : tot) : tot + P * r * (n * (n + 1) / 2);
    chart.push({ m: n, val: Math.round(v), dep: Math.round(tot) });
  }
  return { mat, tot, int: mat - tot, chart };
}

function fdrCalc(P, rate, yr, freq, comp) {
  [P, rate, yr, freq] = [+P, +rate, +yr, +freq];
  if (!P || !rate || !yr || P <= 0 || rate <= 0 || yr <= 0) return null;
  const r = rate / 100;
  const mat = comp ? P * Math.pow(1 + r / freq, freq * yr) : P * (1 + r * yr);
  const chart = [];
  for (let y = 0; y <= Math.min(yr, 30); y++) {
    const v = y === 0 ? P : (comp ? P * Math.pow(1 + r / freq, freq * y) : P * (1 + r * y));
    chart.push({ y, val: Math.round(v), pri: Math.round(P) });
  }
  return { mat, pri: P, int: mat - P, chart };
}

function emiCalc(P, rate, n) {
  [P, rate, n] = [+P, +rate, +n];
  if (!P || !rate || !n || P <= 0 || rate <= 0 || n <= 0) return null;
  const r = rate / 100 / 12;
  const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return { emi, total: emi * n, int: emi * n - P, pri: P };
}

function amortCalc(P, rate, n) {
  [P, rate, n] = [+P, +rate, +n];
  if (!P || !rate || !n || P <= 0 || rate <= 0 || n <= 0) return null;
  const r = rate / 100 / 12;
  const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  let bal = P;
  const rows = [];
  for (let i = 1; i <= n; i++) {
    const int = bal * r;
    const prin = Math.min(emi - int, bal);
    bal = Math.max(0, bal - prin);
    rows.push({ m: i, emi: +emi.toFixed(2), prin: +prin.toFixed(2), int: +int.toFixed(2), bal: +bal.toFixed(2) });
  }
  return rows;
}

function goalCalc(FV, yr, rate) {
  [FV, yr, rate] = [+FV, +yr, +rate];
  if (!FV || !yr || !rate || FV <= 0 || yr <= 0 || rate <= 0) return null;
  const r = rate / 100 / 12;
  const n = yr * 12;
  const rA = rate / 100;
  const sip = FV * r / (Math.pow(1 + r, n) - 1);
  const ot = FV / Math.pow(1 + rA, yr);
  const chart = [];
  for (let y = 1; y <= yr; y++) {
    chart.push({
      y,
      sip: Math.round(sip * (Math.pow(1 + r, y * 12) - 1) / r),
      ot: Math.round(ot * Math.pow(1 + rA, y)),
    });
  }
  return { sip, ot, FV, sipTot: sip * n, chart };
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  input[type=number] { -moz-appearance: textfield; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input:focus, select:focus { outline: none; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: #0D1E35; border-radius: 3px; }
  .fg-tab-btn:hover { opacity: 0.85; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp .35s ease forwards; }
`;

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Lbl({ c }) {
  return <div style={{ fontSize: 10.5, color: T.muted, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{c}</div>;
}

function Inp({ label, value, onChange, suffix, pre = "৳", nopre }) {
  const [f, sf] = useState(false);
  return (
    <div style={{ marginBottom: 11 }}>
      <Lbl c={label} />
      <div style={{ display: "flex", alignItems: "center", background: T.hi, border: `1.5px solid ${f ? T.teal : T.border}`, borderRadius: 11, padding: "0 14px", transition: "border-color .2s" }}>
        {!nopre && <span style={{ color: T.teal, marginRight: 7, fontWeight: 700, fontSize: 14 }}>{pre}</span>}
        <input value={value} onChange={e => onChange(e.target.value)} type="number" placeholder="0"
          onFocus={() => sf(true)} onBlur={() => sf(false)}
          style={{ background: "none", border: "none", color: T.txt, fontSize: 16, padding: "13px 0", flex: 1, fontFamily: "inherit", minWidth: 0 }} />
        {suffix && <span style={{ color: T.muted, fontSize: 12, marginLeft: 4, whiteSpace: "nowrap" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, opts }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <Lbl c={label} />
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: T.hi, border: `1.5px solid ${T.border}`, borderRadius: 11,
        color: T.txt, fontSize: 14, padding: "13px 14px", fontFamily: "inherit", cursor: "pointer",
        WebkitAppearance: "none", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23526A87'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: 20
      }}>
        {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Tog({ opts, value, onChange }) {
  return (
    <div style={{ display: "flex", background: T.hi, borderRadius: 10, padding: 3, gap: 2, marginBottom: 11 }}>
      {opts.map(o => (
        <button key={o.v} className="fg-tab-btn" onClick={() => onChange(o.v)} style={{
          flex: 1, border: "none", padding: "9px 4px", borderRadius: 8, cursor: "pointer",
          fontSize: 12, fontWeight: 700, fontFamily: "inherit", transition: "all .2s",
          background: value === o.v ? T.teal : "transparent",
          color: value === o.v ? "#050C18" : T.muted,
        }}>{o.l}</button>
      ))}
    </div>
  );
}

function CalcBtn({ onClick, children = "✦ Calculate" }) {
  return (
    <button className="fg-tab-btn" onClick={onClick} style={{
      width: "100%", background: `linear-gradient(135deg, ${T.teal}, #00B88A)`,
      border: "none", color: "#040B14", fontSize: 15, fontWeight: 700,
      padding: 14, borderRadius: 12, cursor: "pointer", letterSpacing: 0.4, marginTop: 4
    }}>{children}</button>
  );
}

function RR({ label, val, hi, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "11px 0", borderBottom: `1px solid ${T.border}` }}>
      <div>
        <div style={{ fontSize: 13, color: T.muted }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: hi ? 16 : 14, fontWeight: hi ? 700 : 500, color: hi ? T.teal : T.txt, textAlign: "right" }}>{val}</div>
    </div>
  );
}

function Card({ children, glow, glowColor = "rgba(0,229,176,.22)", style = {} }) {
  return (
    <div style={{
      background: `linear-gradient(150deg, ${T.card}, #07101E)`,
      border: `1px solid ${glow ? glowColor : T.border}`,
      borderRadius: 16, padding: 16, marginBottom: 11, ...style
    }}>{children}</div>
  );
}

function MatAmt({ label, val, sub, color = T.teal }) {
  return (
    <div style={{ textAlign: "center", padding: "14px 0 10px" }}>
      <div style={{ fontSize: 10.5, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 33, fontWeight: 800, color, fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>{val}</div>
      {sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function Donut({ a, b, la, lb, ca = T.muted, cb = T.teal }) {
  const data = [{ n: la, v: a }, { n: lb, v: b }];
  const tot = a + b;
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 6 }}>{la} vs {lb}</div>
      <ResponsiveContainer width="100%" height={155}>
        <PieChart>
          <Pie data={data} dataKey="v" cx="50%" cy="50%" outerRadius={62} innerRadius={40} paddingAngle={4} nameKey="n">
            <Cell fill={ca} /><Cell fill={cb} />
          </Pie>
          <Tooltip formatter={(v, n) => [`৳ ${N(v)}`, n]} contentStyle={{ background: T.hi, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: i === 0 ? ca : cb }} />
            <span style={{ fontSize: 11, color: T.muted }}>{d.n} ({tot > 0 ? Math.round(d.v / tot * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageTitle({ t, sub }) {
  return (
    <div style={{ marginBottom: 14, paddingTop: 2 }}>
      <div style={{ fontSize: 21, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.txt, letterSpacing: -0.5 }}>{t}</div>
      {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

const ttStyle = { background: T.hi, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 };
const axTick = { fontSize: 10, fill: T.muted };

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ setTab }) {
  const cards = [
    { id: "dps", icon: "💳", title: "DPS Calculator", desc: "Monthly savings scheme", color: T.teal },
    { id: "fdr", icon: "📈", title: "FDR Calculator", desc: "Fixed deposit returns", color: T.purple },
    { id: "loan", icon: "🏦", title: "Loan Calculator", desc: "EMI & full schedule", color: T.gold },
    { id: "goal", icon: "🎯", title: "Goal Planner", desc: "Reach your target amount", color: T.pink },
  ];
  return (
    <div style={{ paddingTop: 4 }} className="fade-up">
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #00E5B0 0%, #9B7FFF 100%)", borderRadius: 20, padding: "22px 20px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 100, height: 100, background: "rgba(255,255,255,.1)", borderRadius: "50%", top: -30, right: -25 }} />
        <div style={{ position: "absolute", width: 65, height: 65, background: "rgba(255,255,255,.07)", borderRadius: "50%", bottom: -15, left: 120 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 9.5, color: "rgba(4,11,20,.55)", fontWeight: 700, letterSpacing: 1.8, marginBottom: 6 }}>YOUR SMART FINANCE PARTNER</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#040B14", fontFamily: "'Syne', sans-serif", letterSpacing: -1.5, lineHeight: 1.05 }}>FinGrow 🌱</div>
          <div style={{ fontSize: 12.5, color: "rgba(4,11,20,.6)", marginTop: 7, lineHeight: 1.5 }}>DPS · FDR · EMI · Amortization · Goal Planner</div>
        </div>
      </div>

      {/* Calculator Cards */}
      <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.4, marginBottom: 9 }}>CALCULATORS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {cards.map(c => (
          <button key={c.id} onClick={() => setTab(c.id)} className="fg-tab-btn" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 13px", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 3, fontFamily: "inherit" }}>{c.title}</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.45 }}>{c.desc}</div>
            <div style={{ marginTop: 10, width: 26, height: 2.5, borderRadius: 2, background: c.color }} />
          </button>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, marginBottom: 9 }}>💡 Smart Money Tips</div>
        {[
          "Start DPS early — compound growth doubles savings over time.",
          "FDR with monthly compounding beats annual by ~0.5% effectively.",
          "Keep EMI under 40% of income for a healthy financial balance.",
          "৳1,000/month SIP at 10% return grows to ৳76L in 20 years!",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 7, marginBottom: 6 }}>
            <span style={{ color: T.teal, fontSize: 11, flexShrink: 0, marginTop: 2 }}>▸</span>
            <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{tip}</span>
          </div>
        ))}
      </Card>

      {/* Ad Banner Placeholder */}
      <div style={{ background: "rgba(255,255,255,.02)", border: `1px dashed ${T.border}`, borderRadius: 12, padding: "12px 14px", textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.muted }}>📢 Google AdMob Banner (320×50)</div>
        <div style={{ fontSize: 10, color: T.muted, marginTop: 2, opacity: .6 }}>Ad network integrated in native build</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setTab("privacy")} className="fg-tab-btn" style={{ background: "none", border: "none", color: T.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>🔒 Privacy Policy</button>
        <div style={{ fontSize: 10, color: T.muted }}>v1.0.0 · FinGrow</div>
      </div>
      <div style={{ height: 10 }} />
    </div>
  );
}

// ─── DPS TAB ──────────────────────────────────────────────────────────────────
function DPSTab() {
  const [f, sf] = useState({ m: "", r: "", n: "", t: "compound" });
  const [res, sr] = useState(null);
  const set = (k, v) => sf(p => ({ ...p, [k]: v }));
  const calc = () => sr(dpsCalc(f.m, f.r, f.n, f.t === "compound"));
  return (
    <div className="fade-up">
      <PageTitle t="DPS Calculator" sub="Deposit Pension Scheme — monthly savings with interest" />
      <Card>
        <Inp label="Monthly Deposit Amount" value={f.m} onChange={v => set("m", v)} />
        <Inp label="Annual Interest Rate" value={f.r} onChange={v => set("r", v)} suffix="% p.a." nopre />
        <Inp label="Tenure" value={f.n} onChange={v => set("n", v)} suffix="months" nopre />
        <Lbl c="Interest Type" />
        <Tog opts={[{ v: "simple", l: "Simple Interest" }, { v: "compound", l: "Compound Interest" }]} value={f.t} onChange={v => set("t", v)} />
        <CalcBtn onClick={calc} />
      </Card>

      {res && (
        <div className="fade-up">
          <Card glow>
            <MatAmt label="MATURITY AMOUNT" val={C(res.mat)} sub={`${f.t === "compound" ? "Compound" : "Simple"} Interest · ${f.n} months`} />
            <div style={{ marginTop: 6 }}>
              <RR label="Total Deposits" val={C(res.tot)} />
              <RR label="Total Interest Earned" val={C(res.int)} hi />
              <RR label="Monthly Deposit" val={C(+f.m)} />
              <RR label="Annual Rate" val={f.r + "%"} />
              <RR label="Gain Ratio" val={N(res.int / res.tot * 100, 1) + "%"} sub="Interest as % of deposits" />
            </div>
          </Card>
          <Card><Donut a={res.tot} b={res.int} la="Deposits" lb="Interest" /></Card>
          {res.chart.length > 2 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 10 }}>Growth Over Time</div>
              <ResponsiveContainer width="100%" height={155}>
                <AreaChart data={res.chart}>
                  <defs>
                    <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.teal} stopOpacity={.35} /><stop offset="100%" stopColor={T.teal} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.muted} stopOpacity={.2} /><stop offset="100%" stopColor={T.muted} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={axTick} tickFormatter={v => `M${v}`} />
                  <YAxis tick={axTick} tickFormatter={v => N(v)} width={45} />
                  <Tooltip formatter={(v, n) => [C(v), n]} contentStyle={ttStyle} />
                  <Area type="monotone" dataKey="dep" name="Deposits" stroke={T.muted} fill="url(#dg2)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="val" name="Maturity Value" stroke={T.teal} fill="url(#dg1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FDR TAB ──────────────────────────────────────────────────────────────────
function FDRTab() {
  const [f, sf] = useState({ p: "", r: "", y: "", freq: "4", t: "compound" });
  const [res, sr] = useState(null);
  const set = (k, v) => sf(pr => ({ ...pr, [k]: v }));
  const calc = () => sr(fdrCalc(f.p, f.r, f.y, f.freq, f.t === "compound"));
  const freqLabel = { 1: "Annual", 2: "Half-Yearly", 4: "Quarterly", 12: "Monthly" };
  return (
    <div className="fade-up">
      <PageTitle t="FDR Calculator" sub="Fixed Deposit Receipt — lump sum interest planner" />
      <Card>
        <Inp label="Principal Amount" value={f.p} onChange={v => set("p", v)} />
        <Inp label="Annual Interest Rate" value={f.r} onChange={v => set("r", v)} suffix="% p.a." nopre />
        <Inp label="Deposit Tenure" value={f.y} onChange={v => set("y", v)} suffix="years" nopre />
        <Lbl c="Interest Type" />
        <Tog opts={[{ v: "simple", l: "Simple Interest" }, { v: "compound", l: "Compound Interest" }]} value={f.t} onChange={v => set("t", v)} />
        {f.t === "compound" && (
          <Sel label="Compounding Frequency" value={f.freq} onChange={v => set("freq", v)} opts={[
            { v: "12", l: "Monthly (12×/year)" },
            { v: "4", l: "Quarterly (4×/year)" },
            { v: "2", l: "Half-Yearly (2×/year)" },
            { v: "1", l: "Annually (1×/year)" },
          ]} />
        )}
        <CalcBtn onClick={calc} />
      </Card>

      {res && (
        <div className="fade-up">
          <Card glow glowColor="rgba(155,127,255,.22)">
            <MatAmt label="MATURITY AMOUNT" val={C(res.mat)}
              sub={`${f.t === "compound" ? `${freqLabel[+f.freq] || ""} compounding` : "Simple interest"} · ${f.y} years`}
              color={T.purple} />
            <div style={{ marginTop: 6 }}>
              <RR label="Principal Amount" val={C(res.pri)} />
              <RR label="Total Interest Earned" val={C(res.int)} hi />
              <RR label="Effective Annual Yield" val={N(res.int / res.pri / +f.y * 100, 2) + "%"} />
              <RR label="Total Growth" val={N((res.mat / res.pri - 1) * 100, 1) + "%"} />
            </div>
          </Card>
          <Card><Donut a={res.pri} b={res.int} la="Principal" lb="Interest" ca={T.muted} cb={T.purple} /></Card>
          {res.chart.length > 2 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 10 }}>Year-wise Growth</div>
              <ResponsiveContainer width="100%" height={155}>
                <AreaChart data={res.chart}>
                  <defs>
                    <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.purple} stopOpacity={.35} /><stop offset="100%" stopColor={T.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="y" tick={axTick} tickFormatter={v => `Y${v}`} />
                  <YAxis tick={axTick} tickFormatter={v => N(v)} width={45} />
                  <Tooltip formatter={(v, n) => [C(v), n]} contentStyle={ttStyle} />
                  <Area type="monotone" dataKey="pri" name="Principal" stroke={T.muted} fill="none" strokeWidth={1.5} strokeDasharray="5 3" />
                  <Area type="monotone" dataKey="val" name="Maturity Value" stroke={T.purple} fill="url(#fg1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LOAN TAB (EMI + AMORTIZATION) ────────────────────────────────────────────
function LoanTab() {
  const [sub, setSub] = useState("emi");
  const [f, sf] = useState({ p: "", r: "", n: "" });
  const [emiRes, setEmiRes] = useState(null);
  const [amRes, setAmRes] = useState(null);
  const set = (k, v) => sf(pr => ({ ...pr, [k]: v }));

  const calcEMI = () => setEmiRes(emiCalc(f.p, f.r, f.n));
  const calcAmort = () => setAmRes(amortCalc(f.p, f.r, f.n));

  const chartData = amRes ? amRes.filter((_, i) => i % Math.max(1, Math.ceil(amRes.length / 18)) === 0 || i === amRes.length - 1) : [];

  return (
    <div className="fade-up">
      <PageTitle t="Loan Calculator" sub="EMI planner with full amortization schedule" />
      {/* Sub-tabs */}
      <div style={{ display: "flex", background: T.hi, borderRadius: 11, padding: 3, gap: 2, marginBottom: 14 }}>
        {[{ v: "emi", l: "EMI Calculator" }, { v: "amort", l: "Amortization" }].map(o => (
          <button key={o.v} className="fg-tab-btn" onClick={() => setSub(o.v)} style={{
            flex: 1, border: "none", padding: "10px 4px", borderRadius: 9, cursor: "pointer",
            fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all .2s",
            background: sub === o.v ? T.gold : "transparent",
            color: sub === o.v ? "#050C18" : T.muted,
          }}>{o.l}</button>
        ))}
      </div>

      <Card>
        <Inp label="Loan Amount" value={f.p} onChange={v => set("p", v)} />
        <Inp label="Annual Interest Rate" value={f.r} onChange={v => set("r", v)} suffix="% p.a." nopre />
        <Inp label="Loan Tenure" value={f.n} onChange={v => set("n", v)} suffix="months" nopre />
        <CalcBtn onClick={sub === "emi" ? calcEMI : calcAmort}
          children={sub === "emi" ? "✦ Calculate EMI" : "✦ Generate Schedule"} />
      </Card>

      {/* EMI Result */}
      {sub === "emi" && emiRes && (
        <div className="fade-up">
          <Card glow glowColor="rgba(255,176,32,.22)">
            <MatAmt label="MONTHLY EMI" val={C(emiRes.emi)} sub={`${f.n} months · ${f.r}% per annum`} color={T.gold} />
            <div style={{ marginTop: 6 }}>
              <RR label="Loan Principal" val={C(emiRes.pri)} />
              <RR label="Total Interest Payable" val={C(emiRes.int)} hi />
              <RR label="Total Amount Payable" val={C(emiRes.total)} />
              <RR label="Interest % of Total" val={N(emiRes.int / emiRes.total * 100, 1) + "%"} sub="Cost of borrowing" />
            </div>
          </Card>
          <Card><Donut a={emiRes.pri} b={emiRes.int} la="Principal" lb="Interest" ca={T.muted} cb={T.gold} /></Card>
        </div>
      )}

      {/* Amortization Result */}
      {sub === "amort" && amRes && (
        <div className="fade-up">
          {/* Chart */}
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 10 }}>Principal vs Interest Per Month</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <XAxis dataKey="m" tick={axTick} tickFormatter={v => `M${v}`} />
                <YAxis tick={axTick} tickFormatter={v => N(v)} width={42} />
                <Tooltip formatter={(v, n) => [C(v), n]} contentStyle={ttStyle} />
                <Bar dataKey="prin" name="Principal" stackId="s" fill={T.teal} />
                <Bar dataKey="int" name="Interest" stackId="s" fill={T.red} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
              {[{ c: T.teal, l: "Principal" }, { c: T.red, l: "Interest" }].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: d.c }} />
                  <span style={{ fontSize: 11, color: T.muted }}>{d.l}</span>
                </div>
              ))}
            </div>
          </Card>
          {/* Table */}
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 10 }}>Payment Schedule ({amRes.length} months)</div>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, minWidth: 320 }}>
                <thead>
                  <tr>
                    {["Mo.", "EMI", "Principal", "Interest", "Balance"].map(h => (
                      <th key={h} style={{ padding: "8px 6px", textAlign: h === "Mo." ? "center" : "right", background: "#0D1E35", color: T.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amRes.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "transparent" }}>
                      <td style={{ padding: "7px 6px", textAlign: "center", color: T.muted }}>{r.m}</td>
                      <td style={{ padding: "7px 6px", textAlign: "right", color: T.txt }}>{N(r.emi)}</td>
                      <td style={{ padding: "7px 6px", textAlign: "right", color: T.teal }}>{N(r.prin)}</td>
                      <td style={{ padding: "7px 6px", textAlign: "right", color: T.red }}>{N(r.int)}</td>
                      <td style={{ padding: "7px 6px", textAlign: "right", color: T.muted }}>{N(r.bal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── GOAL PLANNER TAB ─────────────────────────────────────────────────────────
function GoalTab() {
  const [f, sf] = useState({ fv: "", yr: "", rate: "", desc: "" });
  const [res, sr] = useState(null);
  const set = (k, v) => sf(pr => ({ ...pr, [k]: v }));
  const calc = () => sr(goalCalc(f.fv, f.yr, f.rate));
  return (
    <div className="fade-up">
      <PageTitle t="Goal Planner" sub="How much to invest monthly or once to reach your target?" />
      <Card>
        <Inp label="Target Amount (What you want to buy/save)" value={f.fv} onChange={v => set("fv", v)} />
        <Inp label="Time to Reach Goal" value={f.yr} onChange={v => set("yr", v)} suffix="years" nopre />
        <Inp label="Expected Annual Return / Interest Rate" value={f.rate} onChange={v => set("rate", v)} suffix="% p.a." nopre />
        <CalcBtn onClick={calc} children="✦ Plan My Goal" />
      </Card>

      {res && (
        <div className="fade-up">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 11 }}>
            <Card glow style={{ marginBottom: 0 }}>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Monthly SIP</div>
              <div style={{ fontSize: 21, fontWeight: 800, color: T.teal, fontFamily: "'Syne', sans-serif", letterSpacing: -0.5 }}>{C(res.sip)}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 5 }}>Total invest: {C(res.sipTot)}</div>
            </Card>
            <Card style={{ marginBottom: 0, border: `1px solid rgba(155,127,255,.22)` }}>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>One-Time Now</div>
              <div style={{ fontSize: 21, fontWeight: 800, color: T.purple, fontFamily: "'Syne', sans-serif", letterSpacing: -0.5 }}>{C(res.ot)}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 5 }}>Invest once today</div>
            </Card>
          </div>

          <Card>
            <RR label="Your Target Amount" val={C(res.FV)} hi />
            <RR label="Investment Period" val={f.yr + " years"} />
            <RR label="Expected Annual Return" val={f.rate + "% p.a."} />
            <RR label="SIP Total Interest Gain" val={C(res.FV - res.sipTot)} sub="Return on monthly SIP" />
            <RR label="One-Time Interest Gain" val={C(res.FV - res.ot)} sub="Return on one-time invest" />
          </Card>

          {res.chart.length > 1 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.txt, marginBottom: 10 }}>Investment Growth to Target</div>
              <ResponsiveContainer width="100%" height={165}>
                <AreaChart data={res.chart}>
                  <defs>
                    <linearGradient id="gg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.teal} stopOpacity={.3} /><stop offset="100%" stopColor={T.teal} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.purple} stopOpacity={.25} /><stop offset="100%" stopColor={T.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="y" tick={axTick} tickFormatter={v => `Y${v}`} />
                  <YAxis tick={axTick} tickFormatter={v => N(v)} width={48} />
                  <Tooltip formatter={(v, n) => [C(v), n]} contentStyle={ttStyle} />
                  <Area type="monotone" dataKey="sip" name="Monthly SIP" stroke={T.teal} fill="url(#gg1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ot" name="One-Time" stroke={T.purple} fill="url(#gg2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
                {[{ c: T.teal, l: "Monthly SIP" }, { c: T.purple, l: "One-Time" }].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 16, height: 2.5, borderRadius: 2, background: d.c }} />
                    <span style={{ fontSize: 11, color: T.muted }}>{d.l}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Savings Examples */}
          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 8 }}>🎯 Examples of this goal</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              Your target of <span style={{ color: T.txt, fontWeight: 600 }}>{C(res.FV)}</span> in <span style={{ color: T.txt, fontWeight: 600 }}>{f.yr} years</span> could be:
              a car purchase, home down payment, child's education fund, overseas travel, emergency corpus, or any major life goal.
              Starting a monthly SIP of <span style={{ color: T.teal, fontWeight: 600 }}>{C(res.sip)}</span> today is the smartest path.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── PRIVACY POLICY TAB ───────────────────────────────────────────────────────
function PrivacyTab({ setTab }) {
  const sections = [
    { t: "1. Information We Collect", b: "FinGrow does not collect, store, or transmit any personal data. All financial calculations are performed entirely on your device. No account registration or login is required." },
    { t: "2. Local Data Processing", b: "All inputs you enter (deposit amounts, interest rates, loan values, etc.) are processed locally on your device and are never sent to any external server or cloud service." },
    { t: "3. Third-Party Advertising (AdMob)", b: "This app uses Google AdMob to display advertisements. Google AdMob may collect certain device identifiers and usage data to serve personalized ads. This is subject to Google's Privacy Policy available at policies.google.com/privacy." },
    { t: "4. Advertising ID", b: "With your permission, this app may access your device's Advertising ID (Google GAID) for the purpose of delivering relevant ads via Google AdMob. You may reset or opt out of ad personalization in your Android device Settings → Google → Ads." },
    { t: "5. Analytics", b: "We may use Firebase Analytics (by Google) to collect anonymous, aggregated usage statistics such as feature usage frequency and app crash reports. This data cannot be used to personally identify you." },
    { t: "6. Permissions", b: "This app does not request access to your contacts, location, camera, microphone, files, or any sensitive device permissions. The only permission used may be internet access for loading advertisements." },
    { t: "7. Children's Privacy", b: "FinGrow is not directed at children under the age of 13 and does not knowingly collect personal information from minors." },
    { t: "8. Data Security", b: "Because no personal or financial data is stored outside your device, your financial information remains completely private and under your sole control." },
    { t: "9. Changes to This Policy", b: "We may update this Privacy Policy from time to time. Any significant changes will be communicated through app updates on the Google Play Store." },
    { t: "10. Contact Us", b: "If you have questions or concerns about this Privacy Policy, please contact us at: support@fingrow.app" },
  ];
  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={() => setTab("home")} className="fg-tab-btn" style={{ background: T.hi, border: "none", color: T.txt, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.txt }}>🔒 Privacy Policy</div>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 4 }}>FinGrow Finance Calculator</div>
        <div style={{ fontSize: 11, color: T.muted }}>Effective Date: January 1, 2025</div>
        <div style={{ fontSize: 11, color: T.muted }}>Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        <div style={{ marginTop: 12, fontSize: 12.5, color: T.muted, lineHeight: 1.65 }}>
          FinGrow ("we", "our", or "us") operates the FinGrow Finance Calculator mobile application. This Privacy Policy explains how we handle your information when you use our app.
        </div>
      </Card>
      {sections.map((s, i) => (
        <Card key={i}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 6 }}>{s.t}</div>
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7 }}>{s.b}</div>
        </Card>
      ))}
      <div style={{ height: 20 }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FinGrow() {
  const [tab, setTab] = useState("home");
  const navTabs = [
    { id: "home", icon: "🏠", l: "Home" },
    { id: "dps", icon: "💳", l: "DPS" },
    { id: "fdr", icon: "📈", l: "FDR" },
    { id: "loan", icon: "🏦", l: "Loan" },
    { id: "goal", icon: "🎯", l: "Goal" },
  ];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: T.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", color: T.txt, position: "relative", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ padding: "15px 16px 10px", background: `linear-gradient(180deg, ${T.card} 0%, transparent 100%)`, position: "sticky", top: 0, zIndex: 15, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #00E5B0, #9B7FFF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🌱</div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, lineHeight: 1 }}>FinGrow</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 0.3 }}>Smart Finance Calculator</div>
            </div>
          </div>
          {tab !== "home" && tab !== "privacy" && (
            <button onClick={() => setTab("home")} className="fg-tab-btn" style={{ background: T.hi, border: "none", color: T.muted, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Home</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "4px 14px 90px" }}>
        {tab === "home" && <HomeTab setTab={setTab} />}
        {tab === "dps" && <DPSTab />}
        {tab === "fdr" && <FDRTab />}
        {tab === "loan" && <LoanTab />}
        {tab === "goal" && <GoalTab />}
        {tab === "privacy" && <PrivacyTab setTab={setTab} />}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(8, 16, 26, 0.97)",
        borderTop: `1px solid ${T.border}`,
        backdropFilter: "blur(16px)",
        padding: "8px 0 16px",
        display: "flex", justifyContent: "space-around", zIndex: 20
      }}>
        {navTabs.map(t => {
          const active = tab === t.id || (tab === "privacy" && t.id === "home");
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="fg-tab-btn" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 10px" }}>
              <span style={{ fontSize: 19, lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? T.teal : T.muted, fontFamily: "inherit" }}>{t.l}</span>
              <div style={{ width: active ? 16 : 0, height: 2, borderRadius: 1, background: T.teal, transition: "width .25s" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
