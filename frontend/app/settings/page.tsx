"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function SettingsContent() {
  const { user, logout } = useAuth();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue={user?.name} className="bg-slate-950 border-slate-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email} disabled className="bg-slate-950 border-slate-800 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-500">Receive emails for task reminders</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Browser Notifications</Label>
              <p className="text-sm text-slate-500">Show popup notifications in browser</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white">
          Save Changes
        </Button>
        <Button variant="destructive" onClick={logout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppLayout>
          <SettingsContent />
        </AppLayout>
      </StoreProvider>
    </AuthProvider>
  );
}
