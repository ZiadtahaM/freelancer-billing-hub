export default function ThemeEmber() {
  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#fefaf9", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#1a0808", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d1010", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#991b1b", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fef2f2", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#fef2f2", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 2 ? "#991b1b" : "transparent",
              color: i === 2 ? "#fef2f2" : "#7c4444",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 2 ? "rgba(254,242,242,0.15)" : "#2d1010", borderRadius: 3 }} />
              {item}
              {item === "Cashier" && <span style={{ marginLeft: "auto", background: "#dc2626", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>4</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #2d1010" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#991b1b", borderRadius: 6, textAlign: "center", color: "#fef2f2", fontWeight: 600, letterSpacing: "0.05em" }}>
            Ember Fine Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 400, color: "#1a0808", marginBottom: 4, letterSpacing: "-0.02em" }}>Cashier Station</h1>
        <p style={{ color: "#991b1b", marginBottom: 24, fontSize: 13, fontStyle: "italic" }}>4 unpaid orders awaiting settlement</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a0808", marginBottom: 12 }}>Unpaid Orders</h3>
            {[
              { id: "#088", table: "Table 4", amount: "$67.50", items: 4 },
              { id: "#089", table: "Table 9", amount: "$124.00", items: 6 },
              { id: "#090", table: "Table 2", amount: "$43.50", items: 3 },
              { id: "#091", table: "Table 11", amount: "$89.00", items: 5 },
            ].map((order) => (
              <div key={order.id} style={{
                background: "white", borderRadius: 10, padding: 14, marginBottom: 10,
                border: "1px solid #fce7e7",
                boxShadow: "0 2px 8px rgba(153,27,27,0.06)",
                cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#1a0808", fontSize: 14 }}>{order.id}</p>
                  <p style={{ fontSize: 12, color: "#991b1b", fontStyle: "italic" }}>{order.table} · {order.items} items</p>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#1a0808" }}>{order.amount}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #fce7e7", height: "fit-content" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a0808", marginBottom: 16 }}>Payment — #088</h3>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#7c4444", marginBottom: 8 }}>Tip</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {["10%", "15%", "18%", "20%"].map((tip, i) => (
                  <div key={tip} style={{
                    padding: "8px 0", textAlign: "center", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: i === 2 ? "#991b1b" : "#fef2f2",
                    color: i === 2 ? "white" : "#991b1b",
                    border: `1px solid ${i === 2 ? "#991b1b" : "#fce7e7"}`
                  }}>{tip}</div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid #fce7e7", paddingTop: 12, marginBottom: 16 }}>
              {[["Subtotal","$67.50"],["18% Tip","$12.15"],["Total","$79.65"]].map(([l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: l === "Total" ? 16 : 13, fontWeight: l === "Total" ? 700 : 400, color: l === "Total" ? "#1a0808" : "#7c4444" }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: 14, background: "#991b1b", color: "#fef2f2", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: "0.02em" }}>
              Charge $79.65
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
