"use client";

import Image from "next/image";

import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type ItemProps = {
  title: string;
  label: string;
  icon: string;
  subText: string;
};

type Props = {
  items: Readonly<ItemProps[]>;
  rootStyles?: string;
  innerStyles?: string;
  titleStyles?: string;
};

export default function Filter({
  items,
  rootStyles,
  innerStyles,
  titleStyles,
}: Props) {
  const params = useSearchParams();
  const router = useRouter();

  const handleClick = (label: string) => {
    router.push(formUrlQuery(params?.toString()!, "sort", label)!);
  };
  return (
    <aside
      className={cn(
        "rounded-lg bg-white dark:bg-secondary-dark-2 p-3 min-w-[218px]",
        rootStyles,
      )}
    >
      <ul
        className={cn(
          "flex gap-5 items-center md:items-start overflow-x-auto no-scrollbar space-x-3 md:flex-col",
          innerStyles,
        )}
      >
        {items.map((item, i) => (
          <li
            onClick={() => (item.label ? handleClick(item.label) : undefined)}
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
            <div>
              <h3
                className={cn(
                  "truncate text-sm font-semibold text-secondary dark:text-white-700",
                  titleStyles,
                )}
              >
                {item.title}
              </h3>
              {item.subText && (
                <p className="hidden text-[10px] text-secondary-light md:block">
                  {item.subText}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
