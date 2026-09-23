export default function ThemeRoseGold() {
  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#fdf2f4", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#1a0a0d", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d1218", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #be123c, #f43f5e)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 14, fontFamily: "serif" }}>M</span>
          </div>
          <span style={{ color: "#fde8ee", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 1 ? "linear-gradient(90deg, #be123c, #e11d48)" : "transparent",
              color: i === 1 ? "white" : "#7c3448",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 1 ? "rgba(255,255,255,0.2)" : "#2d1218", borderRadius: 3 }} />
              {item}
              {item === "Kitchen" && <span style={{ marginLeft: "auto", background: "#e11d48", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>2</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #2d1218" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "linear-gradient(90deg, #be123c, #f43f5e)", borderRadius: 6, textAlign: "center", color: "white", fontWeight: 600, letterSpacing: "0.05em" }}>
            Rose Gold Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 400, color: "#1a0a0d", marginBottom: 4, letterSpacing: "-0.02em" }}>Kitchen Orders</h1>
            <p style={{ color: "#be123c", fontSize: 13, fontStyle: "italic" }}>Fine dining service — 2 active</p>
          </div>
          <div style={{ background: "#be123c", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>New Order +</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { id: "#092", table: "Table 7", items: ["Filet Mignon", "Truffle Risotto", "Crème Brûlée"], status: "preparing", time: "18m" },
            { id: "#091", table: "Table 3", items: ["Lobster Bisque", "Duck Confit"], status: "ready", time: "24m" },
            { id: "#093", table: "Table 12", items: ["Burrata Salad", "Wagyu Burger"], status: "new", time: "4m" },
          ].map((order) => (
            <div key={order.id} style={{
              background: "white", borderRadius: 12, padding: 20,
              border: "1px solid #fce7f3",
              boxShadow: "0 4px 20px rgba(190,18,60,0.08)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#1a0a0d", fontSize: 15 }}>{order.id}</p>
                  <p style={{ color: "#be123c", fontSize: 12, fontStyle: "italic" }}>{order.table}</p>
                </div>
                <span style={{
                  background: order.status === "ready" ? "#dcfce7" : order.status === "new" ? "#fdf2f4" : "#fff7ed",
                  color: order.status === "ready" ? "#166534" : order.status === "new" ? "#be123c" : "#9a3412",
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase"
                }}>{order.status}</span>
              </div>
              {order.items.map(item => (
                <p key={item} style={{ color: "#78716c", fontSize: 12, padding: "3px 0", borderTop: "1px dashed #fce7f3" }}>{item}</p>
              ))}
              <p style={{ marginTop: 10, fontSize: 11, color: "#be123c", fontStyle: "italic" }}>{order.time} elapsed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
