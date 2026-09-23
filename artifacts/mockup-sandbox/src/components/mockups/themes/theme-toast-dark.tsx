export default function ThemeToastDark() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#0d0f12", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#080a0d", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1f28", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#f59e0b", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#0d0f12", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 0 ? "#f59e0b" : "transparent",
              color: i === 0 ? "#0d0f12" : "#64748b",
              fontSize: 13, fontWeight: i === 0 ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 0 ? "rgba(0,0,0,0.2)" : "#1e2530", borderRadius: 3 }} />
              {item}
              {(item === "Kitchen") && (
                <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#0d0f12", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>5</span>
              )}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1a1f28" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#1a1f28", borderRadius: 6, textAlign: "center", color: "#f59e0b", fontWeight: 600 }}>
            Toast Dark Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28, background: "#0d0f12" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Kitchen Display</h1>
        <p style={{ color: "#475569", marginBottom: 24, fontSize: 13 }}>Live order queue — Built for busy</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { id: "#042", items: ["Cheeseburger x2", "French Fries x1"], time: "12m", urgent: true },
            { id: "#043", items: ["Margherita Pizza", "Caesar Salad"], time: "7m", urgent: false },
            { id: "#044", items: ["Beef Tacos x3", "Nachos"], time: "3m", urgent: false },
          ].map((order) => (
            <div key={order.id} style={{
              background: order.urgent ? "#450a0a" : "#111520",
              borderRadius: 12, padding: 16,
              border: `1px solid ${order.urgent ? "#7f1d1d" : "#1a1f28"}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>{order.id}</span>
                {order.urgent && <span style={{ background: "#dc2626", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>URGENT</span>}
                <span style={{ color: order.urgent ? "#fca5a5" : "#f59e0b", fontSize: 12, fontWeight: 600 }}>{order.time}</span>
              </div>
              {order.items.map(item => (
                <div key={item} style={{ color: "#94a3b8", fontSize: 13, padding: "4px 0", borderTop: "1px solid #1e2530" }}>{item}</div>
              ))}
              <button style={{
                marginTop: 12, width: "100%", padding: "8px 0",
                background: "#f59e0b", color: "#0d0f12", border: "none",
                borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer"
              }}>Mark Ready →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
