export default function ThemeSquareClean() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#0f172a", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#2563eb", borderRadius: 6 }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 2 ? "#2563eb" : "transparent",
              color: i === 2 ? "white" : "#94a3b8",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 2 ? "rgba(255,255,255,0.25)" : "#1e293b", borderRadius: 3 }} />
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1e293b" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#2563eb", borderRadius: 6, textAlign: "center", color: "white", fontWeight: 600 }}>
            Square Clean Theme
          </div>
        </div>
      </div>
      {/* Square-style split cashier */}
      <div style={{ flex: 1, display: "flex", background: "#f8fafc" }}>
        {/* Left: category tiles + items */}
        <div style={{ flex: 1, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Lunch Menu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { name: "Burgers", count: 9, color: "#f97316" },
              { name: "Sides", count: 4, color: "#f59e0b" },
              { name: "Drinks", count: 6, color: "#3b82f6" },
              { name: "Salads", count: 3, color: "#22c55e" },
              { name: "Desserts", count: 5, color: "#a855f7" },
              { name: "Discounts", count: 0, color: "#64748b" },
            ].map((cat) => (
              <div key={cat.name} style={{
                background: cat.color, borderRadius: 10, padding: "14px 12px",
                cursor: "pointer", color: "white"
              }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{cat.name}</p>
                {cat.count > 0 && <p style={{ fontSize: 11, opacity: 0.9 }}>{cat.count} items</p>}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["Cheeseburger $11", "The Classic $10", "Veggie Burger $9", "BBQ Bacon $12"].map(item => (
              <div key={item} style={{ background: "white", borderRadius: 8, padding: 10, border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#0f172a" }}>
                <div style={{ width: "100%", height: 50, background: "#f1f5f9", borderRadius: 6, marginBottom: 6 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Right: order slip */}
        <div style={{ width: 260, background: "white", borderLeft: "1px solid #e2e8f0", padding: 20, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>#14</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>Check / Actions / Guest</span>
          </div>
          {[["Cheeseburger","$11.00"],["French Fries","$4.00"],["Soda x2","$5.00"]].map(([n,p]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f1f5f9", fontSize: 13 }}>
              <span style={{ color: "#334155" }}>{n}</span><span style={{ fontWeight: 600, color: "#0f172a" }}>{p}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", borderTop: "2px solid #e2e8f0", paddingTop: 12 }}>
            {[["Subtotal","$20.00"],["Tax","$1.80"],["Total","$21.80"]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: l === "Total" ? 15 : 13, fontWeight: l === "Total" ? 700 : 400, color: l === "Total" ? "#0f172a" : "#64748b", marginBottom: 4 }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <button style={{ width: "100%", marginTop: 12, padding: 12, background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Charge $21.80
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
