import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MenuStackLogo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-6 p-4">
      <MenuStackLogo size={48} />
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">This page doesn't exist.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Customer Menu</Button>
        </Link>
      </div>
    </div>
  );
}
