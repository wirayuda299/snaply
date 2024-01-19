"use client";

import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";

import { GroupWithCurrentUser } from "@/types";

type ReturnTypes = {
  title: string;
  post: string;
  postImage: string;
  group: {
    id: string;
    name: string;
    profileImage: string;
  } | null;
  date: string;
  createType: string;
  tags: string[];
  country: string;
  address: string;
  companyName: string;
};

export default function GroupSelectContent({
  groups,
  form,
}: {
  groups: GroupWithCurrentUser[];
  form: UseFormReturn<ReturnTypes>;
}) {
  return (
    <div className="flex w-full flex-col gap-3 p-3 dark:bg-secondary-dark-2 md:flex-row">
      {groups.map((group) => (
        <div
          onClick={() =>
            form.setValue("group", {
              id: group.id,
              name: group.name,
              profileImage: group.profileImage,
            })
          }
          className="mb-2 flex cursor-pointer flex-col items-start  space-y-5"
          key={group.id}
        >
          <div className="w-full flex-1 rounded-lg  p-3">
            <div className=" flex gap-2">
              <Image
                className="aspect-auto h-5 w-5 rounded-full object-cover object-center"
                src={group.profileImage}
                alt="profile"
                width={20}
                height={20}
              />
              <h2 className="text-left text-lg font-semibold text-secondary">
                {group.name}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
