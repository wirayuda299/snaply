import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";

import type { Post } from "@prisma/client";
import LikeButton from "./like-button";

export default async function PostCard({
  post,
}: {
  post: Post & {
    group: {
      id: string;
      name: string;
      profileImage: string;
      author: {
        name: string;
      };
    };
    author: {
      name: string;
    };
  };
}) {
  const user = await currentUser();
  if (!user) return null;

  const isLikedByCurrentUser = post.likes.includes(
    user.emailAddresses[0].emailAddress
  );
  return (
    <article className="card flex h-min w-min max-w-[250px] grow flex-col items-stretch rounded-2xl bg-white p-2.5 dark:bg-secondary-dark-2 max-md:max-w-full max-sm:max-w-full">
      <header className="card-header flex items-stretch justify-between gap-2.5">
        <Image
          width={34}
          height={34}
          loading="lazy"
          src={post.group.profileImage}
          className=" h-[34px] w-[34px] max-w-full shrink-0 overflow-hidden rounded-full object-cover object-center"
          alt="Profile Picture"
        />
        <Link
          href={`/post/${post.id}`}
          className="card-info flex grow basis-[0%] flex-col items-stretch"
        >
          <h2 className="card-title text-xs font-semibold leading-5 text-secondary dark:text-white">
            {post.group.name}
          </h2>
          <p className="card-author text-xs leading-4 text-secondary dark:text-white">
            {post.group.author.name}
          </p>
        </Link>
      </header>
      <Image
        width={300}
        height={300}
        priority
        fetchPriority="high"
        src={post.postImage}
        className="mt-2.5 aspect-[1.81] w-full overflow-hidden rounded-lg object-cover object-center"
        alt="post image"
      />
      <form className="card-actions mt-2.5 flex items-stretch gap-5 pr-20">
        <LikeButton id={post.id} isLikedByCurrentUser={isLikedByCurrentUser} />
        <Link
          href={`/post/${post.id}`}
          className="aspect-square w-5 max-w-full shrink-0 overflow-hidden object-contain object-center "
          aria-label="comment"
          role="button"
        >
          <Image
            width={25}
            height={25}
            loading="lazy"
            src="/assets/groups/icons/comment.svg"
            alt="comment icon"
          />
        </Link>
        <button
          className="card-action-button aspect-square w-5 max-w-full shrink-0 overflow-hidden object-contain object-center"
          aria-label="share"
          role="button"
        >
          <Image
            width={25}
            height={25}
            loading="lazy"
            src="/assets/groups/icons/share.svg"
            alt="share"
          />
        </button>
      </form>
      <h3 className="card-subtitle pt-2 text-sm font-semibold leading-6 text-secondary dark:text-white">
        {post.title}
      </h3>
      <time className="card-date mt-2.5 text-xs leading-5 text-neutral-400">
        {new Date(post.createdAt).toDateString()}
      </time>
    </article>
  );
}
