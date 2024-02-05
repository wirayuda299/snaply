"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { useUser } from "@clerk/nextjs";
import { createNotification, uploadComment } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Props = {
  parentId: string | null;
  postId: string;
  postAuthorId: string;
};

export default function CommentInput({
  parentId,
  postId,
  postAuthorId,
}: Props) {
  const user = useUser();
  const [loading, setIsLoading] = useState<boolean>(false);

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await uploadComment({
        // @ts-ignore
        comment: e.target.comment.value,
        parentId: parentId || null,
        postId,
        author: user?.user?.id!,
      });
      await createNotification({
        to: postAuthorId,
        from: user.user?.id!,
        model: "post",
        message: "comment on your post",
        postId,
        type: "comment",
        // @ts-ignore
        comments: e.target.comment.value,
      });

      // @ts-ignore
      e.target.comment.value = "";
      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Something wrong");
      }
    }
  }
  return (
    <form className="flex items-center gap-3" onSubmit={handleComment}>
      <div className="flex size-14 items-center justify-center rounded-full bg-white-700 p-1 dark:bg-secondary-dark-2">
        <Image
          className="rounded-full"
          src={user.user?.imageUrl ?? "/avatar.png"}
          width={50}
          height={50}
          alt="user"
          priority
        />
      </div>
      <Input
        disabled={loading}
        required
        autoComplete="off"
        name="comment"
        placeholder="Add comment"
        className={cn(
          "rounded-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
          loading && "animate-pulse",
        )}
      />
    </form>
  );
}
