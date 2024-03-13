"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { deletePodcast } from "@/lib/actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function handleDeletePodcast() {
    try {
      await deletePodcast(id);
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("An unknown error accured");
      }
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Trash2 color="red" size={25} />
      </DialogTrigger>
      <DialogContent className="bg-white-700 dark:border-primary-dark dark:bg-primary-dark">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action can&apos;t be undone. This will permanently delete your
            podcast.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-2">
          <Button className="!bg-red-600" onClick={handleDeletePodcast}>
            Delete
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
