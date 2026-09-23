export default function ThemeSlate() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 220, background: "#1e293b", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#1d4ed8", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>M</span>
          </div>
          <span style={{ color: "#f8fafc", fontWeight: 700, fontSize: 15 }}>MenuStack</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {["Dashboard", "Kitchen", "Cashier", "Tables", "Orders", "Menu"].map((item, i) => (
            <div key={item} style={{
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: i === 4 ? "#1d4ed8" : "transparent",
              color: i === 4 ? "white" : "#94a3b8",
              fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 16, height: 16, background: i === 4 ? "rgba(255,255,255,0.2)" : "#334155", borderRadius: 3 }} />
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #334155" }}>
          <div style={{ padding: "8px 12px", fontSize: 11, background: "#1d4ed8", borderRadius: 6, textAlign: "center", color: "white", fontWeight: 600 }}>
            Slate Pro Theme
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Orders</h1>
            <p style={{ color: "#64748b", fontSize: 13 }}>All orders — filter and export</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "8px 14px", background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#334155", cursor: "pointer" }}>Filter</button>
            <button style={{ padding: "8px 14px", background: "#1d4ed8", border: "none", borderRadius: 8, fontSize: 12, color: "white", fontWeight: 600, cursor: "pointer" }}>↓ Export CSV</button>
          </div>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["All", "New", "Preparing", "Ready", "Completed"].map((f, i) => (
            <div key={f} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: i === 0 ? "#1d4ed8" : "white",
              color: i === 0 ? "white" : "#64748b",
              border: i === 0 ? "none" : "1px solid #e2e8f0"
            }}>{f}</div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 100px", gap: 8 }}>
            {["Order", "Type", "Status", "Total", "Actions"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>
          {[
            { id: "#051", type: "Dine In", status: "completed", total: "$34.50", color: "#dcfce7", tc: "#166534" },
            { id: "#052", type: "Takeaway", status: "preparing", total: "$18.00", color: "#fef9c3", tc: "#713f12" },
            { id: "#053", type: "Delivery", status: "new", total: "$42.80", color: "#dbeafe", tc: "#1d4ed8" },
            { id: "#054", type: "Dine In", status: "ready", total: "$27.20", color: "#f0fdf4", tc: "#16a34a" },
          ].map((order) => (
            <div key={order.id} style={{ padding: "14px 20px", borderBottom: "1px solid #f8fafc", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 100px", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{order.id}</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>{order.type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: order.color, color: order.tc, width: "fit-content", textTransform: "capitalize" }}>{order.status}</span>
              <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{order.total}</span>
              <button style={{ padding: "5px 10px", background: "#f1f5f9", border: "none", borderRadius: 6, fontSize: 11, color: "#334155", cursor: "pointer" }}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
