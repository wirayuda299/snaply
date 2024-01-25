"use client";

import Image from "next/image";
import { useState } from "react";

import { joinGroup, leaveGroup } from "@/lib/actions/group.action";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ActionButton({
  groupId,
  userId,
  isMember,
  isAdmin,
}: {
  groupId: string;
  userId: string;
  isMember: boolean;
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleGroupAction = async () => {
    try {
      if (isMember) {
        await leaveGroup(groupId, userId).then(handleToggle);
      } else {
        await joinGroup(groupId, userId);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
    }
  };

  return (
    <>
      {isMember && (
        <Dialog open={isOpen} onOpenChange={handleToggle}>
          <DialogTrigger className="flex h-10 w-20 items-center justify-center gap-2 rounded bg-white-700 hover:bg-white-800 dark:bg-primary-dark dark:hover:bg-secondary-dark-2 max-sm:w-full">
            <Image
              src={"/assets/groups/icons/leave.svg"}
              width={20}
              height={19}
              alt="leave icon"
            />
            <span className="font-semibold text-secondary dark:text-white-700">
              Leave
            </span>
          </DialogTrigger>
          <DialogContent className="flex justify-center bg-white dark:bg-primary-dark">
            <DialogHeader>
              <DialogTitle className="text-darkSecondary-900 text-center text-lg dark:text-white-800 sm:text-left">
                Are You Sure to Leave From This Group?
              </DialogTitle>
              <div className="flex items-center gap-5 pt-[30px]">
                <Button
                  onClick={handleGroupAction}
                  className=" w-[160px] bg-white-700 text-secondary hover:bg-white-800 dark:bg-secondary-dark dark:text-white dark:hover:bg-secondary-dark-2 max-sm:w-full"
                >
                  Leave Group
                </Button>
                <DialogClose className="text-darkSecondary-800 w-[160px] bg-transparent text-lg hover:bg-transparent max-sm:w-full">
                  Cancel
                </DialogClose>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {!isMember ||
        (isAdmin && (
          <Button
            onClick={handleGroupAction}
            className="flex h-10 w-20 items-center justify-center gap-2 rounded bg-white-700 text-secondary hover:bg-white-800 dark:bg-primary-dark dark:text-white dark:hover:bg-secondary-dark-2 max-sm:w-full"
          >
            Join
          </Button>
        ))}
    </>
  );
}
