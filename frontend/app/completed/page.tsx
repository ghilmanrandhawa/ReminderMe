"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { CompletedList } from "@/components/completed/CompletedList";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";

export default function CompletedPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppLayout>
          <CompletedList />
        </AppLayout>
      </StoreProvider>
    </AuthProvider>
  );
}
