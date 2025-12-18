"use client";

import React, { useState } from 'react';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(async () => {
      await login(email);
      setIsSubmitting(false);
    }, 1000);
  };

  // If already logged in, redirect (handled in AuthContext usually, but good to have here too)
  // Actually AuthContext doesn't auto-redirect on mount, so we rely on the user flow.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 mb-4 shadow-lg shadow-teal-500/20">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Remind<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Me</span>
          </h1>
          <p className="text-slate-400">Never miss a deadline again.</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">Enter your email to access your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-teal-500/20"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-medium py-6 shadow-lg shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-800/50 pt-6">
            <div className="flex gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Smart Reminders</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
