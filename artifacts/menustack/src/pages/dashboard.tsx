import { POSLayout } from "@/components/layout";
import { useGetDashboardStats, useGetRevenueByHour, useGetTopSellingItems, useGetOrdersByStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, Zap, Award, Tag } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const fmt = (v: number) => `$${Number(v).toFixed(2)}`;

function StatCard({ title, value, sub, icon: Icon, accent = false }: { title: string; value: string; sub?: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${accent ? "border-primary/30 bg-primary/5" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${accent ? "text-primary" : ""}`}>{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return <Card><CardContent className="pt-6"><div className="h-16 bg-muted animate-pulse rounded" /></CardContent></Card>;
}

export default function Dashboard() {
  const { data: stats, isLoading: sl } = useGetDashboardStats();
  const { data: revenue, isLoading: rl } = useGetRevenueByHour();
  const { data: topItems, isLoading: tl } = useGetTopSellingItems({ query: { limit: 8 } });
  const { data: byStatus, isLoading: bsl } = useGetOrdersByStatus();

  const isLoading = sl || rl || tl || bsl;

  const maxRevBar = revenue ? Math.max(...revenue.map((r) => r.revenue), 0) : 0;

  return (
    <POSLayout>
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="px-6 py-4 border-b bg-background flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Today's performance overview</p>
          </div>
          <div className="flex gap-2">
            <Link href="/orders"><Button variant="outline" size="sm" className="h-8 text-xs">All Orders</Button></Link>
            <Link href="/kitchen"><Button size="sm" className="h-8 text-xs">Kitchen →</Button></Link>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard title="Revenue Today" value={fmt(stats?.revenueToday ?? 0)} sub={`${stats?.paidOrders ?? 0} paid orders`} icon={DollarSign} accent />
                <StatCard title="Orders Today" value={String(stats?.ordersToday ?? 0)} sub={`${stats?.activeOrders ?? 0} still active`} icon={ShoppingBag} />
                <StatCard title="Avg Order Value" value={fmt(stats?.avgOrderValue ?? 0)} sub="all orders today" icon={TrendingUp} />
                <StatCard title="Active Right Now" value={String(stats?.activeOrders ?? 0)} sub={`${stats?.unpaidOrders ?? 0} pending payment`} icon={Zap} />
              </>
            )}
          </div>

          {stats?.topSellingCategory && (
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700"><Award className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Top Category Today</p>
                  <p className="text-lg font-bold text-amber-900">{stats.topSellingCategory}</p>
                </div>
                <div className="ml-auto">
                  <Link href="/menu">
                    <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-800 hover:bg-amber-100">
                      <Tag className="w-3.5 h-3.5 mr-1.5" />Manage Menu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Revenue by Hour</CardTitle>
                <CardDescription>Today's paid revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {rl ? (
                  <div className="h-56 bg-muted animate-pulse rounded-lg" />
                ) : !revenue?.length ? (
                  <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No revenue data yet today</div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(v) => `$${v}`} fontSize={11} tickLine={false} axisLine={false} width={45} />
                        <Tooltip
                          formatter={(val: number) => [fmt(val), "Revenue"]}
                          labelFormatter={(l) => `${l}:00 – ${l + 1}:00`}
                          contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: "12px" }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}
                          label={maxRevBar > 0 ? undefined : undefined}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Orders by Status</CardTitle>
                <CardDescription>Lifetime distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {bsl ? (
                  <div className="h-56 bg-muted animate-pulse rounded-lg" />
                ) : !byStatus?.length ? (
                  <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No data</div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={byStatus} cx="50%" cy="45%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="count" nameKey="status">
                          {byStatus.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, String(n)]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Selling Items</CardTitle>
              <CardDescription>All-time by quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              {tl ? (
                <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}</div>
              ) : !topItems?.length ? (
                <div className="text-sm text-muted-foreground text-center py-6">No sales data yet</div>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, i) => {
                    const maxQty = topItems[0]?.totalQuantity ?? 1;
                    const pct = (item.totalQuantity / maxQty) * 100;
                    return (
                      <div key={item.menuItemId} className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-5 text-center ${i === 0 ? "text-amber-500" : "text-muted-foreground"}`}>#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground ml-2 shrink-0">{item.totalQuantity} sold · {fmt(item.totalRevenue)}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </POSLayout>
  );
}
