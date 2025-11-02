"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BarChart3, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Inbox", icon: MessageSquare },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="flex flex-col w-64 border-r bg-slate-50 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📨 Inbox</h1>
        <Badge className="mt-2 bg-blue-600">Pro</Badge>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Button variant="outline" className="w-full justify-start">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </aside>
  );
}
