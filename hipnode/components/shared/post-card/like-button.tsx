"use client";

import Image from "next/image";

import { Post } from "@/types";
import {
  createNotification,
  deleteNotification,
  likePost,
} from "@/lib/actions";
import { toast } from "sonner";

export default function LikeButton({
  post,
  userId,
  username,
  isLikedByCurrentUser,
}: {
  username: string;
  userId: string;
  isLikedByCurrentUser: boolean;
  post: Post;
}) {
  const handleLike = async () => {
    try {
      await likePost(post._id, "/");

      if (!isLikedByCurrentUser) {
        await createNotification({
          to: post.author._id,
          from: userId,
          message: `${username} like your post`,
          type: "like",
        });
      } else {
        await deleteNotification("like", post._id);
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  return (
    <button
      className={isLikedByCurrentUser ? "grayscale-0" : "grayscale-[50]"}
      onClick={handleLike}
    >
      <Image
        className={` size-9 rounded-lg bg-white-700 object-contain p-2 dark:bg-secondary-dark `}
        src={"/assets/general/icons/filled-heart.svg"}
        width={40}
        height={40}
        alt="heart icon"
      />
    </button>
  );
}
