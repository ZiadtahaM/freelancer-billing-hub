import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useGetPublicMenu, useCreateOrder } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Plus, Minus, UtensilsCrossed, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MenuStackLogo } from "@/components/logo";

interface CartItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
}

const fmt = (v: number) => `$${v.toFixed(2)}`;

export default function PublicMenu() {
  const { data: menuCategories, isLoading } = useGetPublicMenu();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [orderType, setOrderType] = useState<"in_person" | "online">("in_person");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const sectionRefs = useRef<Record<number, HTMLElement>>({});

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.menuItemId === item.id);
      if (ex) return prev.map((i) => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, menuItemName: item.name, quantity: 1, unitPrice: item.price }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.menuItemId === id);
      if (ex && ex.quantity > 1) return prev.map((i) => i.menuItemId === id ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter((i) => i.menuItemId !== id);
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    if (!menuCategories?.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        const topmost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = parseInt(topmost.target.getAttribute("data-cat-id") ?? "0");
        if (id) setActiveCategory(id);
      }
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    Object.values(sectionRefs.current).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menuCategories]);

  const scrollToCategory = (id: number) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    if (orderType === "in_person" && !tableNumber) {
      toast({ title: "Table required", description: "Please enter your table number.", variant: "destructive" });
      return;
    }
    if (orderType === "online" && !customerName.trim()) {
      toast({ title: "Name required", description: "Please enter your name for pickup.", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: {
        type: orderType,
        customerName: customerName.trim() || undefined,
        tableNumber: tableNumber ? parseInt(tableNumber, 10) : undefined,
        notes: notes.trim() || undefined,
        items: cart.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      },
    }, {
      onSuccess: (order) => {
        toast({ title: "Order placed!", description: `Order #${order.id} is being prepared.` });
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        setCart([]);
        setIsSheetOpen(false);
        setCustomerName("");
        setTableNumber("");
        setNotes("");
      },
      onError: () => toast({ title: "Failed to place order", description: "Please try again.", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <MenuStackLogo size={48} />
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const availableCategories = menuCategories?.filter((c) => c.items.length > 0) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-lg text-foreground">
            <MenuStackLogo size={28} />
            <span className="tracking-tight">MenuStack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Staff Portal
            </Link>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="relative h-9 px-4 gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold w-4.5 h-4.5 w-5 h-5 rounded-full flex items-center justify-center leading-none">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="px-5 py-4 border-b">
                  <SheetTitle>Your Order {cartCount > 0 && <span className="text-muted-foreground text-sm font-normal">({cartCount} items)</span>}</SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 p-8">
                    <ShoppingBag className="w-12 h-12 opacity-20" />
                    <p className="text-sm">Your cart is empty</p>
                    <p className="text-xs text-center">Browse the menu and tap Add to start your order</p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1">
                      <div className="px-5 py-4 space-y-3">
                        {cart.map((item) => (
                          <div key={item.menuItemId} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.menuItemName}</p>
                              <p className="text-xs text-muted-foreground">{fmt(item.unitPrice)} each</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => removeFromCart(item.menuItemId)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                              <button onClick={() => addToCart({ id: item.menuItemId, name: item.menuItemName, price: item.unitPrice })} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-sm font-bold min-w-[52px] text-right">{fmt(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="px-5 py-4 space-y-5">
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Order Type</Label>
                          <RadioGroup value={orderType} onValueChange={(v: "in_person" | "online") => setOrderType(v)} className="grid grid-cols-2 gap-2">
                            {[{ value: "in_person", label: "Dine In" }, { value: "online", label: "Takeaway" }].map((opt) => (
                              <label key={opt.value} className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${orderType === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>
                                <RadioGroupItem value={opt.value} className="sr-only" />{opt.label}
                              </label>
                            ))}
                          </RadioGroup>
                        </div>

                        {orderType === "in_person" ? (
                          <div className="space-y-1.5">
                            <Label htmlFor="table" className="text-sm font-medium">Table Number <span className="text-destructive">*</span></Label>
                            <Input id="table" type="number" min="1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 5" className="h-10" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-medium">Your Name <span className="text-destructive">*</span></Label>
                            <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="For your pickup order" className="h-10" />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label htmlFor="notes" className="text-sm font-medium">Special Requests <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
                          <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, extra sauce..." className="h-10" />
                        </div>
                      </div>
                    </ScrollArea>

                    <div className="px-5 py-4 border-t bg-background shrink-0">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Subtotal ({cartCount} items)</span>
                        <span className="text-xl font-bold">{fmt(cartTotal)}</span>
                      </div>
                      <Button className="w-full h-12 text-base font-semibold" onClick={handleSubmitOrder} disabled={createOrder.isPending}>
                        {createOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {createOrder.isPending ? "Placing Order..." : `Place Order · ${fmt(cartTotal)}`}
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {availableCategories.length > 1 && (
          <div className="max-w-5xl mx-auto border-t">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        {!availableCategories.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
            <UtensilsCrossed className="w-12 h-12 opacity-30" />
            <p>No menu items available right now.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {availableCategories.map((category) => (
              <section
                key={category.id}
                id={`cat-${category.id}`}
                data-cat-id={category.id}
                ref={(el) => { if (el) sectionRefs.current[category.id] = el; }}
              >
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{category.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => {
                    const inCart = cart.find((c) => c.menuItemId === item.id);
                    return (
                      <div key={item.id} className={`group relative flex flex-col bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all ${!item.isAvailable ? "opacity-50" : ""}`}>
                        {item.imageUrl && (
                          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-base leading-tight flex-1">{item.name}</h3>
                            <span className="font-bold text-primary shrink-0">{fmt(item.price)}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">{item.description}</p>
                          )}
                          <div className="mt-auto">
                            {!item.isAvailable ? (
                              <div className="w-full py-2 text-center text-sm text-muted-foreground border rounded-lg">Sold Out</div>
                            ) : inCart ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(item.id)} className="flex-1 h-9 rounded-lg border flex items-center justify-center gap-1 text-sm font-medium hover:bg-muted transition-colors">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-base min-w-[24px] text-center">{inCart.quantity}</span>
                                <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })} className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-1 text-sm font-medium hover:bg-primary/90 transition-colors">
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <Button className="w-full h-9" onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}>
                                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {cartCount > 0 && !isSheetOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 md:hidden">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm"
          >
            <span className="bg-white/20 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            View Order
            <span className="ml-1">{fmt(cartTotal)}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
