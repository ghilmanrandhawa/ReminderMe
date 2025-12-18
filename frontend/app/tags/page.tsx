"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { TagList } from "@/components/tags/TagList";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";

export default function TagsPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppLayout>
          <TagList />
        </AppLayout>
      </StoreProvider>
    </AuthProvider>
  );
}
