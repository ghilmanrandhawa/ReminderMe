"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";

export default function DashboardPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </StoreProvider>
    </AuthProvider>
  );
}
