"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { TaskItem } from "./TaskItem";
import { TaskDialog } from "./TaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, SortAsc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export function TaskList() {
  const { tasks, tags } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending"); // pending, completed, all
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter === "pending" && task.status !== "pending") return false;
    if (statusFilter === "completed" && task.status !== "completed") return false;
    if (task.status === "archived") return false; // Always hide archived in main list

    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tag filter
    if (tagFilter.length > 0) {
      const hasTag = task.tags.some(tagId => tagFilter.includes(tagId));
      if (!hasTag) return false;
    }

    return true;
  });

  // Sort tasks: Pending first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "pending" ? -1 : 1;
    }
    return new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime();
  });

  const toggleTagFilter = (tagId: string) => {
    setTagFilter(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Tasks</h2>
          <p className="text-slate-400">Manage your tasks and deadlines</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-800 bg-slate-950 text-slate-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-100">
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-800 bg-slate-950 text-slate-300 hover:text-white">
                <SortAsc className="w-4 h-4 mr-2" />
                Tags {tagFilter.length > 0 && `(${tagFilter.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-100">
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {tags.length === 0 ? (
                <div className="p-2 text-sm text-slate-500">No tags available</div>
              ) : (
                tags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag.id}
                    checked={tagFilter.includes(tag.id)}
                    onCheckedChange={() => toggleTagFilter(tag.id)}
                  >
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-1">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
              <CheckCircleIcon className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No tasks found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery || tagFilter.length > 0 
                ? "Try adjusting your filters or search query." 
                : "You're all caught up! Create a new task to get started."}
            </p>
            {!searchQuery && tagFilter.length === 0 && (
              <Button onClick={() => setIsCreateOpen(true)} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white">
                Create Task
              </Button>
            )}
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>

      <TaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
