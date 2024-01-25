"use client";

import Image from "next/image";
import { toast } from "sonner";

import { likePost } from "@/lib/actions/post.action";

export default function LikeButton({
  id,
  isLikedByCurrentUser,
}: {
  id: string;
  isLikedByCurrentUser: boolean;
}) {
  const handleLikePost = async () => {
    try {
      await likePost(id, "/groups");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleLikePost();
      }}
      className={
        "aspect-square w-5 max-w-full shrink-0 items-center justify-center overflow-hidden object-contain object-center"
      }
      aria-label="like"
      role="button"
    >
      <Image
        width={25}
        height={25}
        src={
          isLikedByCurrentUser
            ? "/assets/general/icons/filled-heart.svg"
            : "/assets/general/icons/heart.svg"
        }
        alt="heart icon"
      />
    </button>
  );
}
