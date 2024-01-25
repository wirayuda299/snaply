"use client";

import Image from "next/image";

import { likePost } from "@/lib/actions/post.action";
import { Post } from "@/types";

export default function LikeButton({
  post,
  isLikedByCurrentUser,
}: {
  isLikedByCurrentUser: boolean;
  post: Post;
}) {
  return (
    <button
      className={isLikedByCurrentUser ? "grayscale-0" : "grayscale-[50]"}
      onClick={() => likePost(post._id, "/")}
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
