import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import PublicMenu from "@/pages/public-menu";
import Dashboard from "@/pages/dashboard";
import Kitchen from "@/pages/kitchen";
import Cashier from "@/pages/cashier";
import Orders from "@/pages/orders";
import MenuManager from "@/pages/menu";
import Tables from "@/pages/tables";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicMenu} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/kitchen" component={Kitchen} />
      <Route path="/cashier" component={Cashier} />
      <Route path="/tables" component={Tables} />
      <Route path="/orders" component={Orders} />
      <Route path="/menu" component={MenuManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
