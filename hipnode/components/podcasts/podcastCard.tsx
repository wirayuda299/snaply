import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { currentUser } from "@clerk/nextjs";

import { Podcast } from "@/types";
import { getCreatedDate } from "@/utils";
const Parser = dynamic(() => import("../index").then((mod) => mod.Parser));
const DeleteButton = dynamic(() => import("./Delete-Button"));

export default async function PodcastCard({ podcast }: { podcast: Podcast }) {
  const userSession = await currentUser();
  if (!userSession) return null;

  return (
    <article
      className="h-min min-w-[250px] max-w-md rounded-xl bg-white p-5 dark:bg-secondary-dark-2 max-md:min-w-full"
      key={podcast._id}
    >
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/podcasts/${podcast._id}`}
          className="block  text-xl font-semibold text-secondary first-letter:uppercase dark:text-white-700"
        >
          {podcast.title}
        </Link>
        {userSession.id === podcast.author._id && (
          <DeleteButton id={podcast._id} />
        )}
      </div>
      <Parser content={podcast.body} styles="line-clamp-2" />

      <div className="mt-5 flex items-center gap-3">
        <Image
          className="size-14 rounded-full bg-white-800 p-2 dark:bg-secondary-dark-2"
          src={podcast.author?.profileImage ?? "/avatar.png"}
          width={50}
          height={50}
          alt="user"
          priority
        />
        <div>
          <h3 className="text-base font-semibold text-secondary dark:text-white-700">
            {podcast.author.username}
          </h3>
          <p className="text-xs text-secondary dark:text-secondary-light">
            {getCreatedDate(podcast.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
