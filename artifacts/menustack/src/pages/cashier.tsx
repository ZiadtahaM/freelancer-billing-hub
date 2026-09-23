import { useState } from "react";
import { POSLayout } from "@/components/layout";
import { useListOrders, useUpdateOrderPayment, OrderWithItems, OrderPaymentMethod } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, CreditCard, MonitorSmartphone, CheckCircle, Printer, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow, format } from "date-fns";

const fmt = (v: number) => `$${Number(v).toFixed(2)}`;

const TIP_PRESETS = [
  { label: "10%", pct: 0.1 },
  { label: "15%", pct: 0.15 },
  { label: "18%", pct: 0.18 },
  { label: "20%", pct: 0.2 },
  { label: "Custom", pct: -1 },
];

function ReceiptModal({ order, onClose }: { order: OrderWithItems; onClose: () => void }) {
  const subtotal = order.items?.reduce((s, i) => s + i.unitPrice * i.quantity, 0) ?? Number(order.total);
  const tip = Number(order.total) - subtotal;
  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Printer className="w-4 h-4" /> Receipt — Order #{order.id}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div className="border rounded-lg p-4 font-mono text-xs space-y-1 bg-muted/30">
          <div className="text-center font-bold text-base mb-3">MenuStack</div>
          <div className="flex justify-between text-muted-foreground">
            <span>{format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}</span>
            <span>{order.type === "in_person" ? `Table ${order.tableNumber}` : "Online"}</span>
          </div>
          <div className="border-t my-2" />
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.menuItemName}</span>
              <span>{fmt(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t my-2" />
          <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {tip > 0.01 && <div className="flex justify-between text-green-700"><span>Tip</span><span>{fmt(tip)}</span></div>}
          <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
            <span>TOTAL</span><span>{fmt(Number(order.total))}</span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between text-muted-foreground mt-1"><span>Paid via</span><span className="capitalize">{order.paymentMethod}</span></div>
          )}
          <div className="text-center mt-4 text-muted-foreground text-[10px]">Thank you! · menustack.app</div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print Receipt
        </Button>
        <Button className="w-full" onClick={onClose}>Close</Button>
      </div>
    </DialogContent>
  );
}

function PaymentModal({ order, onClose, onSuccess }: { order: OrderWithItems; onClose: () => void; onSuccess: () => void }) {
  const [method, setMethod] = useState<OrderPaymentMethod>("card");
  const [tipPreset, setTipPreset] = useState(0.15);
  const [customTip, setCustomTip] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const updatePayment = useUpdateOrderPayment();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subtotal = Number(order.total);
  const tipAmount = isCustom ? parseFloat(customTip || "0") : subtotal * tipPreset;
  const finalTotal = subtotal + (isNaN(tipAmount) ? 0 : tipAmount);

  const handlePay = () => {
    updatePayment.mutate({ id: order.id, data: { paymentMethod: method } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        toast({ title: `Order #${order.id} paid via ${method}` });
        onSuccess();
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Process Payment — Order #{order.id}</DialogTitle>
      </DialogHeader>
      <div className="space-y-5">
        <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-muted-foreground">{item.quantity}× {item.menuItemName}</span>
              <span>{fmt(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-1.5 mt-1">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Tip</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {TIP_PRESETS.map((tp) => (
              <button
                key={tp.label}
                onClick={() => { if (tp.pct === -1) { setIsCustom(true); setTipPreset(0); } else { setIsCustom(false); setTipPreset(tp.pct); } }}
                className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
                  (tp.pct === -1 ? isCustom : !isCustom && tipPreset === tp.pct)
                    ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
          {isCustom && (
            <div className="mt-2">
              <Input type="number" step="0.01" min="0" placeholder="Custom tip amount" value={customTip} onChange={(e) => setCustomTip(e.target.value)} className="h-9" />
            </div>
          )}
          {!isCustom && tipPreset > 0 && (
            <p className="text-xs text-muted-foreground mt-1.5">Tip: {fmt(tipAmount)}</p>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["cash", "card", "online"] as OrderPaymentMethod[]).map((m) => {
              const Icon = m === "cash" ? Banknote : m === "card" ? CreditCard : MonitorSmartphone;
              return (
                <button key={m} onClick={() => setMethod(m)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-medium transition-all capitalize ${method === m ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>
                  <Icon className="w-5 h-5" />{m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Total to Collect</span>
          <span className="text-2xl font-bold text-primary">{fmt(finalTotal)}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handlePay} disabled={updatePayment.isPending}>
            {updatePayment.isPending ? "Processing..." : `Charge ${fmt(finalTotal)}`}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function Cashier() {
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("unpaid");
  const [payingOrder, setPayingOrder] = useState<OrderWithItems | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<OrderWithItems | null>(null);
  const { data: orders = [], isLoading } = useListOrders(
    filter !== "all" ? { paymentStatus: filter } : {},
    { query: { refetchInterval: 10000 } }
  );
  const queryClient = useQueryClient();

  const totalUnpaid = orders.filter((o) => o.paymentStatus === "unpaid").reduce((s, o) => s + Number(o.total), 0);

  return (
    <POSLayout>
      <div className="flex-1 flex flex-col h-full bg-muted/10 overflow-hidden">
        <div className="px-6 py-4 border-b bg-background shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cashier Station</h1>
            {filter === "unpaid" && orders.length > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">{orders.length} unpaid · <span className="font-semibold text-foreground">{fmt(totalUnpaid)}</span> outstanding</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v: "all" | "unpaid" | "paid") => setFilter(v)}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid Only</SelectItem>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (<div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 opacity-60" />
              <p className="text-sm font-medium">All orders settled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className={`flex flex-col transition-all hover:shadow-md ${order.paymentStatus === "unpaid" ? "border-primary/40" : "opacity-60 hover:opacity-80"}`}>
                  <CardHeader className="pb-2 px-4 pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <div className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={order.type === "in_person" ? "default" : "secondary"} className="text-[10px]">
                          {order.type === "in_person" ? `Table ${order.tableNumber}` : "Online"}
                        </Badge>
                        <Badge variant={order.paymentStatus === "paid" ? "outline" : "destructive"} className={`text-[10px] ${order.paymentStatus === "paid" ? "text-emerald-600 border-emerald-400" : ""}`}>
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 px-4 pb-2 space-y-3">
                    {order.customerName && <div className="text-sm font-medium">{order.customerName}</div>}
                    <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{item.quantity}× {item.menuItemName}</span>
                          <span className="font-medium">{fmt(item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-sm border-t pt-1.5 mt-0.5">
                        <span>Total</span>
                        <span className="text-primary">{fmt(Number(order.total))}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-4 pb-4 pt-2">
                    {order.paymentStatus === "unpaid" ? (
                      <Button className="w-full h-10" onClick={() => setPayingOrder(order)}>
                        Collect Payment
                      </Button>
                    ) : (
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-600 bg-emerald-50 rounded-lg py-2 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" /> Paid via <span className="capitalize">{order.paymentMethod}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs" onClick={() => setReceiptOrder(order)}>
                          <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Receipt
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!payingOrder} onOpenChange={(o) => !o && setPayingOrder(null)}>
        {payingOrder && (
          <PaymentModal
            order={payingOrder}
            onClose={() => setPayingOrder(null)}
            onSuccess={() => { setReceiptOrder(payingOrder); setPayingOrder(null); }}
          />
        )}
      </Dialog>

      <Dialog open={!!receiptOrder} onOpenChange={(o) => !o && setReceiptOrder(null)}>
        {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />}
      </Dialog>
    </POSLayout>
  );
}
