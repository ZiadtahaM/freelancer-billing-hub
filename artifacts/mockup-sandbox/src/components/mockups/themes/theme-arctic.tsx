export default function ThemeArctic() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f0fdfa", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#0f3d3d", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #155e5e", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#0f766e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#ccfbf1", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#ccfbf1", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 0 ? "#0f766e" : "transparent",
              color: i === 0 ? "#ccfbf1" : "#5eead4",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 0 ? "rgba(204,251,241,0.2)" : "#155e5e", borderRadius: 3 }} />
              {item}
              {item === "Kitchen" && <span style={{ marginLeft: "auto", background: "#0d9488", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>3</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #155e5e" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#0f766e", borderRadius: 6, textAlign: "center", color: "#ccfbf1", fontWeight: 600 }}>
            Arctic Fresh Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f3d3d", marginBottom: 4 }}>Live Menu</h1>
            <p style={{ color: "#0d9488", fontSize: 13 }}>Customer view · 32 items available</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ padding: "8px 16px", background: "#ccfbf1", borderRadius: 20, fontSize: 13, color: "#0f3d3d", fontWeight: 600, cursor: "pointer" }}>🛒 Cart (3)</div>
          </div>
        </div>
        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
          {["All", "Burgers", "Pizza", "Salads", "Drinks", "Desserts"].map((cat, i) => (
            <div key={cat} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              background: i === 0 ? "#0f766e" : "white",
              color: i === 0 ? "white" : "#0d9488",
              border: `1px solid ${i === 0 ? "#0f766e" : "#99f6e4"}`
            }}>{cat}</div>
          ))}
        </div>
        {/* Food cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { name: "Arctic Tuna Bowl", price: "$18", badge: "Popular", color: "#ccfbf1" },
            { name: "Fresh Garden Wrap", price: "$14", badge: "New", color: "#d1fae5" },
            { name: "Cool Mint Smoothie", price: "$8", badge: "", color: "#e0f2fe" },
            { name: "Seaweed Poke Bowl", price: "$16", badge: "Popular", color: "#ccfbf1" },
            { name: "Crispy Fish Tacos", price: "$15", badge: "", color: "#f0fdfa" },
            { name: "Berry Acai Bowl", price: "$13", badge: "New", color: "#fce7f3" },
          ].map((item) => (
            <div key={item.name} style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #99f6e4", cursor: "pointer" }}>
              <div style={{ height: 100, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 36 }}>🥗</span>
                {item.badge && <span style={{
                  position: "absolute", top: 8, right: 8,
                  background: "#0f766e", color: "white",
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4
                }}>{item.badge}</span>}
              </div>
              <div style={{ padding: 12 }}>
                <p style={{ fontWeight: 600, color: "#0f3d3d", fontSize: 13, marginBottom: 4 }}>{item.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#0f766e", fontSize: 15 }}>{item.price}</span>
                  <button style={{ width: 28, height: 28, background: "#0f766e", color: "white", border: "none", borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
