"use client";

import React from 'react';
import { Loader2, Bell, Calendar, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl">
            <Bell className="w-16 h-16 text-teal-400" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Remind<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Me</span>
        </h1>
        
        <p className="text-xl text-slate-300 mb-10 leading-relaxed">
          Building your intelligent task companion. <br/>
          Never miss a deadline again with proactive reminders.
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700">
          <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
          <span className="text-slate-300 font-medium">Setting up your workspace...</span>
        </div>
      </div>
    </div>
  );
}
