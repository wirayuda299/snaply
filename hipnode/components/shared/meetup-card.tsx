import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/components/index";
import { Meetup } from "@/types";

export default function MeetupCard({ meetups }: { meetups: Meetup[] }) {
  return (
    <div className="w-full rounded-lg bg-white p-3 dark:bg-secondary-dark-2 ">
      <header className="flex items-center gap-3 text-secondary dark:text-white-700">
        <h2 className="text-base font-semibold">Meetups</h2>
        <Image
          className="invert dark:invert-0"
          src="/assets/general/icons/arrow.svg"
          width={25}
          height={25}
          alt="arrow icon"
        />
      </header>
      <div className="flex flex-col gap-3 overflow-hidden pt-2">
        {meetups?.map((c) => (
          <Link
            href={`/meetups/${c._id}`}
            className="mt-4 flex gap-4"
            key={c._id}
          >
            <div className="flex h-max w-11 flex-col items-center bg-white-700 p-2 text-secondary dark:rounded-md dark:bg-secondary-dark dark:text-white-700">
              <h3 className="text-xl font-bold uppercase">
                {new Date(c.createdAt).toLocaleString("en-US", {
                  month: "short",
                })}
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Date(c.createdAt).getDate()}
              </p>
            </div>
            <div>
              <h3 className="line-clamp-1 truncate text-sm font-semibold capitalize text-secondary dark:text-white-700 md:text-base">
                {c.title}
              </h3>

              <div className="flex items-center gap-2">
                <Image
                  src={c.image}
                  className="mt-2 size-6 rounded-full object-cover"
                  width={15}
                  height={15}
                  alt=""
                />
                <p className="truncate pt-2 text-xs dark:text-white-700">
                  {c.companyName} - {c.address}
                </p>
              </div>
              <Tag tags={c.tags} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
