"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getCreatedDate } from "@/utils";
import { Message } from "@/types/messages.type";
import { updateIsRead } from "@/lib/actions";

export default function Messages({ messages }: { messages: Message[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  async function handleClick(id: string, senderId: string) {
    try {
      await updateIsRead(id, senderId);
    } catch (error) {
      toast.error("Error");
    } finally {
      setOpen(false);
    }
  }
  return (
    <div className="relative">
      <button
        title="messages"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-md bg-white-800 p-2 dark:bg-secondary-dark"
      >
        <Image
          className="aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0"
          src="/assets/general/icons/chat.svg"
          width={20}
          height={20}
          loading="lazy"
          alt="bell icon"
        />
        {messages.length >= 1 && (
          <div className="absolute right-1 top-1 size-2 rounded-full bg-primary"></div>
        )}
      </button>
      <ul
        ref={ref}
        className={cn(
          "absolute min-h-96 top-0 hidden -left-40 p-3 bg-white rounded-lg border-white-800 dark:border-secondary-dark-2 dark:bg-secondary-dark-2 border z-50 max-sm:w-64 w-96 sm:-left-80",
          open && "flex flex-col gap-5 top-10",
        )}
      >
        {messages.length < 1 ? (
          <div className="flex w-full flex-col items-center pt-5 ">
            <MessagesSquare size={50} />
            <p className="pt-3">Your message will show here</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b dark:border-b-secondary">
              <h3 className=" py-5 text-xl font-semibold">Messages</h3>
              <span className="text-hite  flex size-7  items-center justify-center rounded-full bg-primary text-center font-semibold text-white-700">
                {messages.length}
              </span>
            </div>
            {messages.map((msg) => (
              <Link
                onClick={() => handleClick(msg.messageId, msg.senderId._id!)}
                key={msg._id}
                href={`/message?id=${msg.messageId}&to=${msg.senderId._id}`}
                className={cn(
                  "rounded-md p-3",
                  msg.isRead
                    ? "dark:bg-secondary-dark text-secondary dark:text-white-700 bg-gray-50"
                    : "bg-primary text-white-700",
                )}
              >
                <li className="flex items-center gap-3">
                  <Image
                    src={msg.senderId?.profileImage ?? "/avatar.png"}
                    width={40}
                    height={40}
                    alt={msg.senderId?.username}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold capitalize">
                        {msg.senderId.username}
                      </h4>{" "}
                      <span
                        className={cn(
                          "text-xs text-gray-400",
                          !msg.isRead
                            ? "text-white-700"
                            : "text-secondary dark:text-white-700",
                        )}
                      >
                        {getCreatedDate(msg.createdAt)}
                      </span>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </li>
              </Link>
            ))}

            <Link href={"/message"} className="mx-auto text-primary ">
              See all in messenger
            </Link>
          </>
        )}
      </ul>
    </div>
  );
}
