"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Tag, RecurringPattern, TaskStatus } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface StoreContextType {
  tasks: Task[];
  tags: Tag[];
  recurringPatterns: RecurringPattern[];
  isLoading: boolean;
  
  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'status'> & { recurringInterval?: RecurringInterval }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markTaskComplete: (id: string) => void;
  markTaskIncomplete: (id: string) => void;
  
  // Tag Operations
  addTag: (tag: Omit<Tag, 'id' | 'ownerId'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Recurring Operations
  addRecurringPattern: (pattern: Omit<RecurringPattern, 'id'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

import { ReminderSystem } from "./ReminderSystem";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<RecurringPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount or user change
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setTags([]);
      setRecurringPatterns([]);
      setIsLoading(false);
      return;
    }

    const loadData = () => {
      try {
        const storedTasks = localStorage.getItem(`remindme_tasks_${user.id}`);
        const storedTags = localStorage.getItem(`remindme_tags_${user.id}`);
        const storedPatterns = localStorage.getItem(`remindme_patterns_${user.id}`);

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedTags) setTags(JSON.parse(storedTags));
        if (storedPatterns) setRecurringPatterns(JSON.parse(storedPatterns));
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save data whenever it changes
  useEffect(() => {
    if (!user || isLoading) return;
    localStorage.setItem(`remindme_tasks_${user.id}`, JSON.stringify(tasks));
  }, [tasks, user, isLoading]);

  useEffect(() => {
    if (!user || isLoading) return;
    localStorage.setItem(`remindme_tags_${user.id}`, JSON.stringify(tags));
  }, [tags, user, isLoading]);

  useEffect(() => {
    if (!user || isLoading) return;
    localStorage.setItem(`remindme_patterns_${user.id}`, JSON.stringify(recurringPatterns));
  }, [recurringPatterns, user, isLoading]);

  // Task Operations
  const addTask = (taskData: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'status'> & { recurringInterval?: RecurringInterval }) => {
    if (!user) return;
    
    const taskId = 'task_' + Math.random().toString(36).substr(2, 9);
    let recurringPatternId = undefined;

    // Handle recurring pattern creation if interval is provided
    if (taskData.recurringInterval) {
      const patternId = 'pattern_' + Math.random().toString(36).substr(2, 9);
      const newPattern: RecurringPattern = {
        id: patternId,
        taskId: taskId,
        interval: taskData.recurringInterval,
        lastInstanceDate: taskData.dueDate,
      };
      setRecurringPatterns(prev => [...prev, newPattern]);
      recurringPatternId = patternId;
    }
    
    const newTask: Task = {
      id: taskId,
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      tags: taskData.tags,
      reminderOffset: taskData.reminderOffset,
      recurringPatternId,
      ownerId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ));
    toast.success("Task updated");
  };

  const deleteTask = (id: string) => {
    // Soft delete (archive) or hard delete? PRD says soft delete (archive)
    // But "Delete" operation usually implies removal from active view.
    // Let's implement hard delete for simplicity in this context, or move to 'archived' status if we want to follow PRD strictly.
    // PRD says: "Tasks soft-deleted (archived for 30 days)".
    // Let's just set status to 'archived' for now.
    
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'archived', updatedAt: new Date().toISOString() } : task
    ));
    toast.success("Task moved to trash");
  };

  const markTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { 
        ...task, 
        status: 'completed', 
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      } : task
    ));
    toast.success("Task completed!");
    
    // Check for recurring pattern and create new instance if needed
    // This logic will be handled in a separate effect or helper, but for now simple check:
    const task = tasks.find(t => t.id === id);
    if (task && task.recurringPatternId) {
      handleRecurringTaskCompletion(task);
    }
  };

  const markTaskIncomplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { 
        ...task, 
        status: 'pending', 
        completedAt: undefined,
        updatedAt: new Date().toISOString() 
      } : task
    ));
  };

  const handleRecurringTaskCompletion = (completedTask: Task) => {
    // Simple recurring logic implementation
    const pattern = recurringPatterns.find(p => p.id === completedTask.recurringPatternId);
    if (!pattern) return;

    // Calculate new date based on interval
    const currentDueDate = new Date(completedTask.dueDate);
    let newDueDate = new Date(currentDueDate);
    
    if (pattern.interval === 'daily') {
      newDueDate.setDate(newDueDate.getDate() + 1);
    } else if (pattern.interval === 'weekly') {
      newDueDate.setDate(newDueDate.getDate() + 7);
    } else if (pattern.interval === 'monthly') {
      newDueDate.setMonth(newDueDate.getMonth() + 1);
    }

    const newTask: Task = {
      ...completedTask,
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      dueDate: newDueDate.toISOString().split('T')[0],
      status: 'pending',
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
    toast.info(`Next recurring task created for ${newDueDate.toLocaleDateString()}`);
  };

  // Tag Operations
  const addTag = (tagData: Omit<Tag, 'id' | 'ownerId'>) => {
    if (!user) return;
    const newTag: Tag = {
      ...tagData,
      id: 'tag_' + Math.random().toString(36).substr(2, 9),
      ownerId: user.id
    };
    setTags(prev => [...prev, newTag]);
    toast.success("Tag created");
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(tag => tag.id === id ? { ...tag, ...updates } : tag));
    toast.success("Tag updated");
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    // Also remove this tag from all tasks
    setTasks(prev => prev.map(task => ({
      ...task,
      tags: task.tags.filter(tagId => tagId !== id)
    })));
    toast.success("Tag deleted");
  };

  // Recurring Operations
  const addRecurringPattern = (patternData: Omit<RecurringPattern, 'id'>) => {
    const newPattern: RecurringPattern = {
      ...patternData,
      id: 'pattern_' + Math.random().toString(36).substr(2, 9),
    };
    setRecurringPatterns(prev => [...prev, newPattern]);
    return newPattern.id;
  };

  return (
    <StoreContext.Provider value={{
      tasks,
      tags,
      recurringPatterns,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      markTaskComplete,
      markTaskIncomplete,
      addTag,
      updateTag,
      deleteTag,
      addRecurringPattern
    }}>
      <ReminderSystem />
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}


