"use client";

import { toast } from "sonner";
import { useState } from "react";

import Image from "next/image";
import { Conversation } from "@/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { getCreatedDate } from "@/utils";
import { createConversation } from "@/lib/actions";

export default function MessageDialog({
  messages,
  users,
  userSession,
}: {
  messages: Conversation[];
  users: {
    _id: string;
    username: string;
    profileImage?: string;
    createdAt: Date;
  }[];
  userSession: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function handleCreateConversation(id: string) {
    try {
      await createConversation(userSession, id);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    } finally {
      setIsOpen(false);
    }
  }
  if (messages.length >= 1) return null;

  return (
    <div className="flex h-full items-center justify-center p-5">
      {messages.length < 1 && (
        <div className="flex flex-col items-center">
          <Image
            className="mx-auto dark:invert"
            src={"/assets/messages/icons/mailbox.svg"}
            width={100}
            height={100}
            alt="mailbox"
          />
          <h2 className="pt-5 text-center text-3xl font-semibold">
            No Messages Yet
          </h2>
          <p>When you have messages, you will see them here</p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="mt-5">Create new message</Button>
            </DialogTrigger>
            <DialogContent>
              <div>
                {users?.map((user) => (
                  <div
                    key={user._id}
                    className="flex w-full items-center gap-3 rounded-md bg-white-700 p-4 dark:bg-primary-dark/90 "
                  >
                    <Image
                      src={user.profileImage ?? "/avatar.png"}
                      width={50}
                      alt="user"
                      height={50}
                      className="rounded-full object-contain"
                    />
                    <button
                      title="create conversation"
                      onClick={() => {
                        handleCreateConversation(user._id);
                      }}
                      className=" text-lg font-semibold capitalize"
                    >
                      {user.username}
                      <p className="cursor-auto text-xs font-light lowercase text-secondary dark:text-secondary-light">
                        Joined {getCreatedDate(user.createdAt)}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
