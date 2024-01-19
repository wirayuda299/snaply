"use client";

import Image from "next/image";
import Link from "next/link";

import { GroupWithAuthor } from "@/types";
import useSelectedGroup from "@/hooks/useSelectedGroup";

export default function Sidebar({ groups }: { groups: GroupWithAuthor[] }) {
  const { handleSelectedGroup, selectedGroup } = useSelectedGroup(null);

  return (
    <aside className=" top-0 hidden h-full min-w-[250px] items-start justify-start gap-2.5 overflow-y-auto rounded-2xl bg-white p-3 dark:bg-secondary-dark-2 max-md:w-full lg:sticky lg:flex lg:h-screen">
      <div className="flex w-full flex-col items-start justify-start gap-5">
        {selectedGroup && (
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white-800 dark:bg-secondary-dark-2"
            onClick={handleSelectedGroup}
          >
            <Image
              className="rotate-180 invert dark:invert-0"
              src={"/assets/general/icons/arrow.svg"}
              width={20}
              alt="back icon"
              height={20}
            />
          </button>
        )}
        {selectedGroup ? (
          <div>{selectedGroup.name}</div>
        ) : (
          <>
            <h2 className="py-3 text-lg font-semibold">All Groups</h2>
            {groups?.map((group) => (
              <div key={group.id}>
                <header className="flex gap-3">
                  <Image
                    className="h-12 w-12 rounded-full object-cover object-center"
                    src={group.profileImage}
                    width={50}
                    height={50}
                    alt={group.name}
                  />
                  <Link href={`/groups/${group.id}`}>
                    <h3 className="truncate text-base font-semibold text-secondary dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-[10px] font-light text-secondary dark:text-secondary-light">
                      Created by{" "}
                      <span className="capitalize">{group.author?.name}</span>
                    </p>
                  </Link>
                </header>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
