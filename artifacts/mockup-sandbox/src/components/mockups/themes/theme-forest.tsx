export default function ThemeForest() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f4f7f0", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#1a2e1a", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #243824", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#2d6a4f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#d8f3dc", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#d8f3dc", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 5 ? "#2d6a4f" : "transparent",
              color: i === 5 ? "#d8f3dc" : "#74a57f",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 5 ? "rgba(216,243,220,0.2)" : "#243824", borderRadius: 3 }} />
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #243824" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#2d6a4f", borderRadius: 6, textAlign: "center", color: "#d8f3dc", fontWeight: 600 }}>
            Forest Bistro Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a2e1a", marginBottom: 4 }}>Menu Manager</h1>
        <p style={{ color: "#52796f", marginBottom: 24, fontSize: 13 }}>Manage your seasonal offerings</p>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#e8f0e4", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {["Items", "Categories"].map((tab, i) => (
            <div key={tab} style={{
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: i === 0 ? "white" : "transparent",
              color: i === 0 ? "#1a2e1a" : "#52796f",
              boxShadow: i === 0 ? "0 1px 3px rgba(45,106,79,0.15)" : "none"
            }}>{tab}</div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #d1e8d1", overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", background: "#f0f7f0", borderBottom: "1px solid #d1e8d1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a" }}>Menu Items (24)</span>
            <button style={{ background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Item</button>
          </div>
          {[
            { name: "Forest Mushroom Risotto", cat: "Mains", price: "$18.50", avail: true },
            { name: "Herb Crusted Salmon", cat: "Mains", price: "$22.00", avail: true },
            { name: "Wild Berry Tart", cat: "Desserts", price: "$9.50", avail: false },
            { name: "Green Garden Salad", cat: "Starters", price: "$12.00", avail: true },
          ].map((item) => (
            <div key={item.name} style={{ padding: "14px 20px", borderBottom: "1px solid #f0f7f0", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, background: item.avail ? "#d8f3dc" : "#f0f0f0", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "#1a2e1a", fontSize: 13 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "#52796f" }}>{item.cat}</p>
              </div>
              <span style={{ fontWeight: 700, color: "#2d6a4f", fontSize: 14 }}>{item.price}</span>
              <div style={{
                width: 36, height: 20, borderRadius: 10,
                background: item.avail ? "#2d6a4f" : "#d1d5db",
                cursor: "pointer", position: "relative"
              }}>
                <div style={{
                  width: 14, height: 14, background: "white", borderRadius: "50%",
                  position: "absolute", top: 3, left: item.avail ? 18 : 4, transition: "left 0.2s"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
