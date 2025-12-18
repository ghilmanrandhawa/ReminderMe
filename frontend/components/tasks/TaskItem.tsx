"use client";

import React, { useState } from "react";
import { Task, Tag } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Repeat, Edit2, Trash2, AlertCircle } from "lucide-react";
import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { TaskDialog } from "./TaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { tags, markTaskComplete, markTaskIncomplete, deleteTask } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  const taskTags = task.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];
  
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
  const isDueToday = isToday(dueDate);
  
  // Determine urgency color based on tags or due date
  // PRD: "Tag-based color coding provides sufficient urgency visualization"
  // But we also want to show overdue status
  
  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      markTaskComplete(task.id);
    } else {
      markTaskIncomplete(task.id);
    }
  };

  return (
    <>
      <Card className={cn(
        "mb-3 transition-all duration-300 hover:shadow-lg border-l-4",
        task.status === 'completed' 
          ? "bg-slate-900/30 border-slate-800 border-l-slate-600 opacity-60" 
          : "bg-slate-900/80 border-slate-800 hover:bg-slate-900",
        isOverdue && task.status !== 'completed' ? "border-l-red-500" : 
        isDueToday && task.status !== 'completed' ? "border-l-orange-500" : "border-l-teal-500"
      )}>
        <CardContent className="p-4 flex items-start gap-4">
          <Checkbox 
            checked={task.status === 'completed'} 
            onCheckedChange={handleStatusChange}
            className="mt-1 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={cn(
                  "font-medium text-lg leading-none mb-1 truncate pr-4",
                  task.status === 'completed' ? "text-slate-500 line-through" : "text-slate-100"
                )}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-slate-400 line-clamp-1 mb-2">{task.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <div className={cn(
                "flex items-center gap-1",
                isOverdue ? "text-red-400 font-medium" : isDueToday ? "text-orange-400 font-medium" : ""
              )}>
                <Calendar className="w-3 h-3" />
                <span>
                  {isToday(dueDate) ? "Today" : isTomorrow(dueDate) ? "Tomorrow" : format(dueDate, "MMM d")}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.dueTime}</span>
              </div>

              {task.recurringPatternId && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Repeat className="w-3 h-3" />
                  <span>Recurring</span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {taskTags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                    style={{ 
                      backgroundColor: `${tag.color}15`, 
                      color: tag.color,
                      borderColor: `${tag.color}30`
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <TaskDialog 
        open={isEditing} 
        onOpenChange={setIsEditing} 
        taskToEdit={task} 
      />
    </>
  );
}
