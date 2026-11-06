"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  Flame,
  Kanban,
  Mail,
  Calendar as CalendarIcon,
  User,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Compass },
  { label: "Opportunities", href: "/opportunities", icon: Sparkles },
  { label: "Priority Queue", href: "/priority", icon: Flame, badge: "3" },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Tracker", href: "/tracker", icon: Kanban },
  { label: "Inbox", href: "/inbox", icon: Mail, badge: "AI" },
  { label: "Calendar", href: "/calendar", icon: CalendarIcon },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-sm">
              N
            </div>
            <span>Nudge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors relative",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5",
                      item.badge === "AI" ? "bg-primary/20 text-primary" : "bg-destructive/15 text-destructive"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/notifications"
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground relative transition-colors border border-transparent hover:border-border"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </Link>

          <ThemeToggle />

          <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
              SS
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
