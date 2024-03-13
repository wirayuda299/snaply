import Image from "next/image";
import Link from "next/link";

import { Podcast } from "@/types";

export default function PodcastCard({ podcasts }: { podcasts: Podcast[] }) {
  return (
    <div className="w-full rounded-lg bg-white p-3 dark:bg-secondary-dark-2 ">
      <header className="flex items-center gap-3 text-secondary dark:text-white-700">
        <h2 className="text-base font-semibold">Podcast</h2>
        <Image
          className="invert dark:invert-0"
          src="/assets/general/icons/arrow.svg"
          width={25}
          height={25}
          alt="arrow icon"
        />
      </header>
      <div className="flex flex-col gap-3 pt-4">
        {podcasts?.map((c) => (
          <Link
            href={`/podcasts/${c._id}`}
            className="mt-3 overflow-hidden"
            key={c._id}
          >
            <div className="flex justify-between gap-2 dark:text-white-700">
              <div className="flex gap-3">
                <Image
                  src={c.postImage}
                  className="aspect-auto object-contain"
                  width={60}
                  height={50}
                  alt={c.title}
                />
                <h3 className="line-clamp-2 truncate text-sm font-semibold capitalize text-secondary dark:text-white-700 md:text-lg">
                  {c.title}
                  <p className="truncate text-xs font-normal text-secondary-light">
                    by {c.author.username}
                  </p>
                </h3>
              </div>
              <Image
                className="aspect-auto w-5 object-contain invert dark:invert-0"
                src="/assets/general/icons/arrow.svg"
                width={40}
                height={10}
                alt="arrow icon"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
