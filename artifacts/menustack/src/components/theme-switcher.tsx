import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const THEMES = [
  { id: "default",       label: "MenuStack",      color: "#f97316", dark: false },
  { id: "toast-dark",    label: "Toast Dark",     color: "#f59e0b", dark: true  },
  { id: "square-clean",  label: "Square Clean",   color: "#2563eb", dark: false },
  { id: "clover-green",  label: "Clover Green",   color: "#15803d", dark: false },
  { id: "midnight-navy", label: "Midnight Navy",  color: "#7c3aed", dark: true  },
  { id: "rose-gold",     label: "Rose Gold",      color: "#be123c", dark: false },
  { id: "forest",        label: "Forest Bistro",  color: "#2d6a4f", dark: false },
  { id: "slate",         label: "Slate Pro",      color: "#1d4ed8", dark: false },
  { id: "ember",         label: "Ember Fine",     color: "#991b1b", dark: false },
  { id: "arctic",        label: "Arctic Fresh",   color: "#0f766e", dark: false },
];

export function useTheme() {
  const [theme, setThemeState] = useState<string>(() => {
    return localStorage.getItem("menustack-theme") ?? "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const t = THEMES.find((t) => t.id === theme);
    if (t?.dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("menustack-theme", theme);
  }, [theme]);

  return { theme, setTheme: setThemeState };
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: active.color }} />
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{active.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-2">Design Theme</p>
        <div className="space-y-0.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                theme === t.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
              }`}
            >
              <span className="w-4 h-4 rounded-full border-2 shrink-0" style={{ backgroundColor: t.color, borderColor: theme === t.id ? t.color : "transparent" }} />
              {t.label}
              {t.dark && <span className="ml-auto text-[10px] text-muted-foreground">Dark</span>}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
