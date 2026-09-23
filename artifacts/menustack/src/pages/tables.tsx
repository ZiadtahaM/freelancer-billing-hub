import { useState } from "react";
import { POSLayout } from "@/components/layout";
import { useListOrders, OrderWithItems } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Clock, DollarSign, CircleDot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TABLE_LAYOUT = [
  { id: 1, label: "T1", x: 4, y: 4, seats: 2 },
  { id: 2, label: "T2", x: 22, y: 4, seats: 2 },
  { id: 3, label: "T3", x: 40, y: 4, seats: 4 },
  { id: 4, label: "T4", x: 60, y: 4, seats: 4 },
  { id: 5, label: "T5", x: 4, y: 28, seats: 4 },
  { id: 6, label: "T6", x: 22, y: 28, seats: 6 },
  { id: 7, label: "T7", x: 44, y: 28, seats: 6 },
  { id: 8, label: "T8", x: 66, y: 28, seats: 4 },
  { id: 9, label: "T9", x: 4, y: 56, seats: 2 },
  { id: 10, label: "T10", x: 22, y: 56, seats: 4 },
  { id: 11, label: "T11", x: 44, y: 56, seats: 4 },
  { id: 12, label: "T12", x: 66, y: 56, seats: 2 },
];

function getTableStatus(tableId: number, orders: OrderWithItems[]) {
  const active = orders.filter(
    (o) => o.tableNumber === tableId && ["new", "preparing", "ready"].includes(o.status)
  );
  if (active.length === 0) return { status: "available", orders: [] };
  const hasUnpaid = active.some((o) => o.paymentStatus === "unpaid");
  const statusPriority = active.some((o) => o.status === "new")
    ? "new"
    : active.some((o) => o.status === "preparing")
    ? "preparing"
    : "ready";
  return { status: hasUnpaid ? statusPriority : "ready", orders: active };
}

const STATUS_CONFIG = {
  available: { bg: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", dot: "bg-emerald-500", label: "Available", text: "text-emerald-700" },
  new: { bg: "bg-blue-50 border-blue-200 hover:bg-blue-100", dot: "bg-blue-500", label: "New Order", text: "text-blue-700" },
  preparing: { bg: "bg-amber-50 border-amber-200 hover:bg-amber-100", dot: "bg-amber-500", label: "Preparing", text: "text-amber-700" },
  ready: { bg: "bg-green-50 border-green-200 hover:bg-green-100", dot: "bg-green-500", label: "Ready", text: "text-green-700" },
};

export default function Tables() {
  const { data: orders = [], isLoading } = useListOrders({}, { query: { refetchInterval: 8000 } });
  const [selected, setSelected] = useState<number | null>(null);

  const activeOrders = orders.filter((o) => ["new", "preparing", "ready", "completed"].includes(o.status));
  const available = TABLE_LAYOUT.filter((t) => getTableStatus(t.id, activeOrders).status === "available").length;
  const occupied = TABLE_LAYOUT.length - available;

  const selectedOrders = selected
    ? activeOrders.filter((o) => o.tableNumber === selected && ["new", "preparing", "ready"].includes(o.status))
    : [];

  return (
    <POSLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/10">
        <div className="px-6 py-4 border-b bg-background shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Floor Plan</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Live table status — auto-refreshes every 8s</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-muted-foreground">{available} Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-muted-foreground">{occupied} Occupied</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {TABLE_LAYOUT.length} Total Tables
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            {isLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {TABLE_LAYOUT.map((t) => (
                  <div key={t.id} className="h-28 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {TABLE_LAYOUT.map((table) => {
                  const { status, orders: tableOrders } = getTableStatus(table.id, activeOrders);
                  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                  const isSelected = selected === table.id;
                  const latestOrder = tableOrders[0];

                  return (
                    <button
                      key={table.id}
                      onClick={() => setSelected(isSelected ? null : table.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${config.bg} ${
                        isSelected ? "ring-2 ring-primary ring-offset-1 scale-[1.02]" : ""
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${config.dot} mb-1.5 ${status !== "available" ? "animate-pulse" : ""}`} />
                      <div className="font-bold text-base text-foreground">{table.label}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Users className="w-3 h-3" />
                        {table.seats}
                      </div>
                      {latestOrder && (
                        <div className={`text-[10px] font-medium mt-1 ${config.text}`}>
                          {formatDistanceToNow(new Date(latestOrder.createdAt), { addSuffix: false })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <div className="w-80 shrink-0 border-l bg-background overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base">Table {selected}</h3>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs">
                    Close ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {(() => {
                    const { status } = getTableStatus(selected, activeOrders);
                    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                    return (
                      <Badge variant="outline" className={`text-xs ${config.text} border-current`}>
                        <CircleDot className="w-2.5 h-2.5 mr-1" />{config.label}
                      </Badge>
                    );
                  })()}
                  <span className="text-xs text-muted-foreground">
                    {TABLE_LAYOUT.find((t) => t.id === selected)?.seats} seats
                  </span>
                </div>
              </div>

              {selectedOrders.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✓</span>
                  </div>
                  Table is available
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {selectedOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">Order #{order.id}</span>
                        <Badge variant="outline" className="text-[10px]">{order.status}</Badge>
                      </div>
                      <div className="space-y-1">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.quantity}x {item.menuItemName}</span>
                            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1 font-bold text-sm">
                          <DollarSign className="w-3.5 h-3.5 text-primary" />
                          {order.total.toFixed(2)}
                        </div>
                      </div>
                      {order.notes && (
                        <div className="text-xs italic text-muted-foreground bg-muted rounded px-2 py-1">
                          {order.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  <Link href="/cashier">
                    <Button size="sm" className="w-full" variant="default">
                      Open Cashier
                    </Button>
                  </Link>
                  <Link href="/kitchen">
                    <Button size="sm" className="w-full" variant="outline">
                      Open Kitchen
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </POSLayout>
  );
}
