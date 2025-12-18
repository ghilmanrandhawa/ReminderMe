"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { TaskItem } from "@/components/tasks/TaskItem";
import { CheckCircle } from "lucide-react";

export function CompletedList() {
  const { tasks } = useStore();
  
  const completedTasks = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => {
      // Sort by completedAt desc (most recent first)
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Completed Tasks</h2>
        <p className="text-slate-400">History of your accomplishments</p>
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
          <CheckCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No completed tasks yet</h3>
          <p className="text-slate-500">Finish some tasks to see them here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
