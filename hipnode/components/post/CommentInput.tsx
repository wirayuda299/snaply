"use client";

import Image from "next/image";
import { FormEvent } from "react";

import { Input } from "../ui/input";
import { useUser } from "@clerk/nextjs";
import { uploadComment } from "@/lib/actions";

type Props = {
  parentId: string | null;
  postId: string;
};

export default function CommentInput({ parentId, postId }: Props) {
  const user = useUser();

  async function handleComment(e: FormEvent) {
    e.preventDefault();

    await uploadComment({
      // @ts-ignore
      comment: e.target.comment.value,
      parentId: parentId ? parentId : null,
      postId,
      author: user?.user?.id!,
    });
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
        required
        autoComplete="off"
        name="comment"
        placeholder="Add comment"
        className="rounded-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </form>
  );
}
