"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Task, Tag, RecurringInterval } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:MM).",
  }),
  tags: z.array(z.string()),
  reminderOffset: z.string(), // We'll parse this to number
  isRecurring: z.boolean().default(false),
  recurringInterval: z.enum(["daily", "weekly", "monthly"]).optional(),
});

interface TaskDialogProps {
  trigger?: React.ReactNode;
  taskToEdit?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskDialog({ trigger, taskToEdit, open: controlledOpen, onOpenChange }: TaskDialogProps) {
  const { addTask, updateTask, tags, addRecurringPattern, recurringPatterns } = useStore();
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Find existing recurring pattern if editing
  const existingPattern = taskToEdit?.recurringPatternId 
    ? recurringPatterns.find(p => p.id === taskToEdit.recurringPatternId)
    : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueTime: "09:00",
      tags: [],
      reminderOffset: "15",
      isRecurring: false,
      recurringInterval: "weekly",
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        dueDate: new Date(taskToEdit.dueDate),
        dueTime: taskToEdit.dueTime,
        tags: taskToEdit.tags,
        reminderOffset: taskToEdit.reminderOffset.toString(),
        isRecurring: !!taskToEdit.recurringPatternId,
        recurringInterval: existingPattern?.interval || "weekly",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: new Date(),
        dueTime: "09:00",
        tags: [],
        reminderOffset: "15",
        isRecurring: false,
        recurringInterval: "weekly",
      });
    }
  }, [taskToEdit, existingPattern, form, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const taskData = {
      title: values.title,
      description: values.description,
      dueDate: format(values.dueDate, "yyyy-MM-dd"),
      dueTime: values.dueTime,
      tags: values.tags,
      reminderOffset: parseInt(values.reminderOffset),
    };

    if (taskToEdit) {
      // Update existing task
      updateTask(taskToEdit.id, taskData);
      
      // Handle recurring pattern updates if needed (simplified for MVP)
      // Ideally we'd update the pattern if it changed
    } else {
      // Create new task
      addTask({
        ...taskData,
        recurringInterval: values.isRecurring ? (values.recurringInterval as RecurringInterval) : undefined,
      });
    }
    
    setOpen(false);
    form.reset();
  }

  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tags");
    if (currentTags.includes(tagId)) {
      form.setValue("tags", currentTags.filter(id => id !== tagId));
    } else {
      form.setValue("tags", [...currentTags, tagId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Set your deadline and we'll remind you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} className="bg-slate-950 border-slate-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details..." {...field} className="bg-slate-950 border-slate-800 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-slate-950 border-slate-800 hover:bg-slate-900 hover:text-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="bg-slate-900 text-slate-100"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="time" {...field} className="bg-slate-950 border-slate-800 pl-10" />
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => {
                      const isSelected = form.getValues("tags").includes(tag.id);
                      return (
                        <div
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm cursor-pointer border transition-all",
                            isSelected 
                              ? "bg-slate-800 border-transparent text-white" 
                              : "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500"
                          )}
                          style={isSelected ? { backgroundColor: `${tag.color}20`, borderColor: tag.color, color: tag.color } : {}}
                        >
                          {tag.name}
                        </div>
                      );
                    })}
                    {tags.length === 0 && (
                      <span className="text-sm text-slate-500 italic">No tags created yet. Go to Tags page to add some.</span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reminderOffset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remind me before</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-950 border-slate-800">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="1440">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-800 p-4 bg-slate-950/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Recurring Task
                      </FormLabel>
                      <FormDescription>
                        Repeat this task?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("isRecurring") && (
              <FormField
                control={form.control}
                name="recurringInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat Interval</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-950 border-slate-800">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto">
                {taskToEdit ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

