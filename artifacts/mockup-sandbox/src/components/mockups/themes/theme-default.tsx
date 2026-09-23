export default function ThemeDefault() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#fff7f0", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#1c1917", display: "flex", flexDirection: "column", padding: "0" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #292524", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#f97316", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 0 ? "#f97316" : "transparent",
              color: i === 0 ? "white" : "#a8a29e",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 0 ? "rgba(255,255,255,0.3)" : "#44403c", borderRadius: 3 }} />
              {item}
              {(item === "Kitchen" || item === "Cashier") && (
                <span style={{ marginLeft: "auto", background: "#f97316", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>3</span>
              )}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #292524" }}>
          <div style={{ padding: "8px 12px", fontSize: 12, color: "#78716c", background: "#f97316", borderRadius: 6, textAlign: "center" }}>
            <span style={{ color: "white", fontWeight: 600 }}>● MenuStack Orange</span>
          </div>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: 28, background: "#fff7f0" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1c1917", marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: "#78716c", marginBottom: 24, fontSize: 13 }}>Today's performance overview</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[["Revenue Today", "$312.50", "12 paid orders"], ["Orders Today", "18", "5 still active"], ["Avg Order Value", "$17.36", "all orders today"], ["Active Right Now", "5", "3 pending payment"]].map(([label, value, sub]) => (
            <div key={label} style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #fed7aa", boxShadow: "0 1px 3px rgba(249,115,22,0.08)" }}>
              <p style={{ fontSize: 12, color: "#9a7553", fontWeight: 500, marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#f97316", marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 11, color: "#a8a29e" }}>{sub}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #fed7aa" }}>
          <h3 style={{ fontWeight: 600, color: "#1c1917", marginBottom: 16 }}>Revenue by Hour</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
            {[40, 70, 55, 90, 65, 45, 80, 60].map((h, i) => (
              <div key={i} style={{ flex: 1, background: "#f97316", borderRadius: "4px 4px 0 0", height: `${h}%`, opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["9am","10am","11am","12pm","1pm","2pm","3pm","4pm"].map(t => (
              <div key={t} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#a8a29e" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
