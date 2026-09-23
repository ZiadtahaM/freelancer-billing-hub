export default function ThemeMidnightNavy() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#0d0e1a", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#090a14", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1c30", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#7c3aed", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 0 ? "#7c3aed" : "transparent",
              color: i === 0 ? "white" : "#475569",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 0 ? "rgba(255,255,255,0.2)" : "#1e2040", borderRadius: 3 }} />
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1a1c30" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#7c3aed", borderRadius: 6, textAlign: "center", color: "white", fontWeight: 600 }}>
            Midnight Navy Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>Analytics Dashboard</h1>
        <p style={{ color: "#475569", marginBottom: 24, fontSize: 13 }}>Real-time restaurant performance</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[["Revenue", "$1,248", "+18%"], ["Orders", "48", "+7%"], ["Avg Value", "$26", "+3%"], ["Tables", "8/12", "67%"]].map(([l,v,c]) => (
            <div key={l} style={{ background: "#13152a", borderRadius: 12, padding: 20, border: "1px solid #1e2040" }}>
              <p style={{ fontSize: 11, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{l}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#a78bfa", marginBottom: 4 }}>{v}</p>
              <p style={{ fontSize: 11, color: "#22d3ee" }}>{c}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ background: "#13152a", borderRadius: 12, padding: 20, border: "1px solid #1e2040" }}>
            <h3 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Revenue by Hour</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {[30, 60, 45, 80, 70, 55, 90, 65].map((h, i) => (
                <div key={i} style={{ flex: 1, background: "linear-gradient(to top, #7c3aed, #a78bfa)", borderRadius: "4px 4px 0 0", height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div style={{ background: "#13152a", borderRadius: 12, padding: 20, border: "1px solid #1e2040" }}>
            <h3 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Top Items</h3>
            {["Cheeseburger","Caesar Salad","Chicken Wings"].map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 18, height: 18, background: "#7c3aed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 700 }}>{i+1}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
