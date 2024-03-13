"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";

const tabs = ["posts", "meetups", "podcasts"] as const;

export default function Tab() {
  const params = useSearchParams();
  const router = useRouter();

  const [paramsType, setParamsType] = useState(params.get("type") || "posts");

  const handleClick = useCallback(
    (type: string) => {
      const url = formUrlQuery(params.toString(), "type", type) as string;
      router.push(url, { scroll: false });
      setParamsType(type);
    },
    [params, router],
  );

  return (
    <div className="no-scrollbar flex w-full justify-between  gap-5 overflow-x-auto rounded-md bg-white p-2 dark:bg-secondary-dark-2  md:p-4">
      {tabs.map((tab) => (
        <button
          onClick={() => handleClick(tab)}
          className={cn(
            "min-w-20 h-8 md:w-24 md:h-10 text-sm md:text-lg font-semibold text-center flex items-center justify-center rounded-full bg-transparent capitalize transition-all ease duration-300",
            paramsType === tab && "bg-primary text-white-700",
          )}
          key={tab}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
