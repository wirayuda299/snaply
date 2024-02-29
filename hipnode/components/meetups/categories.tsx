"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/utils";

export default function Categories({
  categories,
  title,
}: {
  title: string;
  categories: Readonly<string[]>;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  function handleClick(category: string) {
    const current = params.get("category");

    if (current !== category) {
      const url = formUrlQuery(params.toString(), "category", category);
      router.push(url!);
    } else {
      router.push(pathName);
    }
  }
  return (
    <div className="dark:bg-secondary-dark-2 h-min w-full rounded-lg bg-white p-3">
      <h2 className="dark:text-white-700 text-lg font-semibold">{title}</h2>
      <ul className="mt-4 flex w-full flex-col gap-3">
        {categories.map((category) => (
          <li
            onClick={() => handleClick(category)}
            key={category}
            className="flex justify-between text-base font-semibold capitalize"
          >
            <label
              className="text-secondary dark:text-white-700"
              htmlFor={category}
            >
              {category}
            </label>
            <input
              className="block"
              checked={params.get("category") === category}
              type="checkbox"
              id={category}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
