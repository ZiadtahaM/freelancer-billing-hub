export default function ThemeCloverGreen() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f0fdf4", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#14532d", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #166534", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#16a34a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 3 ? "#16a34a" : "transparent",
              color: i === 3 ? "white" : "#86efac",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 3 ? "rgba(255,255,255,0.25)" : "#166534", borderRadius: 3 }} />
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #166534" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#16a34a", borderRadius: 6, textAlign: "center", color: "white", fontWeight: 600 }}>
            Clover Green Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#14532d", marginBottom: 4 }}>Floor Plan</h1>
        <p style={{ color: "#4ade80", marginBottom: 24, fontSize: 13 }}>Live table status — 12 tables</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { n: "T01", status: "available", guests: 0 },
            { n: "T02", status: "occupied", guests: 4 },
            { n: "T03", status: "ready", guests: 2 },
            { n: "T04", status: "available", guests: 0 },
            { n: "T05", status: "occupied", guests: 6 },
            { n: "T06", status: "occupied", guests: 2 },
            { n: "T07", status: "available", guests: 0 },
            { n: "T08", status: "ready", guests: 3 },
          ].map((t) => {
            const colors: Record<string, string> = { available: "#dcfce7", occupied: "#fef9c3", ready: "#bbf7d0" };
            const textColors: Record<string, string> = { available: "#14532d", occupied: "#713f12", ready: "#166534" };
            return (
              <div key={t.n} style={{
                background: colors[t.status], borderRadius: 14, padding: 20,
                border: `2px solid ${t.status === "ready" ? "#16a34a" : t.status === "occupied" ? "#ca8a04" : "#bbf7d0"}`,
                cursor: "pointer", textAlign: "center"
              }}>
                <p style={{ fontWeight: 700, fontSize: 18, color: textColors[t.status] }}>{t.n}</p>
                <p style={{ fontSize: 11, color: textColors[t.status], textTransform: "capitalize", fontWeight: 500 }}>{t.status}</p>
                {t.guests > 0 && <p style={{ fontSize: 11, color: "#4b5563" }}>{t.guests} guests</p>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
          {[["Available","#dcfce7","#14532d"],["Occupied","#fef9c3","#713f12"],["Ready","#bbf7d0","#166534"]].map(([label, bg, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: bg, border: `1px solid ${color}` }} />
              <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
