"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";

const SharePost = dynamic(() => import("./Share"));
const Report = dynamic(() => import("./Report"));

export type PostStatsType = {
  icon: string;
  alt: string;
  value: number;
  label: string;
};

type PostStatsProps = {
  stats: PostStatsType[];
  postAuthorName: string;
  postId: string;
};

const PostStats = ({ stats, postAuthorName, postId }: PostStatsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <aside className="dark:bg-secondary-dark-2 w-full rounded-xl bg-white p-5">
      <ul className="space-y-5">
        {stats.map((stat) => (
          <li className="flex items-center gap-5" key={stat.label}>
            {stat.label === "Share" ? (
              <SharePost
                isOpen={isOpen}
                postId={postId}
                setIsIopen={setIsOpen}
                stat={stat}
              />
            ) : (
              <>
                <Image
                  src={stat.icon}
                  width={20}
                  height={20}
                  alt={stat.label}
                />
                <span className="text-secondary dark:text-secondary-light">
                  {stat.value} {stat.label}
                </span>
              </>
            )}
          </li>
        ))}
        <Report postId={postId} user={postAuthorName} />
      </ul>
    </aside>
  );
};

export default PostStats;
