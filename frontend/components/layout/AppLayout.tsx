"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-950 text-slate-100">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b border-slate-800/50 flex items-center px-4 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10">
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <div className="ml-auto flex items-center gap-4">
              {/* Header actions can go here */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                AM
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-8 relative">
            {/* Background ambient effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/10 via-slate-950 to-slate-950"></div>
            </div>
            <div className="relative z-10 max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
        <Toaster theme="dark" position="top-right" />
      </div>
    </SidebarProvider>
  );
}
