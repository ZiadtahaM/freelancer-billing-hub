import { Link, useLocation } from "wouter";
import { LayoutDashboard, ChefHat, Receipt, UtensilsCrossed, ListOrdered, Home, LayoutGrid } from "lucide-react";
import { MenuStackLogo } from "@/components/logo";
import { useListOrders } from "@workspace/api-client-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

function useLiveOrderCounts() {
  const { data } = useListOrders({}, { query: { refetchInterval: 8000 } });
  const newCount = data?.filter((o) => o.status === "new").length ?? 0;
  const unpaidCount = data?.filter((o) => o.paymentStatus === "unpaid" && ["ready", "completed"].includes(o.status)).length ?? 0;
  return { newCount, unpaidCount };
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null as "new" | "unpaid" | null },
  { href: "/kitchen", label: "Kitchen", icon: ChefHat, badge: "new" as const },
  { href: "/cashier", label: "Cashier", icon: Receipt, badge: "unpaid" as const },
  { href: "/tables", label: "Tables", icon: LayoutGrid, badge: null },
  { href: "/orders", label: "Orders", icon: ListOrdered, badge: null },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed, badge: null },
];

export function POSLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { newCount, unpaidCount } = useLiveOrderCounts();

  const getBadge = (badge: "new" | "unpaid" | null) => {
    if (badge === "new") return newCount;
    if (badge === "unpaid") return unpaidCount;
    return 0;
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      <aside className="hidden md:flex w-[220px] xl:w-[240px] shrink-0 border-r bg-sidebar flex-col">
        <div className="px-4 py-3.5 border-b">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[16px] text-foreground hover:opacity-80 transition-opacity">
            <MenuStackLogo size={26} />
            <span className="tracking-tight text-sidebar-foreground">MenuStack</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            const Icon = link.icon;
            const count = getBadge(link.badge);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 leading-none">{link.label}</span>
                {count > 0 && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none ${
                    isActive ? "bg-white/25 text-white" : "bg-primary text-primary-foreground"
                  }`}>
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-2.5 py-2 border-t space-y-1.5">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              location === "/"
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Customer Menu</span>
          </Link>
          <div className="px-1 pb-1">
            <ThemeSwitcher />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-[15px] text-foreground">
            <MenuStackLogo size={22} />
            <span>MenuStack</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground capitalize">
              {navLinks.find((l) => location === l.href || (l.href !== "/" && location.startsWith(l.href)))?.label ?? "Staff Portal"}
            </span>
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        <nav className="md:hidden flex border-t bg-background shrink-0 safe-area-bottom">
          {[...navLinks.slice(0, 4), { href: "/", label: "Menu", icon: Home, badge: null as null }].map((link) => {
            const isActive = link.href === "/" ? location === "/" : location === link.href || location.startsWith(link.href);
            const Icon = link.icon;
            const count = getBadge(link.badge);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </div>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
