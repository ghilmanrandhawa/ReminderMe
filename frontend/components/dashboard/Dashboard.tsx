"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskItem } from "@/components/tasks/TaskItem";
import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";
import { isToday, isPast, isTomorrow, parseISO } from "date-fns";

export function Dashboard() {
  const { tasks, user } = useStore();

  // Calculate stats
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const dueToday = pendingTasks.filter(t => isToday(parseISO(t.dueDate)));
  const overdue = pendingTasks.filter(t => isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)));
  const upcoming = pendingTasks.filter(t => !isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)));

  // Sort due today by time
  dueToday.sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Guest'}
        </h1>
        <p className="text-slate-400">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Due Today</CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dueToday.length}</div>
            <p className="text-xs text-slate-500">Tasks needing attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overdue.length}</div>
            <p className="text-xs text-slate-500">Missed deadlines</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{upcoming.length}</div>
            <p className="text-xs text-slate-500">Scheduled for later</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedTasks.length}</div>
            <p className="text-xs text-slate-500">Total tasks finished</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Due Today & Overdue */}
        <div className="lg:col-span-2 space-y-6">
          {overdue.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Overdue Tasks
              </h2>
              <div className="space-y-2">
                {overdue.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Due Today
            </h2>
            {dueToday.length === 0 ? (
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-teal-500/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300">All caught up!</h3>
                <p className="text-slate-500">You have no tasks due today.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dueToday.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Upcoming */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-300">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.slice(0, 5).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
            {upcoming.length === 0 && (
              <p className="text-slate-500 text-sm">No upcoming tasks scheduled.</p>
            )}
            {upcoming.length > 5 && (
              <p className="text-slate-500 text-sm text-center pt-2">
                + {upcoming.length - 5} more tasks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
