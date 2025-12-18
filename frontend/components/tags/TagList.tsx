"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, Tag as TagIcon } from "lucide-react";
import { TagDialog } from "./TagDialog";
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

export function TagList() {
  const { tags, deleteTag } = useStore();
  const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTag(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Tags</h2>
        <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700 text-white">
          <TagIcon className="w-4 h-4 mr-2" />
          New Tag
        </Button>
      </div>

      <TagDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        tagToEdit={editingTag} 
      />

      {tags.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
          <TagIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No tags yet</h3>
          <p className="text-slate-500 mb-6">Create tags to organize your tasks.</p>
          <Button onClick={handleCreate} variant="outline" className="border-slate-700 text-teal-400 hover:bg-slate-800">
            Create your first tag
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]" 
                    style={{ backgroundColor: tag.color, boxShadow: `0 0 10px ${tag.color}40` }}
                  />
                  <span className="font-medium text-slate-200">{tag.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          This will permanently delete the tag "{tag.name}". Tasks using this tag will not be deleted, but the tag will be removed from them.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => deleteTag(tag.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
