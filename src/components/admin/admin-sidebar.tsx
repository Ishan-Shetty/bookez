"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Building,
  Monitor,
  CalendarDays,
  Ticket,
  Home,
  LogOut,
  Users
} from "lucide-react";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Theaters", href: "/admin/theaters", icon: Building },
  { label: "Screens", href: "/admin/screens", icon: Monitor },
  { label: "Shows", href: "/admin/shows", icon: CalendarDays },
  { label: "Bookings", href: "/admin/bookings", icon: Ticket },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-3 py-4">
      <div className="mb-8 flex items-center px-3">
        <h1 className="text-xl font-bold">BookEZ Admin</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button 
        variant="ghost" 
        className="mt-auto flex w-full items-center justify-start"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="mr-3 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
