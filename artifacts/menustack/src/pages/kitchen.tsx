import { useState, useEffect } from "react";
import { POSLayout } from "@/components/layout";
import { useListOrders, useUpdateOrderStatus, OrderWithItems } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, CheckCircle2, ChefHat, Play, AlertTriangle, RefreshCw } from "lucide-react";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";

function ElapsedBadge({ createdAt }: { createdAt: string }) {
  const [mins, setMins] = useState(() => differenceInMinutes(new Date(), new Date(createdAt)));
  useEffect(() => {
    const id = setInterval(() => setMins(differenceInMinutes(new Date(), new Date(createdAt))), 30_000);
    return () => clearInterval(id);
  }, [createdAt]);

  const urgent = mins >= 15;
  const warning = mins >= 8;
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${urgent ? "text-destructive" : warning ? "text-amber-600" : "text-muted-foreground"}`}>
      {urgent ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {mins}m
    </span>
  );
}

function OrderCard({ order, action }: { order: OrderWithItems; action: React.ReactNode }) {
  const mins = differenceInMinutes(new Date(), new Date(order.createdAt));
  const isUrgent = mins >= 15;
  const isWarning = mins >= 8 && !isUrgent;
  return (
    <Card className={`flex flex-col transition-all ${isUrgent ? "border-destructive/60 bg-destructive/5 shadow-md" : isWarning ? "border-amber-400/60 bg-amber-50/50" : order.status === "new" ? "border-primary/40 shadow-sm" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold leading-none">#{order.id}</CardTitle>
            <div className="mt-1"><ElapsedBadge createdAt={order.createdAt} /></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={order.type === "in_person" ? "default" : "secondary"} className="text-[10px] px-1.5">
              {order.type === "in_person" ? `Table ${order.tableNumber}` : "Online"}
            </Badge>
            {isUrgent && <Badge variant="destructive" className="text-[10px] px-1.5 animate-pulse">URGENT</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-2">
        {order.customerName && <div className="font-medium text-xs text-muted-foreground mb-2">{order.customerName}</div>}
        <div className="space-y-1.5 border-t pt-2">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-sm">
              <span className="font-bold text-primary min-w-[20px]">{item.quantity}×</span>
              <span className="flex-1 leading-tight">{item.menuItemName}</span>
            </div>
          ))}
        </div>
        {order.notes && (
          <div className="mt-2.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-xs italic text-amber-800">{order.notes}</div>
        )}
      </CardContent>
      <CardFooter className="px-3 pb-3 pt-1">{action}</CardFooter>
    </Card>
  );
}

export default function Kitchen() {
  const { data: orders, isLoading, dataUpdatedAt } = useListOrders({}, { query: { refetchInterval: 8000 } });
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => { if (dataUpdatedAt) setLastRefresh(new Date(dataUpdatedAt)); }, [dataUpdatedAt]);

  const bump = (id: number, status: "preparing" | "ready" | "completed") => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/orders"] }); toast({ title: `Order #${id} → ${status}`, duration: 2000 }); },
    });
  };

  const activeOrders = (orders ?? []).filter((o) => ["new", "preparing", "ready"].includes(o.status));
  const sortByTime = (a: OrderWithItems, b: OrderWithItems) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  const newOrders = activeOrders.filter((o) => o.status === "new").sort(sortByTime);
  const preparingOrders = activeOrders.filter((o) => o.status === "preparing").sort(sortByTime);
  const readyOrders = activeOrders.filter((o) => o.status === "ready").sort(sortByTime);

  const columns = [
    { key: "new", label: "New Orders", dot: "bg-blue-500", border: "border-blue-200", header: "bg-blue-50/60", items: newOrders, empty: "Queue is clear", action: (o: OrderWithItems) => (<Button className="w-full h-9 text-sm" onClick={() => bump(o.id, "preparing")}><Play className="w-3.5 h-3.5 mr-1.5" />Start Preparing</Button>) },
    { key: "preparing", label: "Preparing", dot: "bg-amber-500", border: "border-amber-200", header: "bg-amber-50/60", items: preparingOrders, empty: "Nothing in prep", action: (o: OrderWithItems) => (<Button className="w-full h-9 text-sm bg-amber-500 hover:bg-amber-600 text-white" onClick={() => bump(o.id, "ready")}><ChefHat className="w-3.5 h-3.5 mr-1.5" />Mark Ready</Button>) },
    { key: "ready", label: "Ready to Serve", dot: "bg-emerald-500", border: "border-emerald-200", header: "bg-emerald-50/60", items: readyOrders, empty: "No orders ready", action: (o: OrderWithItems) => (<Button className="w-full h-9 text-sm bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => bump(o.id, "completed")}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Complete Order</Button>) },
  ];

  return (
    <POSLayout>
      <div className="flex-1 flex flex-col h-full bg-muted/10 overflow-hidden">
        <div className="px-6 py-4 border-b bg-background shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kitchen Display</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Updated {formatDistanceToNow(lastRefresh, { addSuffix: true })} · auto-refresh 8s</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {columns.map((col) => (
              <Badge key={col.key} variant="outline" className="text-xs px-2.5 py-1 gap-1.5">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />{col.items.length} {col.label}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-8" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 grid grid-cols-3 gap-4 p-6">
            {[0, 1, 2].map((i) => (<div key={i} className="rounded-xl border animate-pulse bg-muted/30" />))}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-5 overflow-hidden">
            {columns.map((col) => (
              <div key={col.key} className={`flex flex-col h-full rounded-xl border-2 ${col.border} overflow-hidden`}>
                <div className={`px-4 py-3 border-b-2 ${col.border} ${col.header} flex items-center gap-2 shrink-0`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot} ${col.items.length > 0 ? "animate-pulse" : ""}`} />
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="ml-auto text-xs font-bold bg-white/70 text-foreground px-2 py-0.5 rounded-full">{col.items.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/40">
                  {col.items.map((order) => (<OrderCard key={order.id} order={order} action={col.action(order)} />))}
                  {col.items.length === 0 && (<div className="text-center py-12 text-sm text-muted-foreground">{col.empty}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </POSLayout>
  );
}
