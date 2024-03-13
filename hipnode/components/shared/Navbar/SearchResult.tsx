import Image from "next/image";
import Link from "next/link";
import { Dispatch, useRef } from "react";

import { cn } from "@/lib/utils";
import { Post, Meetup, Group, Podcast } from "@/types";
import { useClickOutside } from "@/hooks/useClickOutside";

type SearchResultType = {
  groups: Group[];
  post: Post[];
  podcasts: Podcast[];
  meetups: Meetup[];
};

const tabs = ["post", "meetups", "podcasts", "groups"];

const icons = {
  post: "/assets/general/icons/post.svg",
  meetups: "/assets/general/icons/calendar.svg",
  groups: "/assets/general/icons/group.svg",
  podcasts: "/assets/general/icons/podcast.svg",
};

type ActionTypes =
  | "SET_RESULT"
  | "TOOGLE_OPEN"
  | "SET_RESPONSE_KEYS"
  | "TOOGLE_DISABLED";

type StateTypes = {
  disabled: boolean;
  responseKeys: string[];
  searchRes: SearchResultType | null;
  isOpen: boolean;
};

export default function SearchResult({
  states,
  dispatch,
}: {
  states: StateTypes;
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => handleClickOutside());

  function handleClickOutside() {
    dispatch({ type: "SET_RESULT", payload: { result: null } });
  }

  if (!states.searchRes) return null;
  return (
    <div
      ref={ref}
      className="absolute left-0 top-14 z-50 !w-full max-w-xl rounded-lg border bg-white p-3 dark:border-secondary-dark dark:bg-primary-dark"
    >
      <div className="no-scrollbar flex w-full items-center gap-3 overflow-x-auto border-b border-white-700 border-b-white-800 pb-3 dark:border-b-secondary">
        <h3 className="hidden truncate text-base font-semibold md:block">
          Type :{" "}
        </h3>
        {tabs.map((tab) => (
          <button
            title={tab}
            key={tab}
            className={cn(
              " rounded-full px-3 py-1 text-sm font-normal capitalize",
              states.responseKeys.includes(tab)
                ? "bg-primary text-white-700 "
                : "bg-white-700 dark:bg-secondary-dark",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        <h4 className="py-3 text-base font-semibold">Top Match</h4>
        {tabs.map(
          (key) =>
            states.searchRes !== null &&
            // @ts-ignore
            states?.searchRes[key]?.map((data) => (
              <div
                key={data._id}
                className="flex max-h-[300px] items-center gap-3 overflow-y-auto"
              >
                <Image
                  // @ts-ignore
                  src={icons[key] as string}
                  width={25}
                  height={25}
                  alt={key}
                  className="object-contain"
                />
                <div>
                  <Link
                    href={`${key}/${data._id}`}
                    className="truncate text-base font-semibold capitalize"
                  >
                    {/* @ts-ignore */}
                    {data?.title || data?.name}
                  </Link>

                  <p className="text-base font-semibold capitalize text-primary">
                    {key}
                  </p>
                </div>
              </div>
            )),
        )}
      </div>
    </div>
  );
}
