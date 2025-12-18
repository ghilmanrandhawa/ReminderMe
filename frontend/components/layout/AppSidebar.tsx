"use client";

import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  CheckCircle, 
  Tags, 
  Settings, 
  Bell,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Completed",
    url: "/completed",
    icon: CheckCircle,
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Tags,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-800/50">
        <div className="flex items-center gap-2 px-2 w-full">
          <div className="bg-gradient-to-br from-teal-400 to-blue-500 p-1.5 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 group-data-[collapsible=icon]:hidden">
            RemindMe
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url || pathname?.startsWith(`${item.url}/`)}
                    tooltip={item.title}
                    className="data-[active=true]:bg-teal-500/10 data-[active=true]:text-teal-400 hover:bg-slate-800/50 hover:text-teal-400 transition-all duration-200"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-800/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => {
                // Mock logout - will be implemented with AuthContext
                window.location.href = "/";
              }}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
