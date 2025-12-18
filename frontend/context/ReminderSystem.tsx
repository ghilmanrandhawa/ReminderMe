"use client";

import React, { useEffect } from 'react';
import { useStore } from './StoreContext';
import { toast } from 'sonner';
import { parseISO, differenceInMinutes, isPast } from 'date-fns';

// This component will be mounted in the layout to run background checks
export function ReminderSystem() {
  const { tasks } = useStore();

  useEffect(() => {
    // Check for reminders every minute
    const interval = setInterval(() => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.status !== 'pending') return;

        const dueDate = parseISO(`${task.dueDate}T${task.dueTime}`);
        
        // If task is already past due, don't remind (or maybe remind differently)
        if (isPast(dueDate)) return;

        const minutesUntilDue = differenceInMinutes(dueDate, now);
        
        // Check if it's time to remind (within 1 minute window of the offset)
        // We use a range because setInterval might not be exact
        if (minutesUntilDue <= task.reminderOffset && minutesUntilDue > task.reminderOffset - 1) {
          // Trigger "Email" simulation
          toast.custom((t) => (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 w-full max-w-md flex gap-4">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email Sent</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Reminder for: <span className="font-medium text-slate-700 dark:text-slate-300">{task.title}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Sent to user@example.com • Due in {minutesUntilDue} mins
                </p>
              </div>
            </div>
          ), { duration: 5000 });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  return null;
}
