"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag } from "@/types";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tag name must be at least 2 characters.",
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid color code.",
  }),
});

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

interface TagDialogProps {
  trigger?: React.ReactNode;
  tagToEdit?: Tag;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TagDialog({ trigger, tagToEdit, open: controlledOpen, onOpenChange }: TagDialogProps) {
  const { addTag, updateTag } = useStore();
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: PRESET_COLORS[0],
    },
  });

  useEffect(() => {
    if (tagToEdit) {
      form.reset({
        name: tagToEdit.name,
        color: tagToEdit.color,
      });
    } else {
      form.reset({
        name: "",
        color: PRESET_COLORS[0],
      });
    }
  }, [tagToEdit, form, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (tagToEdit) {
      updateTag(tagToEdit.id, values);
    } else {
      addTag(values);
    }
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>{tagToEdit ? "Edit Tag" : "Create New Tag"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create tags to organize your tasks by category or urgency.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Urgent, Work, Personal" {...field} className="bg-slate-950 border-slate-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {PRESET_COLORS.map((color) => (
                        <div
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110",
                            field.value === color ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        >
                          {field.value === color && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                {tagToEdit ? "Save Changes" : "Create Tag"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
