"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { getUserById } from "@/lib/actions";
import { formUrlQuery } from "@/utils";
import { filterItems } from "@/constants";

type Props = {
  rootStyles?: string;
  innerStyles?: string;
  titleStyles?: string;
};

export default function Filter({
  rootStyles,
  innerStyles,
  titleStyles,
}: Props) {
  const user = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const {
    isLoading,
    data: currentUser,
    error,
    isError,
  } = useQuery({
    queryKey: [user.userId],
    queryFn: () => getUserById(user.userId as string),
    enabled: pathname === "/",
    throwOnError: false,
  });

  const handleClick = (label: string) => {
    router.push(formUrlQuery(params?.toString()!, "sort", label)!);
  };

  if (isLoading)
    return (
      <div className="min-h-[180px] w-full animate-pulse rounded-lg bg-white dark:bg-secondary-dark"></div>
    );
  if (isError) return <p>{error.message}</p>;

  return (
    <aside
      className={cn(
        "rounded-lg bg-white  dark:bg-secondary-dark-2 p-3 min-w-[218px]",
        rootStyles,
      )}
    >
      <ul
        className={cn(
          "flex gap-5 items-center md:items-start overflow-x-auto no-scrollbar space-x-3 md:flex-col ",
          innerStyles,
        )}
      >
        {filterItems(currentUser?.followings.length).map((item, i) => (
          <li
            onClick={() =>
              item.label !== "following" ? handleClick(item.label) : undefined
            }
            className="flex cursor-pointer items-center justify-start gap-2"
            key={item.label}
          >
            <Image
              src={item.icon}
              loading="lazy"
              width={28}
              height={28}
              alt={item.label}
            />
            <div
              className={
                item.label === "following" ? "flex items-center gap-3" : ""
              }
            >
              <h3
                className={cn(
                  "truncate text-sm font-semibold text-secondary dark:text-white-700",
                  titleStyles,
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "text-secondary-light hidden text-[10px] md:block",
                  item.label === "following" &&
                    "bg-primary w-7 h-7 rounded text-white-700 text-center font-semibold text-lg",
                )}
              >
                {item.subText}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
