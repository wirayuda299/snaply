import { Podcast } from "@/types/podcast.type";
import Link from "next/link";
import Image from "next/image";

import { Parser } from "../index";

export default function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <article
      className="h-min max-w-xs rounded-xl bg-white p-5 dark:bg-secondary-dark-2 max-lg:max-w-full"
      key={podcast._id}
    >
      <Link
        href={`/podcasts/${podcast._id}`}
        className="block  text-xl font-semibold text-secondary first-letter:uppercase dark:text-white-700"
      >
        {podcast.title}
      </Link>
      <Parser content={podcast.body} />

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
            {podcast.author.region}, {podcast.author.country}
          </p>
        </div>
      </div>
    </article>
  );
}
