"use client";

import Link from "next/link";
import { toast } from "sonner";
import { MessageCircleMore } from "lucide-react";

import { createConversation } from "@/lib/actions";

export default function MessageLink({
  userSession,
  receiverId,
}: {
  userSession: string;
  receiverId: string;
}) {
  async function handleCreateConversation() {
    try {
      await createConversation(userSession, receiverId);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  }
  return (
    <Link
      onClick={handleCreateConversation}
      href={`/message`}
      className="group bg-blue-10 hover:bg-transparent dark:bg-secondary-dark-2"
    >
      <MessageCircleMore
        stroke="#2FA8F2"
        className="bg-transparent text-black transition-colors duration-500 ease-in-out group-hover:text-primary dark:text-white-700"
      />
    </Link>
  );
}
