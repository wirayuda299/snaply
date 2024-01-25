import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import Tag from "../tag";
import { cn, getCreatedDate } from "@/lib/utils";
import LikeButton from "./like-button";
import PostTitle from "./title";
import Parser from "../parser";
import { Meetup, Post } from "@/types";

type PostCardTypes =
  | { type: "post"; post: Post }
  | { type: "meetup"; post: Meetup };

export default async function PostCard({ post, type }: PostCardTypes) {
  const user = await currentUser();
  if (!user) return null;

  const isLikedByCurrentUser =
    type === "post" && post?.likes?.includes(user.id);
  const date = new Date(post.createdAt);

  return (
    <div className="max-sm:max-h-auto dark:border-primary-dark dark:bg-secondary-dark-2 min-lg:max-h-[250px] w-full rounded-lg border bg-white p-3 md:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-3">
        {/* main image */}
        <picture
          className={cn(
            "relative aspect-square min-h-[120px] w-full h-24 sm:h-36 sm:w-36 md:h-44 md:w-40 lg:w-48 lg:h-48",
            type === "meetup" && "hidden md:block"
          )}
        >
          <Image
            className="aspect-square h-full min-h-full rounded-md object-cover object-center md:aspect-auto"
            src={post.image}
            fill
            sizes="100%"
            alt={post.title}
            priority
            fetchPriority="high"
          />
        </picture>

        <div className="flex flex-col justify-evenly gap-5 sm:shrink sm:grow sm:justify-between">
          <div className="flex w-full justify-between">
            <header>
              <PostTitle
                type={type}
                path={
                  type === "post" ? `/post/${post._id}` : `/meetups/${post._id}`
                }
                id={post._id}
                title={post.title}
              />
              {type === "meetup" && (
                <p className="text-secondary dark:text-secondary-light truncate text-xs">
                  {post.companyName} - {post.address}
                </p>
              )}
              {type === "post" && <Tag tags={post.tags} />}
              {type === "meetup" && <Parser content={post.body} />}
            </header>

            <div>
              {type === "post" ? (
                <LikeButton
                  post={post}
                  isLikedByCurrentUser={isLikedByCurrentUser}
                />
              ) : (
                <p className="text-secondary dark:bg-secondary-dark dark:text-secondary-light hidden h-20 w-14 flex-col items-center gap-1 rounded-md bg-white p-1 text-lg font-semibold md:flex">
                  <span className="uppercase">
                    {date.toLocaleString("en-US", { month: "short" })}
                  </span>
                  <span className="text-blue-600">{date.getDate()}</span>
                </p>
              )}
            </div>
          </div>

          {/* author */}
          <footer className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                className="dark:bg-secondary-dark rounded-full object-cover object-center p-2"
                src={post?.author?.profileImage ?? "/avatar.png"}
                loading="lazy"
                width={50}
                height={50}
                alt="user"
              />
              <div>
                <h4 className="text-secondary dark:text-white-700 text-xs font-semibold sm:text-sm">
                  {type === "post" ? post.author.username : post.companyName}
                </h4>
                {type === "post" && (
                  <p className="text-secondary dark:text-white-700 truncate text-[10px] sm:text-xs">
                    {getCreatedDate(post.createdAt)}
                  </p>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              {type === "post" && (
                <div className=" mt-auto flex flex-wrap gap-5">
                  <p className="text-secondary dark:text-white-700 text-xs font-semibold">
                    {post.views} views
                  </p>
                  <p className="text-secondary dark:text-white-700 text-xs font-semibold">
                    {post.likes.length} Likes
                  </p>
                  <p className="text-secondary dark:text-white-700 text-xs font-semibold">
                    {post.comments.length} comments
                  </p>
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
