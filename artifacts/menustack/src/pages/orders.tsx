import { useState } from "react";
import { POSLayout } from "@/components/layout";
import { useListOrders, useUpdateOrderStatus, OrderStatus, OrderType, OrderPaymentStatus } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Eye, X, RefreshCw, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

const fmt = (v: number) => `$${Number(v).toFixed(2)}`;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  preparing: "bg-amber-100 text-amber-700 border-amber-200",
  ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<string, string> = { new: "New", preparing: "Preparing", ready: "Ready", completed: "Completed", cancelled: "Cancelled" };

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const queryParams: Record<string, string> = {};
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (typeFilter !== "all") queryParams.type = typeFilter;
  if (paymentFilter !== "all") queryParams.paymentStatus = paymentFilter;
  if (dateFilter) queryParams.date = dateFilter;

  const { data: orders = [], isLoading } = useListOrders(queryParams);

  const totalShown = orders.reduce((s, o) => s + Number(o.total), 0);
  const hasFilters = statusFilter !== "all" || typeFilter !== "all" || paymentFilter !== "all" || dateFilter;

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setPaymentFilter("all");
    setDateFilter("");
  };

  const exportCSV = () => {
    const header = "Order,Date,Type,Customer/Table,Status,Payment,Total";
    const rows = orders.map((o) => [
      `#${o.id}`,
      format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
      o.type,
      o.type === "in_person" ? `Table ${o.tableNumber}` : (o.customerName || "Walk-in"),
      o.status,
      o.paymentStatus,
      Number(o.total).toFixed(2),
    ].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <POSLayout>
      <div className="flex-1 flex flex-col h-full bg-muted/10 overflow-hidden">
        <div className="px-6 py-4 border-b bg-background shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            {!isLoading && orders.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {orders.length} orders · {fmt(totalShown)} total{hasFilters ? " (filtered)" : ""}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={exportCSV} disabled={!orders.length}>
              <Download className="w-3.5 h-3.5 mr-1.5" />CSV
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-3 border-b bg-background shrink-0 flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Date</label>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-8 text-xs w-[140px]" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["new", "preparing", "ready", "completed", "cancelled"].map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in_person">Dine In</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Payment</label>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-8 text-xs w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-xs mt-4" onClick={clearFilters}>
              <X className="w-3.5 h-3.5 mr-1" />Clear
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[80px] text-xs">Order</TableHead>
                <TableHead className="text-xs">Date & Time</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Customer / Table</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Payment</TableHead>
                <TableHead className="text-xs text-right">Total</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded w-full max-w-[80px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    {hasFilters ? "No orders match the current filters." : "No orders yet."}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20">
                    <TableCell className="font-semibold text-sm">#{order.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM d, h:mm a")}</TableCell>
                    <TableCell>
                      <Badge variant={order.type === "in_person" ? "default" : "secondary"} className="text-[10px] px-1.5">
                        {order.type === "in_person" ? "Dine In" : "Online"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.type === "in_person" ? `Table ${order.tableNumber}` : (order.customerName || "Walk-in")}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[order.status] ?? ""}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={order.paymentStatus === "paid" ? "outline" : "destructive"}
                        className={`text-[10px] px-1.5 ${order.paymentStatus === "paid" ? "text-emerald-600 border-emerald-400" : ""}`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                      {order.paymentMethod && <span className="text-[10px] text-muted-foreground ml-1 capitalize">{order.paymentMethod}</span>}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">{fmt(Number(order.total))}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle className="flex justify-between items-center pr-8">
                              Order #{order.id}
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status]}`}>
                                {STATUS_LABEL[order.status]}
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                ["Type", order.type === "in_person" ? "Dine In" : "Online"],
                                [order.type === "in_person" ? "Table" : "Customer", order.type === "in_person" ? order.tableNumber : (order.customerName || "N/A")],
                                ["Time", format(new Date(order.createdAt), "MMM d, h:mm a")],
                                ["Payment", `${order.paymentStatus}${order.paymentMethod ? ` · ${order.paymentMethod}` : ""}`],
                              ].map(([label, val]) => (
                                <div key={String(label)}>
                                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                                  <p className="font-medium capitalize">{String(val)}</p>
                                </div>
                              ))}
                            </div>
                            <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{item.quantity}× {item.menuItemName}</span>
                                  <span className="font-medium">{fmt(item.unitPrice * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between font-bold border-t pt-1.5 mt-0.5">
                                <span>Total</span><span className="text-primary">{fmt(Number(order.total))}</span>
                              </div>
                            </div>
                            {order.notes && (
                              <div className="px-3 py-2 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200">
                                <span className="font-semibold">Notes: </span>{order.notes}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </POSLayout>
  );
}
