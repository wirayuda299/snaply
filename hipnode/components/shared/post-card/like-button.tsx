"use client";

import Image from "next/image";
import { toast } from "sonner";

import { Post } from "@/types";
import {
  createNotification,
  deleteNotification,
  likePost,
} from "@/lib/actions";

type LikeButtonProps = {
  username: string;
  userId: string;
  isLikedByCurrentUser: boolean;
  post: Post;
}

export default function LikeButton({
  post,
  userId,
  username,
  isLikedByCurrentUser,
}: LikeButtonProps) {
  const handleLike = async () => {
    try {
      await likePost(post._id, "/");

      // if (post.author._id !== userId) {
      if (!isLikedByCurrentUser) {
        await createNotification({
          to: post.author._id,
          from: userId,
          message: `${username} like your post`,
          type: "like",
          postId: post._id,
          model: 'post'
        });
      } else {
        await deleteNotification("like", post._id);
      }
      // }
    } catch (e) {
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
        className='size-9 rounded-lg bg-white-700 object-contain p-2 dark:bg-secondary-dark'
        src={"/assets/general/icons/filled-heart.svg"}
        width={40}
        height={40}
        alt="heart icon"
      />
    </button>
  );
}
