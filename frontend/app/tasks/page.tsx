"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { TaskList } from "@/components/tasks/TaskList";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";

export default function TasksPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppLayout>
          <TaskList />
        </AppLayout>
      </StoreProvider>
    </AuthProvider>
  );
}
